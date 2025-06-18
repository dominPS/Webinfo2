import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'

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
vi.mock('react-router-dom', () => {
  const Link = ({ children, to }: { children: React.ReactNode, to: string }) => 
    React.createElement('a', { href: to, 'data-testid': 'link' }, children);
  
  const NavLink = ({ children, to }: { children: React.ReactNode, to: string }) => 
    React.createElement('a', { href: to, 'data-testid': 'navlink' }, children);
  
  const Outlet = () => React.createElement('div', { 'data-testid': 'outlet' });
  
  return {
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    Link,
    NavLink,
    Outlet,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => 
      React.createElement('div', { 'data-testid': 'browser-router' }, children)
  };
})
