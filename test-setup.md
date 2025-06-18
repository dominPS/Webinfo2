# Konfiguracja testów jednostkowych dla WebInfo

Ten plik zawiera propozycję konfiguracji testów jednostkowych i integracyjnych dla projektu WebInfo.

## Instalacja zależności

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jsdom
```

## Konfiguracja Vitest

Utwórz plik `vitest.config.ts` w głównym katalogu projektu:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
})
```

## Plik konfiguracyjny testów

Utwórz plik `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Auto clean up after each test
afterEach(() => {
  cleanup()
})

// Mock dla react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (params) {
        return `${key} ${JSON.stringify(params)}`
      }
      return key
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    },
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}))

// Mock dla react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
  NavLink: ({ children, to }: { children: React.ReactNode, to: string }) => (
    <a href={to} data-testid="navlink">
      {children}
    </a>
  ),
  Outlet: () => <div data-testid="outlet" />,
}))
```

## Przykładowy test komponentu

Przykładowy test dla komponentu `Logo.tsx`:

```typescript
// src/shared/components/Logo.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'

describe('Logo Component', () => {
  it('renders full logo by default', () => {
    render(
      <ThemeProvider>
        <Logo />
      </ThemeProvider>
    )
    
    const logoWrapper = screen.getByTestId('logo-wrapper')
    expect(logoWrapper).toBeInTheDocument()
    expect(logoWrapper.childNodes.length).toBe(2) // Icon + Brand
  })
  
  it('renders only icon when onlyIcon prop is true', () => {
    render(
      <ThemeProvider>
        <Logo onlyIcon />
      </ThemeProvider>
    )
    
    const logoWrapper = screen.getByTestId('logo-wrapper')
    expect(logoWrapper).toBeInTheDocument()
    expect(logoWrapper.childNodes.length).toBe(1) // Only Icon
  })
})
```

## Przykładowy test hooka

Przykładowy test dla hooka `useAuth`:

```typescript
// src/hooks/useAuth.test.ts
import { describe, it, expect } from 'vitest'
import { useAuth } from './useAuth'
import { act, renderHook } from '@testing-library/react'

describe('useAuth Hook', () => {
  it('should initialize with not logged in state', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.user).toBe(null)
  })
  
  it('should login with valid credentials', () => {
    const { result } = renderHook(() => useAuth())
    
    act(() => {
      const success = result.current.login('employee', 'employee')
      expect(success).toBe(true)
    })
    
    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.user).toEqual({
      id: 'employee',
      username: 'employee',
      role: 'employee'
    })
  })
  
  it('should not login with invalid credentials', () => {
    const { result } = renderHook(() => useAuth())
    
    act(() => {
      const success = result.current.login('invalid', 'invalid')
      expect(success).toBe(false)
    })
    
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.user).toBe(null)
  })
  
  it('should logout properly', () => {
    const { result } = renderHook(() => useAuth())
    
    // First login
    act(() => {
      result.current.login('employee', 'employee')
    })
    
    expect(result.current.isLoggedIn).toBe(true)
    
    // Then logout
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.user).toBe(null)
  })
})
```

## Skrypty w package.json

Dodaj następujące skrypty do pliku `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## Struktura testów

Zalecana struktura dla plików testowych:

```
src/
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── LoginPage.test.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts
├── shared/
│   ├── components/
│   │   ├── Logo.tsx
│   │   └── Logo.test.tsx
└── test/
    ├── setup.ts
    ├── mocks/
    │   └── handlers.ts  # MSW handlers
    └── utils/
        └── test-utils.tsx  # Custom render functions
```

## Rozszerzenie dla testów integracyjnych

Dla testów integracyjnych, zaleca się utworzenie niestandardowej funkcji renderującej, która zapewni wszystkie niezbędne providery:

```typescript
// src/test/utils/test-utils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'

// Wrapper z wszystkimi providerami
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  )
}

// Funkcja renderująca z providerami
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-eksport wszystkiego z testing-library
export * from '@testing-library/react'
export { customRender as render }
```

## Przykład użycia renderowania z providerami

```typescript
// src/features/navigation/Sidebar.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils/test-utils'
import { Sidebar } from './Sidebar'

describe('Sidebar Component', () => {
  it('renders navigation items', () => {
    render(<Sidebar />)
    
    // Test, czy elementy nawigacyjne są renderowane
    expect(screen.getByText('navigation.mobileApps')).toBeInTheDocument()
    expect(screen.getByText('navigation.attendanceList')).toBeInTheDocument()
  })
  
  it('toggles collapse state when button is clicked', () => {
    render(<Sidebar />)
    
    // Sprawdź, czy pasek boczny jest początkowo rozwinięty
    const expandedSidebar = screen.getByRole('complementary')
    expect(expandedSidebar).toHaveStyle({ width: '320px' })
    
    // Kliknij przycisk zwijania
    const collapseButton = screen.getByTitle('navigation.collapseSidebar')
    fireEvent.click(collapseButton)
    
    // Sprawdź, czy pasek boczny jest teraz zwinięty
    const collapsedSidebar = screen.getByRole('complementary')
    expect(collapsedSidebar).toHaveStyle({ width: '60px' })
  })
})
```

Ten plik zawiera podstawową konfigurację dla testów jednostkowych i integracyjnych w projekcie WebInfo. Należy go dostosować do konkretnych potrzeb projektu i uzupełnić o bardziej szczegółowe testy komponentów, hooków i funkcji.
