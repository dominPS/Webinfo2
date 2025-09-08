# Funkcjonalność wylogowania

## Przegląd

Dodano kompletną funkcjonalność wylogowania do aplikacji z eleganckim dropdown menu profilu użytkownika.

## Nowe komponenty

### ProfileMenu (`src/shared/components/navigation/ProfileMenu.tsx`)

Inteligentne dropdown menu profilu użytkownika z następującymi funkcjonalnościami:

**Wyświetlane informacje:**
- Imię i nazwisko użytkownika
- Adres email 
- Role użytkownika
- Avatar (emoji 👤)

**Opcje menu:**
- **Mój profil** - (przygotowane na przyszłość)
- **Ustawienia** - (przygotowane na przyszłość) 
- **Wyloguj się** - natychmiastowe wylogowanie

**Funkcjonalności UX:**
- Smooth animacje otwierania/zamykania
- Automatyczne zamykanie przy kliknięciu poza menu
- Responsive design
- Keyboard navigation support
- Hover states dla wszystkich interakcji

## Zmiany w MainLayout

**MainLayout.tsx:**
- Zastąpiono prosty przycisk profilu zaawansowanym `ProfileMenu`
- Usunięto nieużywany `ProfileButton` styled component
- Dodano import `ProfileMenu`

## Logika wylogowania

**AuthStore:**
- Wykorzystuje istniejącą funkcję `logout()` z `useAuthStore`
- Czyszczy dane użytkownika ze store'a
- Usuwa token z localStorage (via AuthService)
- Przekierowuje na `/login`

## Internacjonalizacja

**Dodane tłumaczenia:**

**Polski (`public/locales/pl/translation.json`):**
```json
"profile": {
  "menu": {
    "profile": "Mój profil",
    "settings": "Ustawienia", 
    "logout": "Wyloguj się"
  }
}
```

**Angielski (`public/locales/en/translation.json`):**
```json
"profile": {
  "menu": {
    "profile": "My Profile",
    "settings": "Settings",
    "logout": "Logout"
  }
}
```

## Bezpieczeństwo

- **Token cleanup:** AuthService automatycznie usuwa JWT token
- **Store cleanup:** Wszystkie dane użytkownika są czyszczone 
- **Redirect:** Natychmiastowe przekierowanie na stronę logowania
- **No persistence:** Brak możliwości powrotu bez ponownego logowania

## Styling

**Design konsystentny z aplikacją:**
- Używa motywu kolorów z `theme`
- Glassmorphism effects na dropdown
- Smooth shadows i transitions
- Material Design inspired hover states
- Responsywne na urządzeniach mobilnych

## Accessibility (A11y)

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus management  
- ✅ Screen reader friendly
- ✅ High contrast ratios

## Użycie

**Dla użytkownika:**
1. Kliknij na swoje imię w prawym górnym rogu
2. Pojawi się dropdown menu
3. Kliknij "Wyloguj się"
4. Zostaniesz przekierowany na stronę logowania

**Dla developera:**
```tsx
import { ProfileMenu } from '../shared/components/navigation/ProfileMenu';

// W komponencie
<ProfileMenu />
```

## Przyszłe rozszerzenia

**Gotowe do implementacji:**
- Strona profilu użytkownika (`/profile`)
- Ustawienia użytkownika (`/settings`)
- Change password functionality
- Theme preferences
- Notification settings

## Kompatybilność

- ✅ Wszystkie istniejące funkcjonalności zachowane
- ✅ Responsive design
- ✅ Wszystkie przeglądarki 
- ✅ Touch devices
- ✅ Keyboard users
