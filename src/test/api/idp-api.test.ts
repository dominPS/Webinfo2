import { describe, it, expect, beforeEach, vi } from 'vitest'
import { idpApi } from '../../lib/api/idp'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage for token
const mockToken = 'mock-jwt-token'
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn().mockReturnValue(mockToken),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

describe('IDP API - Testy szkiców', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    vi.clearAllMocks()
  })

  describe('getCurrentUserPlans', () => {
    it('powinien pobrać plany użytkownika z szkicami', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            employeeId: 1,
            year: 2025,
            status: 'draft',
            goals: [
              {
                id: 1,
                title: 'Test Goal',
                description: 'Test Description',
                details: 'Test Details',
                category: 'business',
                isDraft: true
              }
            ]
          }
        ],
        totalCount: 1,
        pageNumber: 1,
        totalPages: 1
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await idpApi.getCurrentUserPlans()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5140/api/idp/my-plans?pageNumber=1&pageSize=10',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      expect(result).toEqual(mockResponse.items)
    })

    it('powinien obsłużyć błąd sieciowy', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(idpApi.getCurrentUserPlans()).rejects.toThrow('Network error')
    })
  })

  describe('createGoal', () => {
    it('powinien utworzyć szkic celu', async () => {
      const mockGoalData = {
        title: 'New Draft Goal',
        description: 'Draft description',
        details: 'Draft details',
        category: 'business' as const,
        isDraft: true
      }

      const mockResponse = {
        id: 1,
        ...mockGoalData,
        status: 'draft'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await idpApi.createGoal(1, mockGoalData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5140/api/idp/1/goals',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockGoalData),
        }
      )

      expect(result).toEqual(mockResponse)
    })

    it('powinien obsłużyć błąd 400 przy nieprawidłowych danych', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      })

      const invalidGoalData = {
        title: '',
        description: '',
        details: '',
        category: 'business' as const,
        isDraft: true
      }

      await expect(idpApi.createGoal(1, invalidGoalData)).rejects.toThrow('HTTP error! status: 400')
    })
  })

  describe('updateGoal', () => {
    it('powinien zaktualizować szkic celu', async () => {
      const mockUpdateData = {
        title: 'Updated Goal',
        description: 'Updated description',
        details: 'Updated details',
        category: 'development' as const
      }

      const mockResponse = {
        id: 1,
        ...mockUpdateData,
        status: 'draft'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await idpApi.updateGoal(1, mockUpdateData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5140/api/idp/goals/1',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockUpdateData),
        }
      )

      expect(result).toEqual(mockResponse)
    })
  })

  describe('submitGoal', () => {
    it('powinien wysłać szkic do akceptacji', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await idpApi.submitGoal({ goalId: 1 })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5140/api/idp/goals/submit',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ goalId: 1 }),
        }
      )
    })

    it('powinien obsłużyć błąd 404 dla nieistniejącego celu', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      })

      await expect(idpApi.submitGoal({ goalId: 999 })).rejects.toThrow('HTTP error! status: 404')
    })
  })

  describe('createPlan', () => {
    it('powinien utworzyć nowy plan IDP', async () => {
      const mockPlanData = {
        year: 2025,
        overallComments: 'Test comments'
      }

      const mockResponse = {
        id: 1,
        ...mockPlanData,
        employeeId: 1,
        status: 'draft'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await idpApi.createPlan(mockPlanData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5140/api/idp/my-plans',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockPlanData),
        }
      )

      expect(result).toEqual(mockResponse)
    })
  })
})
