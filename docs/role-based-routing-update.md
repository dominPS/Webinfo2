# Aktualizacja systemu ról i przekierowań

## Wprowadzone zmiany

### 1. Automatyczne przekierowanie na podstawie ról użytkownika

**Problem:** Użytkownicy musieli ręcznie wybierać swój profil po zalogowaniu z strony `ProfileSelectionPage`.

**Rozwiązanie:** Stworzono automatyczny system przekierowań na podstawie ról przypisanych użytkownikowi w bazie danych.

### 2. Nowy komponent `RoleBasedRedirect`

**Lokalizacja:** `src/shared/components/common/RoleBasedRedirect.tsx`

**Funkcjonalność:**
- Automatycznie przekierowuje użytkowników na odpowiednie panele po zalogowaniu
- Hierarchia ról: Admin > HR > Manager > Employee
- Mapowanie ról na panele:
  - `HR`, `Admin` → Panel HR (`/employee-evaluation/hr`)
  - `Manager` → Panel Lidera (`/employee-evaluation/leader`) 
  - `Employee` → Panel Pracownika (`/employee-evaluation/worker`)

### 3. Zaktualizowany typ `User`

**Zmiany w `src/lib/api/types.ts`:**
- Dodano pole `roles: string[]` - lista wszystkich ról użytkownika
- Dodano pola z backendu: `employeeId`, `department`, `position`, `manager`, `isActive`
- Zachowano kompatybilność wsteczną

### 4. Zmodyfikowany routing

**Zmiany w `src/app/router/index.tsx`:**
- Główna strona (`/`) teraz używa `RoleBasedRedirect` zamiast `ProfileSelectionPage`
- Route `/employee-evaluation` również używa `RoleBasedRedirect`
- Usunięto import `ProfileSelectionPage`

### 5. Usunięte komponenty

**Usunięto:**
- `src/features/employeeEvaluation/pages/ProfileSelectionPage.tsx`
- Export `ProfileSelectionPage` z indeksów

## Przepływ użytkownika po zmianach

1. **Logowanie:** Użytkownik loguje się na `/login`
2. **Przekierowanie:** Po zalogowaniu → przekierowanie na `/`
3. **Automatyczne routowanie:** `RoleBasedRedirect` sprawdza role użytkownika
4. **Panel docelowy:** Przekierowanie na odpowiedni panel na podstawie najwyższej roli

## Role w systemie

Zgodnie z seedem bazy danych (`OcenaPlusDbContext.cs`):

- **Employee** (ID: 1) - Pracownik
- **Manager** (ID: 2) - Menedżer/Lider  
- **HR** (ID: 3) - Dział kadr
- **Admin** (ID: 4) - Administrator systemu

## Testowanie

**Konta testowe:**
- `jan.kowalski@company.com` / `Test123!` (Employee) → Panel Pracownika
- `anna.nowak@company.com` / `Test123!` (Manager) → Panel Lidera
- `piotr.wisniewski@company.com` / `Test123!` (HR) → Panel HR
- `maria.kowal@company.com` / `Test123!` (Employee) → Panel Pracownika

## Korzyści

✅ **Lepsza UX** - Eliminuje niepotrzebny krok wyboru profilu  
✅ **Bezpieczeństwo** - Role są kontrolowane przez backend  
✅ **Elastyczność** - Łatwe dodawanie nowych ról  
✅ **Spójność** - Jeden punkt kontroli dla routingu opartego na rolach

## Kompatybilność

- ✅ Zachowano wszystkie istniejące panele (`/employee-evaluation/worker`, `/leader`, `/hr`)
- ✅ Login page bez zmian
- ✅ API calls bez zmian
- ✅ Wszystkie tłumaczenia zachowane
