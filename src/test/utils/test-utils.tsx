import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { BrowserRouter } from 'react-router-dom'

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
