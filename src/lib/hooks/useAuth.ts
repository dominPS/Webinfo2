import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../api/services';
import type { LoginRequest, RegisterRequest } from '../api/types';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  current: () => [...authKeys.all, 'current'] as const,
};

// Queries
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.current(),
    queryFn: () => AuthService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.current(), data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
    },
  });
};
