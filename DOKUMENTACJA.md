# WebInfo - Dokumentacja Projektu

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Architektura aplikacji](#architektura-aplikacji)
3. [Struktura folderów](#struktura-folderów)
4. [Technologie](#technologie)
5. [Główne komponenty](#główne-komponenty)
6. [Zarządzanie stanem](#zarządzanie-stanem)
7. [Routing](#routing)
8. [Internacjonalizacja (i18n)](#internacjonalizacja-i18n)
9. [Stylizacja](#stylizacja)
10. [Uwierzytelnianie](#uwierzytelnianie)
11. [Uruchamianie aplikacji](#uruchamianie-aplikacji)
12. [Instrukcje rozwoju](#instrukcje-rozwoju)
13. [Testowanie](#testowanie)

## Wprowadzenie

WebInfo to nowoczesna aplikacja webowa stworzona przy użyciu React, TypeScript i Vite, zaprojektowana jako system zarządzania informacjami pracowniczymi. Aplikacja oferuje interfejs użytkownika o wysokiej jakości, który jest responsywny, dostępny w wielu językach i zgodny z najlepszymi praktykami UX.

## Architektura aplikacji

Aplikacja została zbudowana zgodnie z architekturą opartą na komponentach, z wykorzystaniem wzorców Feature-Driven Development (FDD). Główne elementy architektury to:

- **MainLayout**: Układ główny z paskiem bocznym (Sidebar) i górnym paskiem nawigacyjnym (TopBar)
- **Sidebar**: Boczne menu nawigacyjne z możliwością zwijania
- **Dashboard**: Strona główna aplikacji
- **Routing**: Zarządzanie ścieżkami i nawigacją
- **Zustand**: Zarządzanie stanem aplikacji
- **i18n**: Wsparcie dla wielu języków (EN, PL, FR, DE, UK)

## Struktura folderów

```
src/
  App.tsx                # Główny komponent aplikacji
  main.ts                # Punkt wejścia aplikacji
  main.tsx               # Alternatywny punkt wejścia (np. dla React)
  style.css              # Globalne style
  typescript.svg         # Ikona projektu
  vite-env.d.ts          # Typy środowiska Vite
  emotion.d.ts           # Typy dla Emotion
  app/
    i18n.ts              # Konfiguracja internacjonalizacji
    providers/           # Dostawcy kontekstu (Theme, MUI)
    router/              # Konfiguracja routera
  components/
    ui/                  # Komponenty UI (Button, Card, Container, Input, LoadingSpinner)
  contexts/              # Konteksty React (np. SidebarContext)
  features/
    auth/                # Logowanie i autoryzacja
    clients/             # Zarządzanie klientami
    dashboard/           # Strona główna
    employeeEvaluation/  # Ocena pracowników
    eTeczka/             # Elektroniczna teczka
    invoices/            # Faktury
    licenses/            # Licencje
    mui-demo/            # Demo komponentów MUI
    navigation/          # Sidebar, TopBar
    settings/            # Ustawienia
  hooks/
    useAuth.ts           # Hook uwierzytelniania
    useUIState.ts        # Hook stanu UI
  layouts/
    MainLayout.tsx       # Główny układ aplikacji
  lib/
    styles/global.ts     # Globalne style JS
  pages/
    index.ts             # Strony aplikacji
    Dashboard/           # Dashboard
    EmployeeEvaluation/  # Ocena pracowników
    ETeczka/             # Elektroniczna teczka
    HREvaluation/        # Ocena HR
    LeaderEvaluation/    # Ocena lidera
    Login/               # Logowanie
    NotFound/            # Strona 404
    ProfileSelection/    # Wybór profilu
    WorkerEvaluation/    # Ocena pracownika
  shared/
    assets/              # Ikony, obrazy
    components/          # Wspólne komponenty (BasePage, ErrorBoundary, Footer, Icon)
    test/                # Testy jednostkowe i narzędzia
      setup.ts           # Konfiguracja testów
      utils/             # Funkcje pomocnicze do testów
  types/
    i18next.d.ts         # Typy dla i18next
public/
  logo.svg, logo-new.svg, vite.svg   # Pliki graficzne
  locales/               # Tłumaczenia (de, en, fr, pl, uk)
```

## Technologie

- **React 19** - Biblioteka do budowy interfejsów użytkownika
- **TypeScript** - Typowany JavaScript
- **Vite** - Szybkie narzędzie do budowy i rozwoju aplikacji
- **React Router** - Routing w aplikacji
- **Emotion** - Stylizacja komponentów z CSS-in-JS
- **i18next** - Internacjonalizacja
- **Zustand** - Zarządzanie stanem aplikacji
- **React Query** - Zarządzanie zapytaniami i stanem serwera

## Główne komponenty

### MainLayout

Główny układ aplikacji, który zawiera wspólne elementy interfejsu jak pasek boczny, górny pasek i stopkę. Wszystkie podstrony są renderowane wewnątrz tego układu jako dzieci poprzez `Outlet` z React Router.

### Sidebar

Pasek boczny zawierający logo aplikacji i menu nawigacyjne z możliwością zwijania. Pasek można zwinąć do widoku ikon lub rozwinąć z pełnymi nazwami sekcji.

Kluczowe funkcje:
- Zwijanie/rozwijanie
- Wielojęzyczna nawigacja
- Wsparcie dla ikon
- Przycisk wylogowania/logowania
- Stylizacja aktywnych elementów

### Dashboard

Strona główna aplikacji, która wyświetla różne widoki w zależności od stanu uwierzytelnienia:
- Dla niezalogowanych użytkowników: powitalny ekran z opcjami logowania
- Dla zalogowanych użytkowników: spersonalizowany dashboard z informacjami

### Logo i ReportsLogo

Komponenty odpowiedzialne za wyświetlanie logo aplikacji w pasku bocznym i górnym pasku. Logo w górnym pasku (ReportsLogo) służy również jako link do strony głównej.

### LanguageSelector

Komponent umożliwiający zmianę języka aplikacji. Dostępne języki:
- polski (PL)
- angielski (EN)

## Zarządzanie stanem

Aplikacja korzysta z Zustand do zarządzania globalnym stanem. Główne sklepy to:

### useAuth

Zarządza stanem uwierzytelniania, w tym:
- Logowanie/wylogowanie użytkowników
- Przechowywanie informacji o zalogowanym użytkowniku
- Sprawdzanie uprawnień

```typescript
interface AuthState {
  isLoggedIn: boolean;
  user: {
    id: string;
    username: string;
    role: 'employee' | 'manager' | 'admin';
  } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```

### useUIState

Zarządza stanem interfejsu użytkownika:
- Widoczność formularza logowania
- Inne stany UI

```typescript
interface UIState {
  showLoginForm: boolean;
  setShowLoginForm: (show: boolean) => void;
}
```

## Routing

Routing jest zarządzany za pomocą React Router. Główna konfiguracja znajduje się w pliku `src/shared/routes/index.tsx`.

Przykładowe ścieżki:
- `/` - Dashboard (strona główna)
- `/login` - Strona logowania
- `/mobile-apps` - Aplikacje mobilne
- `/attendance-list` - Lista obecności
- `/settings` - Ustawienia

## Internacjonalizacja (i18n)


Aktualnie dostępne języki:
- polski (PL) — domyślny
- angielski (EN)

Konfiguracja i18n znajduje się w pliku `src/i18n.ts`. Tłumaczenia są przechowywane w katalogu `public/locales/{kod_języka}/translation.json`.

Przykład użycia:
```tsx
const { t } = useTranslation();
<Title>{t('homepage.title')}</Title>
```

## Stylizacja


Aplikacja korzysta z biblioteki Emotion do stylizacji komponentów w podejściu CSS-in-JS. Dzięki temu:
- Style są definiowane bezpośrednio w plikach TypeScript/TSX jako funkcje lub template stringi
- Możliwa jest dynamiczna stylizacja na podstawie propsów komponentu
- Łatwo zarządzać motywem globalnym (np. kolory, spacing, typografia)
- Komponenty mogą dziedziczyć style i korzystać z ThemeProvider
- Możliwe jest stosowanie animacji, responsywności i warunkowych styli

Globalne style, motyw oraz ThemeProvider znajdują się w `src/shared/theme` oraz w `src/app/providers/ThemeProvider.tsx`.
Przykładowe użycie:
```tsx
import styled from '@emotion/styled';

const MyButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1rem;
  transition: background 0.2s;
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;
```

## Uwierzytelnianie

Aplikacja wykorzystuje prosty system uwierzytelniania demo z predefiniowanymi użytkownikami:
- employee/employee - widok pracownika
- manager/manager - widok kierownika
- admin/admin - widok administratora

W rzeczywistym środowisku produkcyjnym należałoby zaimplementować bezpieczniejszy system uwierzytelniania, np. z wykorzystaniem JWT lub OAuth.

## Uruchamianie aplikacji

Aby uruchomić aplikację lokalnie:

1. Zainstaluj zależności:
   ```
   npm install
   ```

2. Uruchom serwer deweloperski:
   ```
   npm run dev
   ```

3. Zbuduj wersję produkcyjną:
   ```
   npm run build
   ```

4. Podgląd wersji produkcyjnej:
   ```
   npm run preview
   ```

## Instrukcje rozwoju

### Dodawanie nowej strony

1. Utwórz nowy komponent strony w odpowiednim katalogu w `src/features`
2. Dodaj nową ścieżkę w konfiguracji routingu (`src/shared/routes/index.tsx`)
3. Dodaj element nawigacyjny w `src/features/navigation/Sidebar.tsx`
4. Dodaj tłumaczenia dla nowej strony we wszystkich plikach językowych

### Dodawanie nowego języka

1. Utwórz nowy katalog z kodem języka w `public/locales/`
2. Skopiuj plik `translation.json` z istniejącego języka
3. Przetłumacz wszystkie klucze
4. Dodaj język do selektora języków w `src/shared/components/LanguageSelector.tsx`
5. Dodaj kod języka do konfiguracji i18n w `src/i18n.ts`

### Znane problemy i rozwiązania

- **Problem z logowaniem**: Po zalogowaniu w trybie wyświetlania Dashboard, użytkownik może stracić dostęp do nawigacji. Rozwiązaniem jest zmiana logiki w komponencie Dashboard, aby zawsze wyświetlał się w kontekście MainLayout.
- **Nawigacja do strony głównej**: Obecnie można wrócić do strony głównej tylko klikając w logo "Reports" w górnym pasku. Warto rozważyć dodanie linku "Dashboard" w menu bocznym.

## Testowanie

WebInfo powinno zawierać kompleksowy zestaw testów automatycznych, zapewniających stabilność i jakość kodu. Na obecnym etapie projektu, zalecane jest wdrożenie następujących rodzajów testów:

### Testy jednostkowe

Testy jednostkowe powinny pokrywać logikę biznesową, transformacje danych oraz złożone funkcje, w szczególności:

- Komponenty UI (renderowanie, interakcje)
- Hooki niestandardowe (`useAuth`, `useUIState`)
- Funkcje pomocnicze i narzędziowe
- Store'y Zustand i ich akcje

**Zalecane narzędzia:**
- Jest lub Vitest jako framework testowy
- React Testing Library do testowania komponentów
- MSW (Mock Service Worker) do mockowania żądań API

```typescript
// Przykładowy test komponentu z React Testing Library
import { render, screen } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';

test('renders language options', () => {
  render(<LanguageSelector />);
  expect(screen.getByText('English')).toBeInTheDocument();
  expect(screen.getByText('Polski')).toBeInTheDocument();
});
```

### Testy integracyjne

Testy integracyjne powinny sprawdzać współpracę między różnymi częściami aplikacji:

- Interakcje między komponentami
- Przepływy uwierzytelniania
- Zmiany stanu globalnego
- Nawigację i routing
- Obsługę międzynarodowych formatów

### Testy end-to-end (E2E)

Testy E2E symulują działania użytkownika w aplikacji, sprawdzając całe przepływy pracy:

- Przepływ logowania i wylogowania
- Nawigacja przez aplikację
- Zmiana języka
- Interakcje z formularzami

**Zalecane narzędzia:**
- Cypress lub Playwright do testów E2E

```typescript
// Przykładowy test Cypress
describe('Authentication Flow', () => {
  it('should allow user to login', () => {
    cy.visit('/');
    cy.get('[data-testid="login-button"]').click();
    cy.get('#username').type('employee');
    cy.get('#password').type('employee');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Jesteś zalogowany jako employee');
  });
});
```

### Testy dostępności

Ze względu na użyteczność aplikacji, zaleca się również testowanie dostępności (accessibility):

- Zgodność z WCAG 2.1
- Nawigacja klawiaturą
- Obsługa czytników ekranu
- Kontrasty i rozmiary tekstu

**Zalecane narzędzia:**
- axe-core lub jest-axe do automatycznych testów dostępności
- Lighthouse do ogólnej oceny dostępności

### Konfiguracja CI/CD

Testy powinny być zintegrowane z potokiem CI/CD:

- Uruchamianie testów jednostkowych i integracyjnych przy każdym pull requeście
- Testy E2E uruchamiane przed deploymentem na środowisko testowe
- Generowanie raportów pokrycia kodu

### Plan implementacji testów

1. **Priorytet wysoki:**
   - Testy jednostkowe dla kluczowych komponentów (Sidebar, MainLayout, Dashboard)
   - Testy logiki uwierzytelniania
   - Testy zmiany języka

2. **Priorytet średni:**
   - Testy routingu i nawigacji
   - Testy integracyjne dla głównych przepływów
   - Testy dostępności podstawowych widoków

3. **Priorytet niski:**
   - Testy E2E dla złożonych scenariuszy
   - Testy wydajnościowe
   - Testy wizualne (Visual Regression Tests)
