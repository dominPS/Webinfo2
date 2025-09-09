import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IDPFlow from '../../features/employeeEvaluation/components/IDPFlow'
import { mockIDPApi, mockIDPPlan, resetMocks } from '../mocks/idpApiMock'

// Mock the API module
vi.mock('../../lib/api/idp', () => ({
  idpApi: mockIDPApi
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback || key,
    i18n: {
      changeLanguage: () => new Promise(() => {})
    }
  }),
}))

// Mock images
vi.mock('../../shared/assets/idp-women-person.svg', () => ({
  default: 'mock-image.svg'
}))

describe('IDP Szkice - Testy operacji na szkicach', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    resetMocks()
    // Reset localStorage before each test
    localStorage.clear()
  })

  describe('Dodawanie szkiców', () => {
    it('powinien pozwolić na dodanie nowego szkicu celu', async () => {
      render(<IDPFlow />)

      // Kliknij przycisk "Dodaj cel IDP" 
      const addGoalButton = await screen.findByText('DODAJ CEL IDP')
      await user.click(addGoalButton)

      // Sprawdź czy jesteśmy na stronie dodawania celu
      expect(screen.getByText('Dodaj Cel')).toBeInTheDocument()

      // Wypełnij formularz
      const businessRadio = screen.getByLabelText('Cel biznesowy')
      await user.click(businessRadio)

      const titleInput = screen.getByPlaceholderText('Wprowadź tytuł celu rozwoju')
      await user.type(titleInput, 'Nowy cel testowy')

      const descriptionInput = screen.getByPlaceholderText('Opisz swój cel...')
      await user.type(descriptionInput, 'Opis nowego celu testowego')

      const detailsInput = screen.getByPlaceholderText('Opisz szczegółowe kroki i oczekiwane wyniki...')
      await user.type(detailsInput, 'Szczegółowy opis kroki realizacji')

      // Kliknij przycisk "Szkic"
      const draftButton = screen.getByText('Szkic')
      await user.click(draftButton)

      // Sprawdź czy API zostało wywołane
      await waitFor(() => {
        expect(mockIDPApi.createGoal).toHaveBeenCalledWith(
          expect.any(Number),
          expect.objectContaining({
            title: 'Nowy cel testowy',
            description: 'Opis nowego celu testowego',
            details: 'Szczegółowy opis kroki realizacji',
            category: 'business',
            isDraft: true
          })
        )
      })
    })

    it('powinien wyświetlić błąd przy pustym formularzu', async () => {
      render(<IDPFlow />)

      const addGoalButton = await screen.findByText('DODAJ CEL IDP')
      await user.click(addGoalButton)

      // Spróbuj zapisać pusty formularz
      const draftButton = screen.getByText('Szkic')
      await user.click(draftButton)

      // Sprawdź czy nie wywołano API (formularz nieprawidłowy)
      expect(mockIDPApi.createGoal).not.toHaveBeenCalled()
    })
  })

  describe('Wyświetlanie szkiców', () => {
    it('powinien wyświetlić listę szkiców', async () => {
      // Mock API zwraca szkice
      mockIDPApi.getCurrentUserPlans.mockResolvedValue([mockIDPPlan])

      render(<IDPFlow />)

      // Kliknij przycisk "Zobacz szkice"
      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Sprawdź czy szkice są wyświetlane
      await waitFor(() => {
        expect(screen.getByText('Szkice celów')).toBeInTheDocument()
        expect(screen.getByText('Test Goal 1')).toBeInTheDocument()
        expect(screen.getByText('Test Goal 2')).toBeInTheDocument()
      })
    })

    it('powinien wyświetlić komunikat gdy brak szkiców', async () => {
      // Mock API zwraca pusty plan
      mockIDPApi.getCurrentUserPlans.mockResolvedValue([{
        ...mockIDPPlan,
        goals: []
      }])

      render(<IDPFlow />)

      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      await waitFor(() => {
        expect(screen.getByText('Brak szkiców celów. Zacznij od dodania nowego celu.')).toBeInTheDocument()
      })
    })
  })

  describe('Edycja szkiców', () => {
    it('powinien pozwolić na edycję istniejącego szkicu', async () => {
      mockIDPApi.getCurrentUserPlans.mockResolvedValue([mockIDPPlan])

      render(<IDPFlow />)

      // Przejdź do szkiców
      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Edytuj cel" przy pierwszym szkicu
      await waitFor(async () => {
        const editButtons = screen.getAllByText('Edytuj cel')
        expect(editButtons).toHaveLength(2) // Dwa szkice
        await user.click(editButtons[0])
      })

      // Sprawdź czy jesteśmy na stronie edycji
      await waitFor(() => {
        expect(screen.getByText('EDYTUJ CEL IDP')).toBeInTheDocument()
      })

      // Sprawdź czy formularz jest wypełniony danymi szkicu
      expect(screen.getByDisplayValue('Test Goal 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test description 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test details 1')).toBeInTheDocument()
    })

    it('powinien zapisać zmiany w szkicu', async () => {
      mockIDPApi.getCurrentUserPlans.mockResolvedValue([mockIDPPlan])

      render(<IDPFlow />)

      // Przejdź do szkiców i rozpocznij edycję
      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      await waitFor(async () => {
        const editButtons = screen.getAllByText('Edytuj cel')
        await user.click(editButtons[0])
      })

      // Zmodyfikuj tytuł
      const titleInput = screen.getByDisplayValue('Test Goal 1')
      await user.clear(titleInput)
      await user.type(titleInput, 'Zaktualizowany cel testowy')

      // Zapisz zmiany
      const updateButton = screen.getByText('Zaktualizuj cel')
      await user.click(updateButton)

      // Sprawdź czy API zostało wywołane z nowymi danymi
      await waitFor(() => {
        expect(mockIDPApi.updateGoal).toHaveBeenCalledWith(
          expect.any(Number),
          '1',
          expect.objectContaining({
            title: 'Zaktualizowany cel testowy',
            description: 'Test description 1',
            details: 'Test details 1',
            category: 'business'
          })
        )
      })
    })
  })

  describe('Usuwanie szkiców', () => {
    it('powinien pozwolić na usunięcie szkicu', async () => {
      mockIDPApi.getCurrentUserPlans.mockResolvedValue([mockIDPPlan])

      render(<IDPFlow />)

      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Usuń cel"
      await waitFor(async () => {
        const deleteButtons = screen.getAllByText('Usuń cel')
        await user.click(deleteButtons[0])
      })

      // Sprawdź czy szkic został usunięty z lokalnego stanu
      // (nie powinniśmy już widzieć pierwszego szkicu)
      await waitFor(() => {
        expect(screen.queryByText('Test Goal 1')).not.toBeInTheDocument()
        expect(screen.getByText('Test Goal 2')).toBeInTheDocument()
      })
    })
  })

  describe('Przesyłanie szkiców do akceptacji', () => {
    it('powinien pozwolić na wysłanie szkicu do akceptacji', async () => {
      mockIDPApi.getCurrentUserPlans.mockResolvedValue([mockIDPPlan])

      render(<IDPFlow />)

      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Wyślij do akceptacji"
      await waitFor(async () => {
        const submitButtons = screen.getAllByText('Wyślij do akceptacji')
        await user.click(submitButtons[0])
      })

      // Sprawdź czy API zostało wywołane
      await waitFor(() => {
        expect(mockIDPApi.submitGoal).toHaveBeenCalledWith({
          goalId: parseInt('1')
        })
      })
    })
  })

  describe('Nawigacja między szkicami', () => {
    it('powinien pozwolić na powrót do głównej strony ze szkiców', async () => {
      render(<IDPFlow />)

      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Powrót do głównej"
      const backButton = screen.getByText('Powrót do głównej')
      await user.click(backButton)

      // Sprawdź czy jesteśmy z powrotem na głównej stronie
      expect(screen.getByText('My IDP')).toBeInTheDocument()
      expect(screen.getByText('DODAJ CEL IDP')).toBeInTheDocument()
    })

    it('powinien pozwolić na dodanie nowego celu ze strony szkiców', async () => {
      mockIDPApi.getCurrentUserPlans.mockResolvedValue([mockIDPPlan])

      render(<IDPFlow />)

      const viewDraftsButton = await screen.findByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Dodaj cel IDP" ze strony szkiców
      const addGoalButton = screen.getByText('Dodaj cel IDP')
      await user.click(addGoalButton)

      // Sprawdź czy jesteśmy na stronie dodawania celu
      expect(screen.getByText('Dodaj Cel')).toBeInTheDocument()
    })
  })
})
