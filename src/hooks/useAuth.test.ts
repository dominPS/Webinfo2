import { describe, it, expect, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth hook', () => {
  beforeEach(() => {
    // Reset store state
    useAuth.getState().logout();
  });

  it('should start with user not logged in', () => {
    const { isLoggedIn, user } = useAuth.getState();
    expect(isLoggedIn).toBe(false);
    expect(user).toBeNull();
  });

  it('should successfully log in with valid credentials', () => {
    const { login } = useAuth.getState();
    
    // Test each valid credential
    const testCredentials = [
      { username: 'pracownik', password: 'pracownik', role: 'employee' },
      { username: 'employee', password: 'employee', role: 'employee' },
      { username: 'kierownik', password: 'kierownik', role: 'manager' },
      { username: 'manager', password: 'manager', role: 'manager' },
      { username: 'admin', password: 'admin', role: 'admin' }
    ];
    
    testCredentials.forEach(cred => {
      // Reset state before each test
      useAuth.getState().logout();
      
      // Test login
      const result = login(cred.username, cred.password);
      expect(result).toBe(true);
      
      // Check state after login
      const { isLoggedIn, user } = useAuth.getState();
      expect(isLoggedIn).toBe(true);
      expect(user).not.toBeNull();
      expect(user?.username).toBe(cred.username);
      expect(user?.role).toBe(cred.role);
    });
  });

  it('should reject invalid credentials', () => {
    const { login } = useAuth.getState();
    const result = login('invalid', 'credentials');
    
    expect(result).toBe(false);
    
    const { isLoggedIn, user } = useAuth.getState();
    expect(isLoggedIn).toBe(false);
    expect(user).toBeNull();
  });

  it('should log out successfully', () => {
    const { login, logout } = useAuth.getState();
    
    // Log in first
    login('admin', 'admin');
    expect(useAuth.getState().isLoggedIn).toBe(true);
    
    // Then log out
    logout();
    
    const { isLoggedIn, user } = useAuth.getState();
    expect(isLoggedIn).toBe(false);
    expect(user).toBeNull();
  });
});
