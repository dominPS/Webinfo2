# 🔗 WebInfo ↔ OcenaPlus Integration

Bezproblemowa integracja między systemem WebInfo a platformą ocen pracowniczych OcenaPlus.

## 📋 Przegląd

Ta integracja umożliwia użytkownikom WebInfo bezpośrednie przekierowanie do systemu ocen pracowniczych OcenaPlus z automatycznym logowaniem (Single Sign-On). Użytkownicy klikają przycisk "Przejdź do ocen" w WebInfo i są automatycznie zalogowani w OcenaPlus.

### ✨ Główne funkcje

- **🎯 Single Sign-On (SSO)** - automatyczne logowanie bez wprowadzania haseł
- **👥 Synchronizacja użytkowników** - automatyczne tworzenie/aktualizowanie kont
- **🔐 Bezpieczna autoryzacja** - JWT tokens + API keys
- **⚡ Szybka implementacja** - gotowe biblioteki i przykłady
- **📊 Monitoring** - szczegółowe logi i metryki

### 🏗️ Architektura

```
┌─────────────┐    SSO API     ┌─────────────┐    Token     ┌──────────────┐
│   WebInfo   │ ─────────────→ │ OcenaPlus   │ ───────────→ │ OcenaPlus    │
│ Application │                │    API      │              │   Frontend   │
└─────────────┘                └─────────────┘              └──────────────┘
```

## 🚀 Quick Start

### Dla administratorów WebInfo

1. **Otrzymaj dane dostępowe** od zespołu OcenaPlus:
   - API Key
   - Client ID  
   - URL endpointów

2. **Dodaj przycisk w WebInfo**:
```html
<button onclick="redirectToOcenaPlus()">🎯 Przejdź do ocen</button>

<script>
async function redirectToOcenaPlus() {
    const response = await fetch('https://api.ocenaplus.com/api/WebInfo/SSO', {
        method: 'POST',
        headers: {
            'ClientApiKey': 'your-api-key',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: getCurrentUserEmail(), // Twoja funkcja
            clientId: 'your-client-id',
            redirectUrl: '/evaluations'
        })
    });
    
    const data = await response.json();
    window.open(`https://ocenaplus.com${data.redirectUrl}?token=${data.token}`, '_blank');
}
</script>
```

3. **Testuj** - użyj demo page lub własnej implementacji

### Dla developerów

Zobacz szczegółową dokumentację w folderze `docs/`:

- **[WebInfo-Developer-Guide.md](docs/WebInfo-Developer-Guide.md)** - pełny przewodnik implementacji
- **[WebInfo-Integration-Documentation.md](docs/WebInfo-Integration-Documentation.md)** - dokumentacja biznesowa  
- **[WebInfo-API-Technical-Documentation.md](docs/WebInfo-API-Technical-Documentation.md)** - dokumentacja techniczna API

## 📁 Struktura projektu

```
WebInfo-Integration/
├── docs/                                    # 📚 Dokumentacja
│   ├── WebInfo-Integration-Documentation.md # Dokumentacja główna
│   ├── WebInfo-API-Technical-Documentation.md # Dokumentacja techniczna API
│   ├── WebInfo-Developer-Guide.md           # Przewodnik dla developerów
│   ├── webinfo-api-integration.md           # API Reference
│   └── webinfo-integration-demo.html        # Demo strona
├── backend/OcenaPlus.API/                   # 🔧 Backend API
│   ├── Controllers/WebInfoController.cs     # Kontroler integracji
│   ├── DTOs/WebInfoDto.cs                   # Modele danych
│   └── appsettings.json                     # Konfiguracja (API keys)
└── README.md                                # Ten plik
```

## 🔧 Endpointy API

| Endpoint | Metoda | Opis | Dokumentacja |
|----------|--------|------|-------------|
| `/api/WebInfo/SSO` | POST | Single Sign-On | [📖](docs/WebInfo-API-Technical-Documentation.md#1-post-apiwebinfosso) |
| `/api/WebInfo/AddUser` | POST | Dodanie użytkownika | [📖](docs/WebInfo-API-Technical-Documentation.md#2-post-apiwebinfoadduser) |
| `/api/WebInfo/UpdateUser` | PUT | Aktualizacja użytkownika | [📖](docs/WebInfo-API-Technical-Documentation.md#3-put-apiwebinfoupdateuser) |
| `/api/WebInfo/GetClientUsers` | GET | Lista użytkowników | [📖](docs/WebInfo-API-Technical-Documentation.md#4-get-apiwebinfogetclientusers) |
| `/api/WebInfo/GetUserRoles` | GET | Role użytkownika | [📖](docs/WebInfo-API-Technical-Documentation.md#5-get-apiwebinfogetuserroles) |

## 💼 Przykłady użycia

### JavaScript/TypeScript
```javascript
const ocenaPlus = new OcenaPlusIntegration({
    apiKey: 'your-api-key',
    apiBaseUrl: 'https://api.ocenaplus.com/api/WebInfo',
    frontendUrl: 'https://ocenaplus.com',
    clientId: 'your-client-id'
});

await ocenaPlus.redirectToEvaluations('jan.kowalski@firma.pl');
```

### React
```jsx
const OcenyButton = ({ currentUser }) => {
    const handleClick = async () => {
        await ocenaPlus.redirectToEvaluations(currentUser.email, {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            departmentName: currentUser.department.name,
            positionName: currentUser.position.name
        });
    };
    
    return <button onClick={handleClick}>🎯 Przejdź do ocen</button>;
};
```

### PHP
```php
$ocenaPlus = new OcenaPlusIntegration([
    'apiKey' => $_ENV['OCENAPLUS_API_KEY'],
    'baseUrl' => 'https://api.ocenaplus.com/api/WebInfo',
    'clientId' => $_ENV['OCENAPLUS_CLIENT_ID']
]);

$result = $ocenaPlus->redirectUser($userEmail, $userData);
```

## 🔒 Bezpieczeństwo

- **API Keys** - unikalne klucze per klient
- **HTTPS** - szyfrowana komunikacja
- **JWT Tokens** - czas wygaśnięcia 60 minut
- **CORS** - ograniczenie do zaufanych domen
- **Rate Limiting** - ochrona przed nadużyciem

## 🧪 Testowanie

### Demo strona
Otwórz `docs/webinfo-integration-demo.html` w przeglądarce aby przetestować wszystkie funkcjonalności.

### Środowiska testowe
- **Development API**: `https://dev-api.ocenaplus.com/api/WebInfo`
- **Staging API**: `https://staging-api.ocenaplus.com/api/WebInfo`
- **Production API**: `https://api.ocenaplus.com/api/WebInfo`

## 📊 Monitoring

### Metryki do śledzenia
- Liczba wywołań SSO (dziennie/miesięcznie)
- Czas odpowiedzi API
- Wskaźnik błędów (4xx/5xx)
- Aktywni użytkownicy przekierowani

### Logi
```javascript
// Włączenie debugowania
localStorage.setItem('ocenaplus_debug', 'true');

// Logi w konsoli przeglądarki
[OcenaPlusIntegration] Making POST request to: https://api.ocenaplus.com/api/WebInfo/SSO
[OcenaPlusIntegration] SSO successful for user: jan.kowalski@firma.pl
```

## 🔧 Konfiguracja

### Zmienne środowiskowe (.env)
```env
# OcenaPlus Integration
OCENAPLUS_API_KEY=webinfo-production-key
OCENAPLUS_API_URL=https://api.ocenaplus.com/api/WebInfo  
OCENAPLUS_FRONTEND_URL=https://ocenaplus.com
OCENAPLUS_CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Backend (appsettings.json)
```json
{
  "WebInfo": {
    "ApiKeys": {
      "webinfo-production-key": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
  }
}
```

## 🚨 Rozwiązywanie problemów

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|-------------|
| "Invalid API key" | Nieprawidłowy klucz | Sprawdź konfigurację API key |
| "CORS error" | Brak dostępu do API | Skontaktuj się z zespołem OcenaPlus |
| "User not found" | Brak użytkownika | Użyj AddUser endpoint |
| "Popup blocked" | Zablokowane popupy | Poinformuj użytkownika |

## 📞 Wsparcie

### Dla biznesu
- **Email**: support@ocenaplus.com
- **Telefon**: +48 123 456 789
- **Godziny**: Pon-Pt, 9:00-17:00

### Dla developerów  
- **Email**: developers@ocenaplus.com
- **Slack**: #webinfo-integration
- **Dokumentacja**: https://docs.ocenaplus.com
- **Status API**: https://status.ocenaplus.com

## 📈 Roadmapa

### v1.1 (Q4 2025)
- [ ] Batch import użytkowników
- [ ] Webhook notifications
- [ ] Advanced analytics dashboard

### v1.2 (Q1 2026)
- [ ] Multi-tenant support  
- [ ] Custom role mapping
- [ ] Mobile app integration

### v2.0 (Q2 2026)
- [ ] Real-time synchronization
- [ ] Advanced security features
- [ ] GraphQL API

## 🤝 Wkład w projekt

### Zgłaszanie błędów
1. Sprawdź [Issues](https://github.com/ocenaplus/webinfo-integration/issues)
2. Utwórz nowy issue z szczegółowym opisem
3. Dołącz logi i kroki reprodukcji

### Propozycje funkcji
1. Utwórz [Feature Request](https://github.com/ocenaplus/webinfo-integration/issues/new?template=feature_request.md)
2. Opisz przypadek użycia
3. Zaproponuj implementację

### Pull Requests
1. Fork repository
2. Utwórz feature branch
3. Dodaj testy
4. Utwórz PR z opisem zmian

## 📄 Licencja

Ten projekt jest objęty licencją MIT. Zobacz [LICENSE](LICENSE) aby uzyskać szczegóły.

---

## 📋 Checklist wdrożenia

### Pre-wdrożenie
- [ ] Otrzymane dane dostępowe (API Key, Client ID)
- [ ] Przetestowana integracja na środowisku dev
- [ ] Przeprowadzone testy z prawdziwymi użytkownikami
- [ ] Skonfigurowane środowisko produkcyjne
- [ ] Przygotowana dokumentacja dla zespołu

### Wdrożenie
- [ ] Wdrożenie kodu na produkcję
- [ ] Konfiguracja monitoringu
- [ ] Testy smoke na produkcji
- [ ] Powiadomienie użytkowników o nowej funkcji

### Post-wdrożenie
- [ ] Monitoring metryk przez pierwsze 24h
- [ ] Zebranie feedbacku od użytkowników
- [ ] Optymalizacja na podstawie danych
- [ ] Dokumentacja lessons learned

---

**🏢 OcenaPlus Team**  
**📧 Contact**: integration@ocenaplus.com  
**🌐 Website**: https://ocenaplus.com  
**📚 Docs**: https://docs.ocenaplus.com

**Ostatnia aktualizacja**: September 2025  
**Wersja integracji**: 1.0.0
