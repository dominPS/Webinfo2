import { apiClient } from './client';
import type { 
  IDPPlan, 
  IDPGoal, 
  CreateIDPPlanRequest, 
  CreateIDPGoalRequest, 
  UpdateIDPGoalRequest,
  IDPFilters,
  PaginatedResponse 
} from './types';

// Enhanced IDP Types for Backend Integration
export interface IDPGoalWithDetails extends IDPGoal {
  details: string;
  isDraft: boolean;
  submittedDate?: string;
  approvalDate?: string;
  approvedById?: number;
  approver?: {
    firstName: string;
    lastName: string;
  };
  approvalComments?: string;
}

export interface IDPPlanWithDetails extends IDPPlan {
  submittedDate?: string;
  supervisorComments?: string;
  goals: IDPGoalWithDetails[];
}

export interface CreateIDPGoalWithDetailsRequest extends CreateIDPGoalRequest {
  details: string;
  isDraft?: boolean;
}

export interface UpdateIDPGoalWithDetailsRequest extends UpdateIDPGoalRequest {
  details?: string;
  isDraft?: boolean;
}

export interface SubmitIDPGoalRequest {
  goalId: number;
}

export interface IDPApi {
  // IDP Plans
  getPlans: (filters?: IDPFilters) => Promise<PaginatedResponse<IDPPlanWithDetails>>;
  getPlan: (id: number) => Promise<IDPPlanWithDetails>;
  createPlan: (data: CreateIDPPlanRequest) => Promise<IDPPlanWithDetails>;
  updatePlan: (id: number, data: Partial<IDPPlanWithDetails>) => Promise<IDPPlanWithDetails>;
  deletePlan: (id: number) => Promise<void>;

  // IDP Goals
  getGoals: (planId: number) => Promise<IDPGoalWithDetails[]>;
  getDraftGoals: (planId: number) => Promise<IDPGoalWithDetails[]>;
  getGoal: (id: number) => Promise<IDPGoalWithDetails>;
  createGoal: (planId: number, data: CreateIDPGoalWithDetailsRequest) => Promise<IDPGoalWithDetails>;
  updateGoal: (id: number, data: UpdateIDPGoalWithDetailsRequest) => Promise<IDPGoalWithDetails>;
  deleteGoal: (id: number) => Promise<void>;
  submitGoal: (data: SubmitIDPGoalRequest) => Promise<IDPGoalWithDetails>;

  // User-specific endpoints
  getUserPlans: (userId: number, filters?: IDPFilters) => Promise<PaginatedResponse<IDPPlanWithDetails>>;
  getCurrentUserPlans: (filters?: IDPFilters) => Promise<PaginatedResponse<IDPPlanWithDetails>>;
}

class IDPApiImpl implements IDPApi {
  // IDP Plans
  async getPlans(filters?: IDPFilters): Promise<PaginatedResponse<IDPPlanWithDetails>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.employeeId) params.append('employeeId', filters.employeeId.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/idp?${queryString}` : '/idp';
    
    return apiClient.get<PaginatedResponse<IDPPlanWithDetails>>(endpoint);
  }

  async getPlan(id: number): Promise<IDPPlanWithDetails> {
    return apiClient.get<IDPPlanWithDetails>(`/idp/${id}`);
  }

  async createPlan(data: CreateIDPPlanRequest): Promise<IDPPlanWithDetails> {
    // Use new my-plans endpoint that doesn't require employeeId
    return apiClient.post<IDPPlanWithDetails>('/idp/my-plans', { year: data.year });
  }

  async updatePlan(id: number, data: Partial<IDPPlanWithDetails>): Promise<IDPPlanWithDetails> {
    return apiClient.put<IDPPlanWithDetails>(`/idp/${id}`, data);
  }

  async deletePlan(id: number): Promise<void> {
    return apiClient.delete<void>(`/idp/${id}`);
  }

  // IDP Goals
  async getGoals(planId: number): Promise<IDPGoalWithDetails[]> {
    return apiClient.get<IDPGoalWithDetails[]>(`/idp/${planId}/goals`);
  }

  async getDraftGoals(planId: number): Promise<IDPGoalWithDetails[]> {
    return apiClient.get<IDPGoalWithDetails[]>(`/idp/${planId}/goals/drafts`);
  }

  async getGoal(id: number): Promise<IDPGoalWithDetails> {
    return apiClient.get<IDPGoalWithDetails>(`/idp/goals/${id}`);
  }

  async createGoal(planId: number, data: CreateIDPGoalWithDetailsRequest): Promise<IDPGoalWithDetails> {
    return apiClient.post<IDPGoalWithDetails>(`/idp/${planId}/goals`, data);
  }

  async updateGoal(id: number, data: UpdateIDPGoalWithDetailsRequest): Promise<IDPGoalWithDetails> {
    return apiClient.put<IDPGoalWithDetails>(`/idp/goals/${id}`, data);
  }

  async deleteGoal(id: number): Promise<void> {
    return apiClient.delete<void>(`/idp/goals/${id}`);
  }

  async submitGoal(data: SubmitIDPGoalRequest): Promise<IDPGoalWithDetails> {
    const response = await apiClient.post<{ message: string }>('/idp/goals/submit', data);
    // Return a mock response since the backend returns only success message
    return {} as IDPGoalWithDetails;
  }

  // User-specific endpoints
  async getUserPlans(userId: number, filters?: IDPFilters): Promise<PaginatedResponse<IDPPlanWithDetails>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.year) params.append('year', filters.year.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/idp/users/${userId}?${queryString}` : `/idp/users/${userId}`;
    
    return apiClient.get<PaginatedResponse<IDPPlanWithDetails>>(endpoint);
  }

  async getCurrentUserPlans(filters?: IDPFilters): Promise<PaginatedResponse<IDPPlanWithDetails>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.year) params.append('year', filters.year.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/idp/my-plans?${queryString}` : '/idp/my-plans';
    
    return apiClient.get<PaginatedResponse<IDPPlanWithDetails>>(endpoint);
  }
}

// Create and export the API instance
export const idpApi: IDPApi = new IDPApiImpl();

// Export specific functions for easier importing
export const {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  getGoals,
  getDraftGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  submitGoal,
  getUserPlans,
  getCurrentUserPlans,
} = idpApi;

export default idpApi;
