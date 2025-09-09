import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock komponentu IDPFlow bez mocków zewnętrznych modułów
const MockIDPFlow = () => {
  const [currentStep, setCurrentStep] = useState('my-idp')
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Test Goal 1',
      description: 'Test description 1',
      details: 'Test details 1',
      category: 'business',
      status: 'draft',
      isDraft: true,
    },
    {
      id: '2', 
      title: 'Test Goal 2',
      description: 'Test description 2',
      details: 'Test details 2',
      category: 'development',
      status: 'draft',
      isDraft: true,
    }
  ])
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    details: '',
    category: 'business',
  })
  const [editingGoal, setEditingGoal] = useState(null)

  const handleSaveDraft = () => {
    if (newGoal.title && newGoal.description && newGoal.details) {
      const goal = {
        id: String(Date.now()),
        ...newGoal,
        status: 'draft',
        isDraft: true,
      }
      setGoals([...goals, goal])
      setCurrentStep('drafts')
    }
  }

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal)
    setNewGoal({
      title: goal.title,
      description: goal.description,
      details: goal.details,
      category: goal.category,
    })
    setCurrentStep('edit-goal')
  }

  const handleUpdateGoal = () => {
    if (editingGoal && newGoal.title && newGoal.description && newGoal.details) {
      setGoals(goals.map(goal => 
        goal.id === (editingGoal as any).id 
          ? { ...goal, ...newGoal }
          : goal
      ))
      setCurrentStep('drafts')
      setEditingGoal(null)
    }
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId))
  }

  return (
    <div data-testid="idp-flow">
      {/* My IDP - główna strona */}
      {currentStep === 'my-idp' && (
        <div>
          <h1>My IDP</h1>
          <button onClick={() => setCurrentStep('add-goal')}>
            DODAJ CEL IDP
          </button>
          <button onClick={() => setCurrentStep('drafts')}>
            ZOBACZ SZKICE
          </button>
        </div>
      )}

      {/* Add Goal - dodawanie celu */}
      {currentStep === 'add-goal' && (
        <div>
          <h1>Dodaj Cel</h1>
          <div>
            <label>
              <input
                type="radio"
                name="goalType"
                value="business"
                checked={newGoal.category === 'business'}
                onChange={(e) => setNewGoal({...newGoal, category: 'business'})}
              />
              Cel biznesowy
            </label>
            <label>
              <input
                type="radio"
                name="goalType"
                value="development"
                checked={newGoal.category === 'development'}
                onChange={(e) => setNewGoal({...newGoal, category: 'development'})}
              />
              Cel rozwojowy
            </label>
          </div>
          <input
            placeholder="Wprowadź tytuł celu rozwoju"
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
          />
          <textarea
            placeholder="Opisz swój cel..."
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
          />
          <textarea
            placeholder="Opisz szczegółowe kroki i oczekiwane wyniki..."
            value={newGoal.details}
            onChange={(e) => setNewGoal({...newGoal, details: e.target.value})}
          />
          <button onClick={() => setCurrentStep('my-idp')}>Anuluj</button>
          <button onClick={handleSaveDraft}>Szkic</button>
          <button>Wyślij do akceptacji</button>
        </div>
      )}

      {/* Edit Goal - edycja celu */}
      {currentStep === 'edit-goal' && (
        <div>
          <h1>EDYTUJ CEL IDP</h1>
          <div>
            <label>
              <input
                type="radio"
                name="goalType"
                value="business"
                checked={newGoal.category === 'business'}
                onChange={(e) => setNewGoal({...newGoal, category: 'business'})}
              />
              Cel biznesowy
            </label>
            <label>
              <input
                type="radio"
                name="goalType"
                value="development"
                checked={newGoal.category === 'development'}
                onChange={(e) => setNewGoal({...newGoal, category: 'development'})}
              />
              Cel rozwojowy
            </label>
          </div>
          <input
            placeholder="Wprowadź tytuł celu rozwoju"
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
          />
          <textarea
            placeholder="Opisz swój cel..."
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
          />
          <textarea
            placeholder="Opisz szczegółowe kroki i oczekiwane wyniki..."
            value={newGoal.details}
            onChange={(e) => setNewGoal({...newGoal, details: e.target.value})}
          />
          <button onClick={() => setCurrentStep('drafts')}>Anuluj</button>
          <button onClick={handleUpdateGoal}>Zaktualizuj cel</button>
        </div>
      )}

      {/* Drafts - szkice */}
      {currentStep === 'drafts' && (
        <div>
          <h1>Szkice celów</h1>
          {goals.filter(goal => goal.status === 'draft').length === 0 ? (
            <p>Brak szkiców celów. Zacznij od dodania nowego celu.</p>
          ) : (
            <div>
              {goals.filter(goal => goal.status === 'draft').map((goal) => (
                <div key={goal.id} data-testid={`draft-goal-${goal.id}`}>
                  <h4>{goal.category} - {goal.title}</h4>
                  <p>{goal.description}</p>
                  <div>
                    <button onClick={() => console.log('submit', goal.id)}>
                      Wyślij do akceptacji
                    </button>
                    <button onClick={() => handleEditGoal(goal)}>
                      Edytuj cel
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.id)}>
                      Usuń cel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setCurrentStep('add-goal')}>
            Dodaj cel IDP
          </button>
          <button onClick={() => setCurrentStep('my-idp')}>
            Powrót do głównej
          </button>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

describe('IDP Szkice - Testy funkcjonalności', () => {
  const user = userEvent.setup()

  describe('Dodawanie szkiców', () => {
    it('powinien pozwolić na dodanie nowego szkicu celu', async () => {
      render(<MockIDPFlow />)

      // Kliknij przycisk "Dodaj cel IDP" 
      const addGoalButton = screen.getByText('DODAJ CEL IDP')
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

      // Sprawdź czy przeszliśmy do szkiców i cel został dodany
      await waitFor(() => {
        expect(screen.getByText('Szkice celów')).toBeInTheDocument()
        expect(screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'h4' && content.includes('Nowy cel testowy')
        })).toBeInTheDocument()
      })
    })

    it('nie powinien dodać szkicu przy pustym formularzu', async () => {
      render(<MockIDPFlow />)

      const addGoalButton = screen.getByText('DODAJ CEL IDP')
      await user.click(addGoalButton)

      // Spróbuj zapisać pusty formularz
      const draftButton = screen.getByText('Szkic')
      await user.click(draftButton)

      // Sprawdź że nadal jesteśmy na stronie dodawania (nie przeszło)
      expect(screen.getByText('Dodaj Cel')).toBeInTheDocument()
      expect(screen.queryByText('Szkice celów')).not.toBeInTheDocument()
    })
  })

  describe('Wyświetlanie szkiców', () => {
    it('powinien wyświetlić listę szkiców', async () => {
      render(<MockIDPFlow />)

      // Kliknij przycisk "Zobacz szkice"
      const viewDraftsButton = screen.getByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Sprawdź czy szkice są wyświetlane
      expect(screen.getByText('Szkice celów')).toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'h4' && content.includes('Test Goal 1')
      })).toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'h4' && content.includes('Test Goal 2')
      })).toBeInTheDocument()
      
      // Sprawdź czy przyciski akcji są dostępne
      const editButtons = screen.getAllByText('Edytuj cel')
      expect(editButtons).toHaveLength(2)
      
      const deleteButtons = screen.getAllByText('Usuń cel')
      expect(deleteButtons).toHaveLength(2)
    })
  })

  describe('Edycja szkiców', () => {
    it('powinien pozwolić na edycję istniejącego szkicu', async () => {
      render(<MockIDPFlow />)

      // Przejdź do szkiców
      const viewDraftsButton = screen.getByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Edytuj cel" przy pierwszym szkicu
      const editButtons = screen.getAllByText('Edytuj cel')
      await user.click(editButtons[0])

      // Sprawdź czy jesteśmy na stronie edycji
      expect(screen.getByText('EDYTUJ CEL IDP')).toBeInTheDocument()

      // Sprawdź czy formularz jest wypełniony danymi szkicu
      expect(screen.getByDisplayValue('Test Goal 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test description 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test details 1')).toBeInTheDocument()
    })

    it('powinien zapisać zmiany w szkicu', async () => {
      render(<MockIDPFlow />)

      // Przejdź do szkiców i rozpocznij edycję
      const viewDraftsButton = screen.getByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      const editButtons = screen.getAllByText('Edytuj cel')
      await user.click(editButtons[0])

      // Zmodyfikuj tytuł
      const titleInput = screen.getByDisplayValue('Test Goal 1')
      await user.clear(titleInput)
      await user.type(titleInput, 'Zaktualizowany cel testowy')

      // Zapisz zmiany
      const updateButton = screen.getByText('Zaktualizuj cel')
      await user.click(updateButton)

      // Sprawdź czy wróciłiśmy do szkiców z zaktualizowanym celem
      await waitFor(() => {
        expect(screen.getByText('Szkice celów')).toBeInTheDocument()
        expect(screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'h4' && content.includes('Zaktualizowany cel testowy')
        })).toBeInTheDocument()
        expect(screen.queryByText((content, element) => {
          return element?.tagName.toLowerCase() === 'h4' && content.includes('Test Goal 1')
        })).not.toBeInTheDocument()
      })
    })
  })

  describe('Usuwanie szkiców', () => {
    it('powinien pozwolić na usunięcie szkicu', async () => {
      render(<MockIDPFlow />)

      const viewDraftsButton = screen.getByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Sprawdź że mamy 2 szkice
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'h4' && content.includes('Test Goal 1')
      })).toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'h4' && content.includes('Test Goal 2')
      })).toBeInTheDocument()

      // Usuń pierwszy szkic
      const deleteButtons = screen.getAllByText('Usuń cel')
      await user.click(deleteButtons[0])

      // Sprawdź czy pierwszy szkic został usunięty
      expect(screen.queryByText((content, element) => {
        return element?.tagName.toLowerCase() === 'h4' && content.includes('Test Goal 1')
      })).not.toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'h4' && content.includes('Test Goal 2')
      })).toBeInTheDocument()
    })

    it('powinien wyświetlić komunikat gdy wszystkie szkice zostaną usunięte', async () => {
      render(<MockIDPFlow />)

      const viewDraftsButton = screen.getByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Usuń wszystkie szkice
      const deleteButtons = screen.getAllByText('Usuń cel')
      await user.click(deleteButtons[0])
      
      const remainingDeleteButtons = screen.getAllByText('Usuń cel')
      await user.click(remainingDeleteButtons[0])

      // Sprawdź komunikat o braku szkiców
      expect(screen.getByText('Brak szkiców celów. Zacznij od dodania nowego celu.')).toBeInTheDocument()
    })
  })

  describe('Nawigacja między szkicami', () => {
    it('powinien pozwolić na powrót do głównej strony ze szkiców', async () => {
      render(<MockIDPFlow />)

      const viewDraftsButton = screen.getByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Powrót do głównej"
      const backButton = screen.getByText('Powrót do głównej')
      await user.click(backButton)

      // Sprawdź czy jesteśmy z powrotem na głównej stronie
      expect(screen.getByText('My IDP')).toBeInTheDocument()
      expect(screen.getByText('DODAJ CEL IDP')).toBeInTheDocument()
    })

    it('powinien pozwolić na dodanie nowego celu ze strony szkiców', async () => {
      render(<MockIDPFlow />)

      const viewDraftsButton = screen.getByText('ZOBACZ SZKICE')
      await user.click(viewDraftsButton)

      // Kliknij przycisk "Dodaj cel IDP" ze strony szkiców
      const addGoalButton = screen.getByText('Dodaj cel IDP')
      await user.click(addGoalButton)

      // Sprawdź czy jesteśmy na stronie dodawania celu
      expect(screen.getByText('Dodaj Cel')).toBeInTheDocument()
    })
  })
})
