import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IDPService } from '../api/services';
import type { 
  CreateIDPPlanRequest,
  CreateIDPGoalRequest,
  UpdateIDPGoalRequest,
  IDPFilters 
} from '../api/types';

// Query Keys
export const idpKeys = {
  all: ['idp'] as const,
  lists: () => [...idpKeys.all, 'list'] as const,
  list: (filters?: IDPFilters) => [...idpKeys.lists(), filters] as const,
  details: () => [...idpKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...idpKeys.details(), id] as const,
  my: () => [...idpKeys.all, 'my'] as const,
};

// Queries
export const useIDPPlans = (filters?: IDPFilters) => {
  return useQuery({
    queryKey: idpKeys.list(filters),
    queryFn: () => IDPService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useIDPPlan = (id: number) => {
  return useQuery({
    queryKey: idpKeys.detail(id),
    queryFn: () => IDPService.getById(id),
    enabled: !!id,
  });
};

export const useMyIDPPlans = (filters?: Omit<IDPFilters, 'employeeId'>) => {
  return useQuery({
    queryKey: [...idpKeys.my(), filters],
    queryFn: () => IDPService.getMy(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Frontend compatible hooks (string IDs)
export const useIDPPlanFrontend = (id: string) => {
  return useQuery({
    queryKey: idpKeys.detail(id),
    queryFn: () => IDPService.getByIdFrontend(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateIDPPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIDPPlanRequest) => IDPService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: idpKeys.all });
    },
  });
};

export const useDeleteIDPPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => IDPService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: idpKeys.all });
    },
  });
};

export const useSubmitIDPPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => IDPService.submit(id),
    onSuccess: (data) => {
      queryClient.setQueryData(idpKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: idpKeys.lists() });
      queryClient.invalidateQueries({ queryKey: idpKeys.my() });
    },
  });
};

export const useSubmitIDPPlanFrontend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => IDPService.submitFrontend(id),
    onSuccess: (data) => {
      queryClient.setQueryData(idpKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: idpKeys.lists() });
      queryClient.invalidateQueries({ queryKey: idpKeys.my() });
    },
  });
};

export const useApproveIDPPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => IDPService.approve(id),
    onSuccess: (data) => {
      queryClient.setQueryData(idpKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: idpKeys.lists() });
    },
  });
};

export const useRejectIDPPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => 
      IDPService.reject(id, reason),
    onSuccess: (data) => {
      queryClient.setQueryData(idpKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: idpKeys.lists() });
    },
  });
};

// Goal mutations
export const useAddIDPGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, data }: { planId: number; data: CreateIDPGoalRequest }) =>
      IDPService.addGoal(planId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: idpKeys.detail(variables.planId) });
      queryClient.invalidateQueries({ queryKey: idpKeys.my() });
    },
  });
};

export const useAddIDPGoalFrontend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: CreateIDPGoalRequest }) =>
      IDPService.addGoalFrontend(planId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: idpKeys.detail(variables.planId) });
      queryClient.invalidateQueries({ queryKey: idpKeys.my() });
    },
  });
};

export const useUpdateIDPGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      planId, 
      goalId, 
      data 
    }: { 
      planId: number; 
      goalId: number; 
      data: UpdateIDPGoalRequest 
    }) => IDPService.updateGoal(planId, goalId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: idpKeys.detail(variables.planId) });
      queryClient.invalidateQueries({ queryKey: idpKeys.my() });
    },
  });
};

export const useDeleteIDPGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, goalId }: { planId: number; goalId: number }) =>
      IDPService.deleteGoal(planId, goalId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: idpKeys.detail(variables.planId) });
      queryClient.invalidateQueries({ queryKey: idpKeys.my() });
    },
  });
};
