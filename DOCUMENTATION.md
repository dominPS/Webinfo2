# WebInfo - Project Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Application Architecture](#application-architecture)
3. [Folder Structure](#folder-structure)
4. [Technologies](#technologies)
5. [Main Components](#main-components)
6. [State Management](#state-management)
7. [Routing](#routing)
8. [Internationalization (i18n)](#internationalization-i18n)
9. [Styling](#styling)
10. [Authentication](#authentication)
11. [Running the Application](#running-the-application)
12. [Development Guidelines](#development-guidelines)
13. [Testing](#testing)

## Introduction

WebInfo is a modern web application built with React, TypeScript, and Vite, designed as an employee information management system. The application offers a high-quality user interface that is responsive, available in multiple languages, and follows UX best practices.

## Application Architecture

The application is built according to a component-based architecture, utilizing Feature-Driven Development (FDD) patterns. The main architectural elements are:

- **MainLayout**: Main layout with sidebar and navigation bar (TopBar)
- **Sidebar**: Side navigation menu with collapsible functionality
- **Dashboard**: Main application page
- **Routing**: Path and navigation management
- **Zustand**: Application state management
- **i18n**: Support for multiple languages (EN, PL, FR, DE, UK)

## Folder Structure

```
src/
  ├── App.tsx                  # Main application component
  ├── main.tsx                 # Application entry point
  ├── i18n.ts                  # Internationalization configuration
  ├── features/                # Application features
  │   ├── ai/                  # AI-related functions
  │   ├── auth/                # Authentication and authorization
  │   ├── clients/             # Client management
  │   ├── dashboard/           # Main page
  │   ├── invoices/            # Invoice management
  │   ├── licenses/            # License management
  │   ├── navigation/          # Navigation components
  │   ├── pages/               # Various application pages
  │   └── settings/            # Settings
  ├── hooks/                   # Custom React hooks
  │   ├── useAuth.ts           # Authentication hook
  │   └── useUIState.ts        # UI state hook
  ├── layouts/                 # Page layout templates
  │   └── MainLayout.tsx       # Main application layout
  ├── shared/                  # Shared resources
  │   ├── components/          # Shared components
  │   ├── routes/              # Routing configuration
  │   ├── styles/              # Shared styles
  │   └── theme/               # Theme configuration
  └── types/                   # TypeScript type definitions
```

## Technologies

- **React 19** - Library for building user interfaces
- **TypeScript** - Typed JavaScript
- **Vite** - Fast build and development tool
- **React Router** - Application routing
- **Emotion** - Component styling with CSS-in-JS
- **i18next** - Internationalization
- **Zustand** - Application state management
- **React Query** - Query and server state management

## Main Components

### MainLayout

The main application layout that contains common interface elements such as the sidebar, top bar, and footer. All subpages are rendered within this layout as children through the `Outlet` from React Router.

### Sidebar

Sidebar containing the application logo and navigation menu with collapsible functionality. The sidebar can be collapsed to an icon view or expanded with full section names.

Key features:
- Collapse/expand functionality
- Multilingual navigation
- Icon support
- Logout/login button
- Active item styling

### Dashboard

The main page of the application, which displays different views depending on the authentication state:
- For unauthenticated users: welcome screen with login options
- For authenticated users: personalized dashboard with information

### Logo and ReportsLogo

Components responsible for displaying the application logo in the sidebar and top bar. The logo in the top bar (ReportsLogo) also serves as a link to the main page.

### LanguageSelector

Component allowing users to change the application language. Supports five languages: English, Polish, French, German, and Ukrainian.

## State Management

The application uses Zustand for global state management. The main stores are:

### useAuth

Manages authentication state, including:
- User login/logout
- Storing logged-in user information
- Permission checking

```typescript
interface AuthState {
  isLoggedIn: boolean;
  user: {
    id: string;
    username: string;
    role: 'employee' | 'manager' | 'admin';
  } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```

### useUIState

Manages user interface state:
- Login form visibility
- Other UI states

```typescript
interface UIState {
  showLoginForm: boolean;
  setShowLoginForm: (show: boolean) => void;
}
```

## Routing

Routing is managed using React Router. The main configuration is in the file `src/shared/routes/index.tsx`.

Example paths:
- `/` - Dashboard (main page)
- `/login` - Login page
- `/mobile-apps` - Mobile Apps
- `/attendance-list` - Attendance List
- `/settings` - Settings

## Internationalization (i18n)

The application supports five languages:
- English (EN) - default
- Polish (PL)
- French (FR)
- German (DE)
- Ukrainian (UK)

The i18n configuration is in the file `src/i18n.ts`. Translations are stored in the directory `public/locales/{language_code}/translation.json`.

Usage example:
```tsx
const { t } = useTranslation();
<Title>{t('homepage.title')}</Title>
```

## Styling

The application uses Emotion for component styling. A CSS-in-JS approach is used, which allows for:
- Props-based styling
- Style inheritance
- Application theme management

Global styles and theme configuration are in `src/shared/theme`.

## Authentication

The application uses a simple demo authentication system with predefined users:
- employee/employee - employee view
- manager/manager - manager view
- admin/admin - administrator view

In a real production environment, a more secure authentication system should be implemented, e.g., using JWT or OAuth.

## Running the Application

To run the application locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Build the production version:
   ```
   npm run build
   ```

4. Preview the production version:
   ```
   npm run preview
   ```

## Development Guidelines

### Adding a New Page

1. Create a new page component in the appropriate directory in `src/features`
2. Add a new path in the routing configuration (`src/shared/routes/index.tsx`)
3. Add a navigation item in `src/features/navigation/Sidebar.tsx`
4. Add translations for the new page in all language files

### Adding a New Language

1. Create a new directory with the language code in `public/locales/`
2. Copy the `translation.json` file from an existing language
3. Translate all keys
4. Add the language to the language selector in `src/shared/components/LanguageSelector.tsx`
5. Add the language code to the i18n configuration in `src/i18n.ts`

### Known Issues and Solutions

- **Login Issue**: After logging in while in Dashboard display mode, the user may lose access to navigation. The solution is to change the logic in the Dashboard component to always display within the MainLayout context.
- **Navigation to the Main Page**: Currently, you can only return to the main page by clicking on the "Reports" logo in the top bar. Consider adding a "Dashboard" link in the side menu.

## Testing

WebInfo should include a comprehensive set of automated tests ensuring code stability and quality. At this stage of the project, it is recommended to implement the following types of tests:

### Unit Tests

Unit tests should cover business logic, data transformations, and complex functions, particularly:

- UI Components (rendering, interactions)
- Custom hooks (`useAuth`, `useUIState`)
- Helper and utility functions
- Zustand stores and their actions

**Recommended tools:**
- Jest or Vitest as the testing framework
- React Testing Library for component testing
- MSW (Mock Service Worker) for API request mocking

```typescript
// Example component test with React Testing Library
import { render, screen } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';

test('renders language options', () => {
  render(<LanguageSelector />);
  expect(screen.getByText('English')).toBeInTheDocument();
  expect(screen.getByText('Polski')).toBeInTheDocument();
});
```

### Integration Tests

Integration tests should check the cooperation between different parts of the application:

- Interactions between components
- Authentication flows
- Global state changes
- Navigation and routing
- Handling of international formats

### End-to-End Tests (E2E)

E2E tests simulate user actions in the application, checking entire workflows:

- Login and logout flow
- Navigation through the application
- Language switching
- Form interactions

**Recommended tools:**
- Cypress or Playwright for E2E tests

```typescript
// Example Cypress test
describe('Authentication Flow', () => {
  it('should allow user to login', () => {
    cy.visit('/');
    cy.get('[data-testid="login-button"]').click();
    cy.get('#username').type('employee');
    cy.get('#password').type('employee');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('You are logged in as employee');
  });
});
```

### Accessibility Tests

For the usability of the application, it is also recommended to test accessibility:

- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Text contrasts and sizes

**Recommended tools:**
- axe-core or jest-axe for automated accessibility tests
- Lighthouse for general accessibility assessment

### CI/CD Configuration

Tests should be integrated with the CI/CD pipeline:

- Running unit and integration tests on each pull request
- E2E tests run before deployment to the test environment
- Generating code coverage reports

### Test Implementation Plan

1. **High priority:**
   - Unit tests for key components (Sidebar, MainLayout, Dashboard)
   - Authentication logic tests
   - Language change tests

2. **Medium priority:**
   - Routing and navigation tests
   - Integration tests for main flows
   - Accessibility tests for basic views

3. **Low priority:**
   - E2E tests for complex scenarios
   - Performance tests
   - Visual Regression Tests
