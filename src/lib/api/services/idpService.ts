import { apiClient } from '../client';
import type {
  IDPPlan,
  IDPGoal,
  CreateIDPPlanRequest,
  CreateIDPGoalRequest,
  UpdateIDPGoalRequest,
  IDPFilters,
  PaginatedResponse,
  IDPFrontendDto,
} from '../types';

export class IDPService {
  private static readonly ENDPOINTS = {
    BASE: '/idp',
    BY_ID: (id: number) => `/idp/${id}`,
    GOALS: (planId: number) => `/idp/${planId}/goals`,
    GOAL_BY_ID: (planId: number, goalId: number) => `/idp/${planId}/goals/${goalId}`,
    SUBMIT: (id: number) => `/idp/${id}/submit`,
    APPROVE: (id: number) => `/idp/${id}/approve`,
    REJECT: (id: number) => `/idp/${id}/reject`,
  };

  // IDP Plans
  static async getAll(filters?: IDPFilters): Promise<PaginatedResponse<IDPPlan>> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.employeeId) params.append('employeeId', filters.employeeId.toString());

    const endpoint = params.toString() ? `${this.ENDPOINTS.BASE}?${params}` : this.ENDPOINTS.BASE;
    return apiClient.get<PaginatedResponse<IDPPlan>>(endpoint);
  }

  static async getById(id: number): Promise<IDPPlan> {
    return apiClient.get<IDPPlan>(this.ENDPOINTS.BY_ID(id));
  }

  static async create(data: CreateIDPPlanRequest): Promise<IDPPlan> {
    return apiClient.post<IDPPlan>(this.ENDPOINTS.BASE, data);
  }

  static async delete(id: number): Promise<void> {
    return apiClient.delete<void>(this.ENDPOINTS.BY_ID(id));
  }

  static async submit(id: number): Promise<IDPPlan> {
    return apiClient.post<IDPPlan>(this.ENDPOINTS.SUBMIT(id));
  }

  static async approve(id: number): Promise<IDPPlan> {
    return apiClient.post<IDPPlan>(this.ENDPOINTS.APPROVE(id));
  }

  static async reject(id: number, reason?: string): Promise<IDPPlan> {
    return apiClient.post<IDPPlan>(this.ENDPOINTS.REJECT(id), { reason });
  }

  // IDP Goals
  static async addGoal(planId: number, data: CreateIDPGoalRequest): Promise<IDPGoal> {
    return apiClient.post<IDPGoal>(this.ENDPOINTS.GOALS(planId), data);
  }

  static async updateGoal(planId: number, goalId: number, data: UpdateIDPGoalRequest): Promise<IDPGoal> {
    return apiClient.put<IDPGoal>(this.ENDPOINTS.GOAL_BY_ID(planId, goalId), data);
  }

  static async deleteGoal(planId: number, goalId: number): Promise<void> {
    return apiClient.delete<void>(this.ENDPOINTS.GOAL_BY_ID(planId, goalId));
  }

  // Get current user's IDP plans
  static async getMy(filters?: Omit<IDPFilters, 'employeeId'>): Promise<IDPFrontendDto[]> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.year) params.append('year', filters.year.toString());

    const endpoint = params.toString() ? `${this.ENDPOINTS.BASE}?${params}` : this.ENDPOINTS.BASE;
    return apiClient.get<IDPFrontendDto[]>(endpoint);
  }

  // Frontend compatible methods (using string IDs)
  static async getByIdFrontend(id: string): Promise<IDPFrontendDto> {
    return apiClient.get<IDPFrontendDto>(`/idp/${id}`);
  }

  static async addGoalFrontend(planId: string, data: CreateIDPGoalRequest): Promise<IDPGoal> {
    return apiClient.post<IDPGoal>(`/idp/${planId}/goals`, data);
  }

  static async submitFrontend(id: string): Promise<IDPFrontendDto> {
    return apiClient.post<IDPFrontendDto>(`/idp/${id}/submit`);
  }
}

export default IDPService;
