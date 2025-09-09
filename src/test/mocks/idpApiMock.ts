import { vi } from 'vitest'

// Mock data for IDP tests
export const mockIDPPlan = {
  id: 1,
  employeeId: 1,
  year: 2025,
  status: 'draft' as const,
  goals: [
    {
      id: '1',
      title: 'Test Goal 1',
      description: 'Test description 1',
      details: 'Test details 1',
      category: 'business' as const,
      status: 'draft' as const,
      isDraft: true,
    },
    {
      id: '2',
      title: 'Test Goal 2',
      description: 'Test description 2',
      details: 'Test details 2',
      category: 'development' as const,
      status: 'draft' as const,
      isDraft: true,
    }
  ]
}

export const mockUser = {
  id: 1,
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan.kowalski@test.com',
  employeeId: 'EMP001',
}

// Mock API functions
export const mockIDPApi = {
  getCurrentUserPlans: vi.fn().mockResolvedValue([mockIDPPlan]),
  createPlan: vi.fn().mockResolvedValue({ id: 1 }),
  createGoal: vi.fn().mockImplementation((planId, goalData) => 
    Promise.resolve({
      id: String(Date.now()),
      ...goalData,
      status: goalData.isDraft ? 'draft' : 'submitted',
      planId
    })
  ),
  updateGoal: vi.fn().mockImplementation((planId, goalId, goalData) => 
    Promise.resolve({
      id: goalId,
      ...goalData,
      planId
    })
  ),
  deleteGoal: vi.fn().mockResolvedValue(undefined),
  submitGoal: vi.fn().mockResolvedValue(undefined),
}

// Reset all mocks between tests
export const resetMocks = () => {
  Object.values(mockIDPApi).forEach(mock => mock.mockClear())
}
