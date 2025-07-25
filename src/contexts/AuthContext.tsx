import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authServices';

interface User {
  id: string;
  email: string;
  user: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (res.success) {
      const userData = await authService.getCurrentUser();
      // Fallback: jeśli backend nie zwraca username, ustaw na email przed @
      setUser({
        ...userData,
        user: userData?.user || (userData?.email ? userData.email.split('@')[0] : ''),
      });
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          setUser({
            ...userData,
            user: userData?.user || (userData?.email ? userData.email.split('@')[0] : ''),
          });
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};