# OcenaPlus - System Oceny Pracowników

System do zarządzania ocenami pracowników, planami rozwoju indywidualnego (IDP) oraz samoocenami.

## Szybki start

### Wymagania
- .NET 8.0 SDK
- Node.js 18+ 
- SQL Server LocalDB lub SQL Server

### Uruchomienie aplikacji

1. **Backend (.NET API)**
   ```bash
   cd backend/OcenaPlus.API
   dotnet run
   ```
   API będzie dostępne na: `http://localhost:5140`

2. **Frontend (React + Vite)**
   ```bash
   npm install
   npm run dev
   ```
   Aplikacja będzie dostępna na: `http://localhost:5173`

### Dane testowe

Po uruchomieniu backendu, załaduj przykładowe dane:
```bash
curl -X POST http://localhost:5140/api/seed/sample-data
```

**Konta testowe:**
- `jan.kowalski@company.com` / `Test123!` (Employee)
- `anna.nowak@company.com` / `Test123!` (Manager)  
- `piotr.wisniewski@company.com` / `Test123!` (HR)
- `maria.kowal@company.com` / `Test123!` (Employee)

## Struktura projektu

```
Webinfo2/
├── backend/              # Backend .NET API
│   ├── OcenaPlus.API/    # Główny projekt API
│   ├── OcenaPlus.Domain/ # Modele domenowe
│   └── OcenaPlus.Infrastructure/ # Warstwa danych
├── src/                  # Frontend React
│   ├── components/       # Komponenty UI
│   ├── features/        # Funkcjonalności biznesowe
│   ├── pages/           # Strony aplikacji
│   ├── lib/             # Biblioteki i utilities
│   └── shared/          # Współdzielone komponenty
├── public/              # Pliki statyczne
├── scripts/             # Skrypty narzędziowe
├── docs/                # Dokumentacja
└── dist/                # Build produkcyjny
```

## Narzędzia

### Skrypty
- `scripts/check_database.ps1` - Sprawdzanie stanu bazy danych

### API Endpoints
- `GET /api/health` - Status zdrowia aplikacji
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Informacje o użytkowniku
- `POST /api/seed/sample-data` - Ładowanie danych testowych

## Technologie

**Backend:**
- .NET 8.0
- Entity Framework Core
- JWT Authentication
- BCrypt dla hashowania haseł

**Frontend:**
- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- React Router
- TanStack Query
- Zustand
- i18next (internacjonalizacja)

**Baza danych:**
- SQL Server / LocalDB
- Entity Framework Migrations

## Rozwój

### Budowanie
```bash
# Frontend
npm run build

# Backend  
cd backend/OcenaPlus.API
dotnet publish -c Release
```

### Linting i formatowanie
```bash
npm run lint    # (gdy zostanie dodane)
npm run format  # (gdy zostanie dodane)
```
