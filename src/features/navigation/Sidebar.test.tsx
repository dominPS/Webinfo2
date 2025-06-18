import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import { Sidebar } from '@/features/navigation/Sidebar';

// Mockujemy moduły na poziomie modułu
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    user: null,
    logout: vi.fn()
  })
}));

vi.mock('@/hooks/useUIState', () => ({
  useUIState: () => ({
    setShowLoginForm: vi.fn()
  })
}));

describe('Sidebar Component', () => {
  it('renders correctly when expanded', () => {
    render(<Sidebar />);
    
    // Sprawdź, czy elementy UI są renderowane
    expect(screen.getByText('navigation.login')).toBeInTheDocument();
  });

  it('collapses and expands sidebar when collapse button is clicked', () => {
    render(<Sidebar />);
    
    // Znajdź i kliknij przycisk zwijania
    const collapseButton = screen.getByTitle('navigation.collapseSidebar');
    fireEvent.click(collapseButton);
    
    // Po zwinięciu powinien pojawić się przycisk rozwijania
    expect(screen.getByTitle('navigation.expandSidebar')).toBeInTheDocument();
    
    // Kliknij przycisk rozwijania
    const expandButton = screen.getByTitle('navigation.expandSidebar');
    fireEvent.click(expandButton);
    
    // Po rozwinięciu powinien ponownie pojawić się przycisk zwijania
    expect(screen.getByTitle('navigation.collapseSidebar')).toBeInTheDocument();
  });

  it('displays navigation items correctly', () => {
    render(<Sidebar />);
    
    // Sprawdzamy, czy elementy nawigacyjne są renderowane
    // Ze względu na mockowanie react-router-dom w setup.ts, nie możemy sprawdzić dokładnych linków
    // Ale możemy sprawdzić, czy używany jest odpowiedni klucz tłumaczenia
    expect(screen.getByText('navigation.mobileApps', { exact: false })).toBeInTheDocument();
  });
});
