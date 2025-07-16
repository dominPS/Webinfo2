import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './HREvaluationPage.css';

/**
 * HR Evaluation Page
 * 
 * Started with basic round management - need to expand to:
 * - Employee selection for rounds
 * - Form templates management  
 * - Progress tracking
 * - Reports generation
 * 
 * Current MVP: Create and manage evaluation rounds
 */
const HREvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<string | null>(null);

  const handleControlClick = (controlType: string) => {
    console.log(`HR Control clicked: ${controlType}`);
    
    // Set active flow for all controls
    setActiveFlow(controlType);
    setActiveModule(null);
  };

  const handleBackToDashboard = () => {
    setActiveFlow(null);
    setActiveModule(null);
  };

  const handleModuleClick = (moduleType: string) => {
    console.log(`Module clicked: ${moduleType}`);
    setActiveModule(moduleType);
    // TODO: Implement actual functionality for ${moduleType}
    // For now, just showing which module was selected
    setActiveFlow('moduleDetails');
  };

  const handleWorkflowStepClick = (stepType: string) => {
    console.log(`Workflow step clicked: ${stepType}`);
    // Start with basic navigation - real implementation would handle actual workflow
    if (stepType === 'createRound') {
      setActiveFlow('createRoundForm');
    } else {
      // TODO: Implement other workflow steps
      alert(`${stepType} - funkcjonalność w przygotowaniu`);
    }
  };

  const renderActiveFlow = () => {
    switch (activeFlow) {
      case 'createRoundForm':
        return (
          <div className="hr-evaluation-page">
            <div className="hr-evaluation-page__content-wrapper">
              <button className="hr-evaluation-page__back-button" onClick={handleBackToDashboard}>
                ← Powrót
              </button>
              <div className="hr-evaluation-page__round-management">
                <div className="hr-evaluation-page__round-management-header">
                  <h2 className="hr-evaluation-page__round-management-title">Tworzenie nowej rundy oceny</h2>
                </div>
                <div className="hr-evaluation-page__workflow-grid">
                  <div className="hr-evaluation-page__workflow-section">
                    <h3 className="hr-evaluation-page__workflow-title">
                      <span>🏢</span> Konfiguracja rundy
                    </h3>
                    <div className="hr-evaluation-page__workflow-steps">
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Nazwa i okres oceny</div>
                          <div className="hr-evaluation-page__step-description">Ustal nazwę i zakres czasowy</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--pending">Czeka</div>
                      </div>
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Wybór szablonu oceny</div>
                          <div className="hr-evaluation-page__step-description">Określ kryteria i formularze</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--pending">Czeka</div>
                      </div>
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Harmonogram i terminy</div>
                          <div className="hr-evaluation-page__step-description">Ustal daty rozpoczęcia i zakończenia</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--pending">Czeka</div>
                      </div>
                    </div>
                  </div>

                  <div className="hr-evaluation-page__workflow-section">
                    <h3 className="hr-evaluation-page__workflow-title">
                      <span>👥</span> Zarządzanie uczestnikami
                    </h3>
                    <div className="hr-evaluation-page__workflow-steps">
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Wybór pracowników</div>
                          <div className="hr-evaluation-page__step-description">Określ kto będzie oceniany</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--pending">Czeka</div>
                      </div>
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Przypisanie oceniających</div>
                          <div className="hr-evaluation-page__step-description">Wskaż przełożonych i zespoły</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--pending">Czeka</div>
                      </div>
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Powiadomienia</div>
                          <div className="hr-evaluation-page__step-description">Skonfiguruj automatyczne przypomnienia</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--pending">Czeka</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hr-evaluation-page__action-buttons-grid">
                  <button className="hr-evaluation-page__action-button">
                    Zapisz jako szkic
                  </button>
                  <button className="hr-evaluation-page__action-button">
                    Uruchom rundę oceny
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'roundManagement':
        return (
          <div className="hr-evaluation-page">
            <div className="hr-evaluation-page__content-wrapper">
              <button className="hr-evaluation-page__back-button" onClick={handleBackToDashboard}>
                ← Powrót do głównego panelu
              </button>
              <div className="hr-evaluation-page__round-management">
                <div className="hr-evaluation-page__round-management-header">
                  <h2 className="hr-evaluation-page__round-management-title">Zarządzanie rundami oceny</h2>
                  <button className="hr-evaluation-page__control-button" onClick={() => handleWorkflowStepClick('createRound')}>
                    + Nowa runda
                  </button>
                </div>
                <div className="hr-evaluation-page__workflow-grid">
                  <div className="hr-evaluation-page__workflow-section">
                    <h3 className="hr-evaluation-page__workflow-title">
                      <span>⚡</span> Aktywne rundy
                    </h3>
                    <div className="hr-evaluation-page__workflow-steps">
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Ocena roczna 2024</div>
                          <div className="hr-evaluation-page__step-description">42 pracowników • Kończy się: 15.12.2024</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--completed">Aktywna</div>
                      </div>
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Ocena kwartalnia Q4</div>
                          <div className="hr-evaluation-page__step-description">18 pracowników • Kończy się: 31.12.2024</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--completed">Aktywna</div>
                      </div>
                    </div>
                  </div>

                  <div className="hr-evaluation-page__workflow-section">
                    <h3 className="hr-evaluation-page__workflow-title">
                      <span>📋</span> Historia rund
                    </h3>
                    <div className="hr-evaluation-page__workflow-steps">
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Ocena połroczna 2024</div>
                          <div className="hr-evaluation-page__step-description">38 pracowników • Zakończona: 30.06.2024</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--completed">Zakończona</div>
                      </div>
                      <div className="hr-evaluation-page__workflow-step">
                        <div>
                          <div className="hr-evaluation-page__step-title">Ocena kwartalnia Q1</div>
                          <div className="hr-evaluation-page__step-description">22 pracowników • Zakończona: 31.03.2024</div>
                        </div>
                        <div className="hr-evaluation-page__step-badge hr-evaluation-page__step-badge--completed">Zakończona</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'templates':
        return (
          <div className="hr-evaluation-page">
            <div className="hr-evaluation-page__content-wrapper">
              <button className="hr-evaluation-page__back-button" onClick={handleBackToDashboard}>
                ← Powrót
              </button>
              <div className="hr-evaluation-page__round-management">
                <div className="hr-evaluation-page__round-management-header">
                  <h2 className="hr-evaluation-page__round-management-title">Szablony formularzy oceny</h2>
                  <button className="hr-evaluation-page__control-button">
                    + Nowy szablon
                  </button>
                </div>
                <div className="hr-evaluation-page__module-grid">
                  <button className="hr-evaluation-page__module-button">
                    <strong>Szablon oceny rocznej</strong><br />
                    Kompleksowa ocena wszystkich obszarów pracy
                  </button>
                  <button className="hr-evaluation-page__module-button">
                    <strong>Szablon oceny kwartalnej</strong><br />
                    Krótka ocena postępów i celów
                  </button>
                  <button className="hr-evaluation-page__module-button">
                    <strong>Szablon oceny 360°</strong><br />
                    Ocena wieloźródłowa z różnych perspektyw
                  </button>
                  <button className="hr-evaluation-page__module-button">
                    <strong>Szablon samooceny</strong><br />
                    Formularz do samooceny pracowników
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="hr-evaluation-page">
            <div className="hr-evaluation-page__content-wrapper">
              <button className="hr-evaluation-page__back-button" onClick={handleBackToDashboard}>
                ← Powrót
              </button>
              <div className="hr-evaluation-page__round-management">
                <div className="hr-evaluation-page__round-management-header">
                  <h2 className="hr-evaluation-page__round-management-title">Raporty i analiza</h2>
                </div>
                <div className="hr-evaluation-page__stats-grid">
                  <div className="hr-evaluation-page__stat-card">
                    <div className="hr-evaluation-page__stat-number">156</div>
                    <div className="hr-evaluation-page__stat-label">Ukończone oceny</div>
                  </div>
                  <div className="hr-evaluation-page__stat-card">
                    <div className="hr-evaluation-page__stat-number">23</div>
                    <div className="hr-evaluation-page__stat-label">Oczekujące</div>
                  </div>
                  <div className="hr-evaluation-page__stat-card">
                    <div className="hr-evaluation-page__stat-number">4.2</div>
                    <div className="hr-evaluation-page__stat-label">Śr. ocena</div>
                  </div>
                  <div className="hr-evaluation-page__stat-card">
                    <div className="hr-evaluation-page__stat-number">87%</div>
                    <div className="hr-evaluation-page__stat-label">Ukończono</div>
                  </div>
                </div>
                <div className="hr-evaluation-page__module-grid">
                  <button className="hr-evaluation-page__module-button">
                    <strong>Raport postępów</strong><br />
                    Status wszystkich bieżących rund oceny
                  </button>
                  <button className="hr-evaluation-page__module-button">
                    <strong>Analiza wyników</strong><br />
                    Szczegółowe analizy i trendy
                  </button>
                  <button className="hr-evaluation-page__module-button">
                    <strong>Porównanie zespołów</strong><br />
                    Analiza porównawcza między działami
                  </button>
                  <button className="hr-evaluation-page__module-button">
                    <strong>Export danych</strong><br />
                    Eksport do Excel i PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="hr-evaluation-page">
            <div className="hr-evaluation-page__header">
              <h1 className="hr-evaluation-page__title">Panel zarządzania ocenami HR</h1>
              <p className="hr-evaluation-page__description">
                Kompleksowe narzędzie do zarządzania procesami oceny pracowników
              </p>
            </div>

            <div className="hr-evaluation-page__controls-grid">
              <button className="hr-evaluation-page__control-button" onClick={() => handleControlClick('roundManagement')}>
                Zarządzanie rundami
              </button>
              <button className="hr-evaluation-page__control-button" onClick={() => handleControlClick('templates')}>
                Szablony formularzy
              </button>
              <button className="hr-evaluation-page__control-button" onClick={() => handleControlClick('reports')}>
                Raporty i analiza
              </button>
              <button className="hr-evaluation-page__control-button" onClick={() => handleControlClick('settings')}>
                Ustawienia systemu
              </button>
            </div>

            <div className="hr-evaluation-page__main-layout">
              <div className="hr-evaluation-page__content-section">
                <div className="hr-evaluation-page__dashboard-card">
                  <h2 className="hr-evaluation-page__dashboard-title">Aktualny status ocen</h2>
                  <p className="hr-evaluation-page__dashboard-description">
                    Przegląd aktualnego stanu wszystkich procesów oceny w organizacji
                  </p>
                  <div className="hr-evaluation-page__stats-grid">
                    <div className="hr-evaluation-page__stat-card">
                      <div className="hr-evaluation-page__stat-number">42</div>
                      <div className="hr-evaluation-page__stat-label">Aktywne oceny</div>
                    </div>
                    <div className="hr-evaluation-page__stat-card">
                      <div className="hr-evaluation-page__stat-number">156</div>
                      <div className="hr-evaluation-page__stat-label">Ukończone</div>
                    </div>
                    <div className="hr-evaluation-page__stat-card">
                      <div className="hr-evaluation-page__stat-number">23</div>
                      <div className="hr-evaluation-page__stat-label">Oczekujące</div>
                    </div>
                    <div className="hr-evaluation-page__stat-card">
                      <div className="hr-evaluation-page__stat-number">8</div>
                      <div className="hr-evaluation-page__stat-label">Opóźnione</div>
                    </div>
                  </div>
                </div>

                <div className="hr-evaluation-page__dashboard-card">
                  <h2 className="hr-evaluation-page__dashboard-title">Najczęstsze akcje</h2>
                  <p className="hr-evaluation-page__dashboard-description">
                    Szybki dostęp do najważniejszych funkcji systemu
                  </p>
                  <div className="hr-evaluation-page__action-buttons-grid">
                    <button className="hr-evaluation-page__action-button" onClick={() => handleWorkflowStepClick('createRound')}>
                      🔄 Nowa runda oceny
                    </button>
                    <button className="hr-evaluation-page__action-button">
                      👥 Zarządzaj uczestnikami
                    </button>
                    <button className="hr-evaluation-page__action-button">
                      📋 Edytuj szablony
                    </button>
                    <button className="hr-evaluation-page__action-button">
                      📊 Generuj raporty
                    </button>
                    <button className="hr-evaluation-page__action-button">
                      ⚙️ Ustawienia systemu
                    </button>
                    <button className="hr-evaluation-page__action-button">
                      💬 Zarządzaj powiadomieniami
                    </button>
                  </div>
                </div>
              </div>

              <div className="hr-evaluation-page__module-section">
                <h2 className="hr-evaluation-page__section-title">
                  <div className="hr-evaluation-page__section-icon">⚠</div>
                  Alerty i powiadomienia
                </h2>
                <div>
                  <div className="hr-evaluation-page__alert-item">
                    <div className="hr-evaluation-page__alert-title">Kończące się terminy</div>
                    <div className="hr-evaluation-page__alert-description">5 ocen kończy się w ciągu najbliższych 7 dni</div>
                  </div>
                  <div className="hr-evaluation-page__alert-item">
                    <div className="hr-evaluation-page__alert-title">Brakujące formularze</div>
                    <div className="hr-evaluation-page__alert-description">8 pracowników nie rozpoczęło jeszcze samooceny</div>
                  </div>
                  <div className="hr-evaluation-page__alert-item">
                    <div className="hr-evaluation-page__alert-title">Zbliżające się terminy</div>
                    <div className="hr-evaluation-page__alert-description">12 ocen kończy się w ciągu najbliższych 3 dni</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderActiveFlow();
};

export default HREvaluationPage;
