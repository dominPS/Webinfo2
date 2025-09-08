// User Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  manager?: string;
  isActive: boolean;
  roles: string[];
  roleId?: number;
  departmentId?: number;
  positionId?: number;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Position {
  id: number;
  name: string;
  description?: string;
  departmentId: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  departmentId?: number;
  positionId?: number;
}

// Self Evaluation Types
export interface SelfEvaluationFormData {
  employeeId: number;
  evaluationPeriod: string;
  overallPerformance: number;
  goals: string;
  achievements: string;
  challenges: string;
  learningDevelopment: string;
  feedback: string;
  careerAspirations: string;
  supportNeeded: string;
  additionalComments: string;
  strengths: string;
  areasForImprovement: string;
  jobSatisfaction: number;
  workLifeBalance: number;
  supervisorSupport: number;
  resourcesAvailability: number;
  trainingNeeds: string;
  skillDevelopment: string;
  mentorshipInterest: boolean;
  leadershipAspiration: boolean;
}

export interface SelfEvaluation {
  id: number;
  employeeId: number;
  employee?: User;
  evaluationPeriod: string;
  status: string;
  createdAt: string;
  lastModified: string;
  formData: SelfEvaluationFormData;
}

// IDP Types
export interface IDPGoal {
  id: number;
  idpPlanId: number;
  title: string;
  description: string;
  category: 'business' | 'development';
  status: string;
  targetDate?: string;
  progress?: number;
  createdAt: string;
  lastModified?: string;
}

export interface IDPPlan {
  id: number;
  employeeId: number;
  employee?: User;
  year: number;
  status: string;
  createdAt: string;
  lastModified?: string;
  goals: IDPGoal[];
}

export interface CreateIDPPlanRequest {
  employeeId: number;
  year: number;
}

export interface CreateIDPGoalRequest {
  title: string;
  description: string;
  category: 'business' | 'development';
  targetDate?: string;
}

export interface UpdateIDPGoalRequest {
  title?: string;
  description?: string;
  targetDate?: string;
  progress?: number;
  status?: string;
}

// Frontend Compatible IDP Types (matching backend DTOs)
export interface IDPFrontendDto {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  employeePosition: string;
  year: number;
  status: string;
  createdAt: string;
  lastModified?: string;
  goals: IDPGoalFrontendDto[];
}

export interface IDPGoalFrontendDto {
  id: string;
  title: string;
  description: string;
  category: 'business' | 'development';
  status: string;
  targetDate?: string;
  progress?: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  details?: string;
  errors?: Record<string, string[]>;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SelfEvaluationFilters extends PaginationParams {
  status?: string;
  evaluationPeriod?: string;
  employeeId?: number;
}

export interface IDPFilters extends PaginationParams {
  status?: string;
  year?: number;
  employeeId?: number;
}
