import { create } from 'zustand';

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

export const useAuth = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (username: string, password: string) => {
    // Demo authentication logic
    const validCredentials = [
      { username: 'pracownik', password: 'pracownik', role: 'employee' as const },
      { username: 'employee', password: 'employee', role: 'employee' as const },
      { username: 'kierownik', password: 'kierownik', role: 'manager' as const },
      { username: 'manager', password: 'manager', role: 'manager' as const },
      { username: 'admin', password: 'admin', role: 'admin' as const },
    ];

    const credential = validCredentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (credential) {
      set({
        isLoggedIn: true,
        user: {
          id: credential.username,
          username: credential.username,
          role: credential.role,
        },
      });
      return true;
    }
    return false;
  },
  logout: () => {
    set({
      isLoggedIn: false,
      user: null,
    });
  },
}));
