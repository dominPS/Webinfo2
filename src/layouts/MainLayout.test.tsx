import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { MainLayout } from '@/layouts/MainLayout';

// Mockujemy moduły używane w MainLayout
vi.mock('@/features/navigation/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar-mock">Sidebar Mock</div>
}));

vi.mock('@/shared/components/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector-mock">Language Selector Mock</div>
}));

vi.mock('@/shared/components/ReportsLogo', () => ({
  ReportsLogo: () => <div data-testid="reports-logo-mock">Reports Logo Mock</div>
}));

vi.mock('@/shared/components/TopMenu', () => ({
  TopMenu: () => <div data-testid="top-menu-mock">TopMenu Mock</div>
}));

vi.mock('@/shared/components/Footer', () => ({
  Footer: () => <div data-testid="footer-mock">Footer Mock</div>
}));

describe('MainLayout Component', () => {
  it('renders all main components correctly', () => {
    render(<MainLayout />);
    
    // Sprawdź, czy wszystkie główne komponenty są renderowane
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector-mock')).toBeInTheDocument();
    expect(screen.getByTestId('reports-logo-mock')).toBeInTheDocument();
    expect(screen.getByTestId('top-menu-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  it('renders the outlet for router content', () => {
    render(<MainLayout />);
    
    // Sprawdź, czy outlet (mock z setup.ts) jest renderowany
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders the profile button with user name', () => {
    render(<MainLayout />);
    
    // Sprawdź, czy przycisk profilu zawiera imię użytkownika
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it('renders the notification button', () => {
    render(<MainLayout />);
    
    // Sprawdź, czy przycisk powiadomień jest renderowany
    expect(screen.getByTitle('header.notifications')).toBeInTheDocument();
  });
});
