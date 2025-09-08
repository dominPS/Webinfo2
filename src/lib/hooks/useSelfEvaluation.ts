import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SelfEvaluationService } from '../api/services';
import type { 
  SelfEvaluationFormData, 
  SelfEvaluationFilters,
  SelfEvaluation 
} from '../api/types';

// Query Keys
export const selfEvaluationKeys = {
  all: ['selfEvaluations'] as const,
  lists: () => [...selfEvaluationKeys.all, 'list'] as const,
  list: (filters?: SelfEvaluationFilters) => [...selfEvaluationKeys.lists(), filters] as const,
  details: () => [...selfEvaluationKeys.all, 'detail'] as const,
  detail: (id: number) => [...selfEvaluationKeys.details(), id] as const,
  my: () => [...selfEvaluationKeys.all, 'my'] as const,
};

// Queries
export const useSelfEvaluations = (filters?: SelfEvaluationFilters) => {
  return useQuery({
    queryKey: selfEvaluationKeys.list(filters),
    queryFn: () => SelfEvaluationService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSelfEvaluation = (id: number) => {
  return useQuery({
    queryKey: selfEvaluationKeys.detail(id),
    queryFn: () => SelfEvaluationService.getById(id),
    enabled: !!id,
  });
};

export const useMySelfEvaluations = (filters?: Omit<SelfEvaluationFilters, 'employeeId'>) => {
  return useQuery({
    queryKey: [...selfEvaluationKeys.my(), filters],
    queryFn: () => SelfEvaluationService.getMy(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutations
export const useCreateSelfEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SelfEvaluationFormData) => SelfEvaluationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: selfEvaluationKeys.all });
    },
  });
};

export const useUpdateSelfEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SelfEvaluationFormData> }) =>
      SelfEvaluationService.update(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(selfEvaluationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: selfEvaluationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: selfEvaluationKeys.my() });
    },
  });
};

export const useDeleteSelfEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SelfEvaluationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: selfEvaluationKeys.all });
    },
  });
};

export const useSubmitSelfEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SelfEvaluationService.submit(id),
    onSuccess: (data) => {
      queryClient.setQueryData(selfEvaluationKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: selfEvaluationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: selfEvaluationKeys.my() });
    },
  });
};
