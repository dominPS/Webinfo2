import { apiClient } from '../client';
import type {
  SelfEvaluation,
  SelfEvaluationFormData,
  SelfEvaluationFilters,
  PaginatedResponse,
} from '../types';

export class SelfEvaluationService {
  private static readonly ENDPOINTS = {
    BASE: '/self-evaluations',
    BY_ID: (id: number) => `/self-evaluations/${id}`,
    SUBMIT: (id: number) => `/self-evaluations/${id}/submit`,
  };

  static async getAll(filters?: SelfEvaluationFilters): Promise<PaginatedResponse<SelfEvaluation>> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.evaluationPeriod) params.append('evaluationPeriod', filters.evaluationPeriod);
    if (filters?.employeeId) params.append('employeeId', filters.employeeId.toString());

    const endpoint = params.toString() ? `${this.ENDPOINTS.BASE}?${params}` : this.ENDPOINTS.BASE;
    return apiClient.get<PaginatedResponse<SelfEvaluation>>(endpoint);
  }

  static async getById(id: number): Promise<SelfEvaluation> {
    return apiClient.get<SelfEvaluation>(this.ENDPOINTS.BY_ID(id));
  }

  static async create(data: SelfEvaluationFormData): Promise<SelfEvaluation> {
    return apiClient.post<SelfEvaluation>(this.ENDPOINTS.BASE, data);
  }

  static async update(id: number, data: Partial<SelfEvaluationFormData>): Promise<SelfEvaluation> {
    return apiClient.put<SelfEvaluation>(this.ENDPOINTS.BY_ID(id), data);
  }

  static async delete(id: number): Promise<void> {
    return apiClient.delete<void>(this.ENDPOINTS.BY_ID(id));
  }

  static async submit(id: number): Promise<SelfEvaluation> {
    return apiClient.post<SelfEvaluation>(this.ENDPOINTS.SUBMIT(id));
  }

  // Get current user's evaluations
  static async getMy(filters?: Omit<SelfEvaluationFilters, 'employeeId'>): Promise<PaginatedResponse<SelfEvaluation>> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.evaluationPeriod) params.append('evaluationPeriod', filters.evaluationPeriod);

    const endpoint = params.toString() ? `${this.ENDPOINTS.BASE}/my?${params}` : `${this.ENDPOINTS.BASE}/my`;
    return apiClient.get<PaginatedResponse<SelfEvaluation>>(endpoint);
  }
}

export default SelfEvaluationService;
