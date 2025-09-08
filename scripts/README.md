# Scripts

Katalog zawiera skrypty narzędziowe do zarządzania projektem OcenaPlus.

## 📄 Dostępne skrypty

### `check_database.ps1`
Skrypt PowerShell do sprawdzania stanu bazy danych.

**Wymagania:**
- SQL Server LocalDB
- `sqlcmd` w PATH

**Użycie:**
```powershell
.\scripts\check_database.ps1
```

**Co sprawdza:**
- Liczbę planów IDP
- Liczbę celów IDP  
- Liczbę użytkowników
- Szczegóły planów i celów

**Przykładowe wyjście:**
```
=== Sprawdzanie bazy danych OcenaPlus ===
Liczba planów IDP: 5
Liczba celów IDP: 12
Liczba użytkowników: 4

=== Szczegóły planów IDP ===
[tabela z planami]

=== Szczegóły celów IDP ===
[tabela z celami]
```
