# Instrukcje uruchamiania aplikacji w Firefox

## Problem z bezpieczeństwem w Firefox

Firefox ma bardzo restrykcyjne ustawienia bezpieczeństwa i nie pozwala na uruchamianie nowoczesnych aplikacji React bez HTTPS.

## Rozwiązanie

### 1. Uruchom serwer z HTTPS

Użyj jednego z następujących sposobów:

```powershell
# Opcja 1: Użyj gotowego skryptu (rekomendowane)
.\dev-firefox-https.ps1

# Opcja 2: Uruchom bezpośrednio z npm
npm run dev:firefox

# Opcja 3: Podstawowy serwer (bez HTTPS - może nie działać w Firefox)
npm run dev
```

### 2. Akceptacja certyfikatu w Firefox

Gdy otworzysz `https://localhost:5173/` w Firefox:

1. Zobaczysz ostrzeżenie: **"Your connection is not secure"**
2. Kliknij **"Advanced..."** 
3. Kliknij **"Accept the Risk and Continue"**
4. Aplikacja powinna się załadować

### 3. Alternatywne rozwiązanie (jeśli HTTPS nie działa)

Jeśli nadal masz problemy, możesz wyłączyć niektóre funkcje bezpieczeństwa Firefox:

1. W adresie wpisz: `about:config`
2. Zaakceptuj ostrzeżenie
3. Wyszukaj: `security.tls.insecure_fallback_hosts`
4. Dodaj: `localhost,127.0.0.1`

### 4. Rozwiązywanie problemów

- **Błąd "Mixed Content"**: Upewnij się, że wszystkie zasoby są ładowane przez HTTPS
- **Błąd "Source Maps"**: Source mapy są wyłączone w konfiguracji
- **Cache**: Użyj `.\clean-firefox.ps1` aby wyczyścić cache

### Pliki pomocnicze:

- `dev-firefox-https.ps1` - uruchamia serwer z HTTPS
- `clean-firefox.ps1` - czyści cache
- `dev-firefox.ps1` - podstawowy serwer (może nie działać)

## Dlaczego to konieczne?

Firefox wprowadził bardzo restrykcyjne zasady bezpieczeństwa dla:
- Service Workers
- Web Workers  
- ES Modules
- Modern JavaScript APIs

Te funkcje wymagają bezpiecznego kontekstu (HTTPS), nawet dla developmentu lokalnego.
