import { apiClient } from '../client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types';

export class AuthService {
  private static readonly ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  };

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      this.ENDPOINTS.LOGIN,
      credentials
    );
    
    // Set the token in the API client for future requests
    if (response.token) {
      apiClient.setAuthToken(response.token);
      // Store token in localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  static async register(userData: RegisterRequest): Promise<User> {
    return apiClient.post<User>(this.ENDPOINTS.REGISTER, userData);
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post(this.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage and API client token
      apiClient.setAuthToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  static initializeAuth(): User | null {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        apiClient.setAuthToken(token);
        return user;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuth();
      }
    }
    
    return null;
  }

  static clearAuth(): void {
    apiClient.setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Error parsing current user:', error);
        return null;
      }
    }
    return null;
  }
}

export default AuthService;
