# WebInfo API Integration - Dokumentacja

## Przegląd

System integracji WebInfo z OcenaPlus umożliwia bezproblemowe przekierowanie użytkowników z aplikacji WebInfo do systemu ocen pracowników. Użytkownicy mogą kliknąć przycisk "Oceny pracownicze" w WebInfo i zostać automatycznie zalogowani w systemie OcenaPlus.

## Spis treści

1. [Architektura systemu](#architektura-systemu)
2. [Konfiguracja](#konfiguracja)
3. [Endpointy API](#endpointy-api)
4. [Implementacja po stronie WebInfo](#implementacja-po-stronie-webinfo)
5. [Bezpieczeństwo](#bezpieczeństwo)
6. [Przykłady użycia](#przykłady-użycia)
7. [Testowanie](#testowanie)
8. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Architektura systemu

```
┌─────────────┐    API Call     ┌─────────────────┐    SSO/Token    ┌──────────────┐
│   WebInfo   │ ──────────────→ │  OcenaPlus API  │ ──────────────→ │ OcenaPlus UI │
│ Application │                 │   (Backend)     │                 │  (Frontend)  │
└─────────────┘                 └─────────────────┘                 └──────────────┘
       │                                 │                                   │
       │ User clicks                     │ JWT Token                        │ Auto login
       │ "Oceny" button                  │ generation                       │ with token
       │                                 │                                   │
       ▼                                 ▼                                   ▼
User authentication                Database sync                     Evaluation
and data retrieval                 and validation                    system access
```

### Główne komponenty:

1. **WebInfo Application** - źródłowa aplikacja z danymi pracowników
2. **OcenaPlus API** - backend z endpointami integracyjnymi
3. **OcenaPlus Frontend** - interfejs systemu ocen
4. **Baza danych** - synchronizacja danych użytkowników

## Konfiguracja

### 1. Konfiguracja backend (OcenaPlus API)

#### appsettings.json
```json
{
  "WebInfo": {
    "ApiKeys": {
      "webinfo-production-key": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "webinfo-test-key": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
      "webinfo-dev-key": "c3d4e5f6-g7h8-9012-cdef-345678901234"
    }
  },
  "Jwt": {
    "Key": "YourSuperSecretJWTKeyThatShouldBeLongerThan32Characters",
    "Issuer": "OcenaPlus",
    "Audience": "OcenaPlusUsers",
    "ExpireMinutes": 60
  }
}
```

#### CORS Configuration (Program.cs)
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebInfo", policy =>
    {
        policy.WithOrigins("https://webinfo.yourdomain.com", "https://webinfo-test.yourdomain.com")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

### 2. Konfiguracja frontend (WebInfo)

#### Podstawowa konfiguracja
```javascript
const config = {
    apiKey: 'webinfo-production-key',
    apiBaseUrl: 'https://api.ocenaplus.yourdomain.com/api/WebInfo',
    frontendUrl: 'https://ocenaplus.yourdomain.com',
    clientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
};
```

## Endpointy API

### Base URL
```
https://api.ocenaplus.yourdomain.com/api/WebInfo
```

### Autoryzacja
Wszystkie endpointy wymagają nagłówka:
```
ClientApiKey: your-api-key-here
```

### 1. Single Sign-On (SSO)
**POST** `/SSO`

Główny endpoint do przekierowywania użytkowników z WebInfo do OcenaPlus.

#### Request Body:
```json
{
  "email": "jan.kowalski@firma.pl",
  "clientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "redirectUrl": "/evaluations",
  "userData": {
    "firstName": "Jan",
    "lastName": "Kowalski",
    "departmentName": "IT",
    "positionName": "Software Developer",
    "roleNames": ["Employee"]
  }
}
```

#### Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "redirectUrl": "/evaluations",
  "user": {
    "id": 15,
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "jan.kowalski@firma.pl",
    "employeeId": "EMP001",
    "department": "IT",
    "position": "Software Developer",
    "isActive": true,
    "roles": ["Employee", "Developer"]
  }
}
```

### 2. Dodawanie użytkownika
**POST** `/AddUser`

#### Request Body:
```json
{
  "firstName": "Anna",
  "lastName": "Nowak",
  "email": "anna.nowak@firma.pl",
  "employeeId": "EMP002",
  "departmentName": "HR",
  "positionName": "HR Specialist",
  "managerEmail": "jan.manager@firma.pl",
  "defaultPassword": "TempPassword123!",
  "roleNames": ["Employee", "HR"]
}
```

### 3. Aktualizacja użytkownika
**PUT** `/UpdateUser`

#### Request Body:
```json
{
  "firstName": "Anna",
  "lastName": "Nowak-Kowalska",
  "email": "anna.nowak@firma.pl",
  "departmentName": "HR",
  "positionName": "Senior HR Specialist",
  "isActive": true,
  "clientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "roleNames": ["Employee", "HR", "Senior"]
}
```

### 4. Pobieranie użytkowników klienta
**GET** `/GetClientUsers?clientId=a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### 5. Sprawdzanie ról użytkownika
**GET** `/GetUserRoles?email=jan.kowalski@firma.pl&clientId=a1b2c3d4-e5f6-7890-abcd-ef1234567890`

## Implementacja po stronie WebInfo

### 1. Podstawowa klasa integracji

```javascript
class OcenaPlusIntegration {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.apiBaseUrl;
        this.frontendUrl = config.frontendUrl;
        this.clientId = config.clientId;
    }

    async redirectToEvaluations(userEmail, userData = null) {
        try {
            const ssoData = {
                email: userEmail,
                clientId: this.clientId,
                redirectUrl: '/evaluations',
                userData: userData
            };

            const response = await this.makeRequest('/SSO', 'POST', ssoData);
            
            // Otwórz nową kartę z tokenem
            const url = `${this.frontendUrl}${response.redirectUrl}?token=${response.token}`;
            window.open(url, '_blank');
            
            return response;
        } catch (error) {
            console.error('SSO Error:', error);
            throw new Error(`Nie można przekierować do systemu ocen: ${error.message}`);
        }
    }

    async syncUser(userData) {
        try {
            return await this.makeRequest('/UpdateUser', 'PUT', {
                ...userData,
                clientId: this.clientId
            });
        } catch (error) {
            console.error('Sync Error:', error);
            throw error;
        }
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'ClientApiKey': this.apiKey,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return await response.json();
    }
}
```

### 2. Inicjalizacja w aplikacji WebInfo

```javascript
// Konfiguracja
const ocenaPlus = new OcenaPlusIntegration({
    apiKey: 'webinfo-production-key',
    apiBaseUrl: 'https://api.ocenaplus.yourdomain.com/api/WebInfo',
    frontendUrl: 'https://ocenaplus.yourdomain.com',
    clientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
});

// Dodanie event listenera do przycisku
document.getElementById('oceny-button').addEventListener('click', async () => {
    try {
        const currentUser = getCurrentUser(); // Twoja funkcja pobierania aktualnego użytkownika
        
        await ocenaPlus.redirectToEvaluations(currentUser.email, {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            departmentName: currentUser.department,
            positionName: currentUser.position,
            roleNames: currentUser.roles
        });
    } catch (error) {
        alert('Wystąpił błąd podczas przekierowywania do systemu ocen.');
        console.error(error);
    }
});
```

### 3. Obsługa w HTML

```html
<div class="user-actions">
    <button id="oceny-button" class="btn btn-primary">
        🎯 Przejdź do ocen pracowniczych
    </button>
</div>

<script>
    // Inicjalizacja po załadowaniu strony
    document.addEventListener('DOMContentLoaded', function() {
        // Tutaj inicjalizacja OcenaPlusIntegration
    });
</script>
```

## Bezpieczeństwo

### 1. API Keys
- **Przechowywanie**: Tylko po stronie serwera, nigdy w JavaScript frontend
- **Rotacja**: Regularna zmiana kluczy (zalecane co 3-6 miesięcy)
- **Środowiska**: Różne klucze dla dev/test/prod

### 2. HTTPS
- **Obowiązkowe** w produkcji
- Certyfikaty SSL/TLS dla wszystkich komunikacji

### 3. JWT Tokens
- **Czas wygaśnięcia**: 60 minut (konfigurowalny)
- **Payload**: Zawiera user ID, email, role
- **Walidacja**: Automatyczna po stronie OcenaPlus

### 4. CORS
```csharp
// Tylko zaufane domeny
policy.WithOrigins(
    "https://webinfo.yourdomain.com",
    "https://webinfo-test.yourdomain.com"
);
```

### 5. Rate Limiting (zalecane)
```csharp
// W Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("WebInfoAPI", httpContext =>
        RateLimitPartition.CreateFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 10
            }));
});
```

## Przykłady użycia

### 1. Kompletny workflow przekierowania

```javascript
// 1. Użytkownik klika przycisk w WebInfo
async function handleEvaluationRedirect(userId) {
    try {
        // 2. Pobierz dane użytkownika z WebInfo
        const user = await getUserById(userId);
        
        // 3. Wywołaj SSO API
        const ssoResponse = await ocenaPlus.redirectToEvaluations(user.email, {
            firstName: user.firstName,
            lastName: user.lastName,
            departmentName: user.department.name,
            positionName: user.position.name,
            roleNames: user.roles.map(r => r.name)
        });
        
        // 4. Użytkownik zostaje przekierowany automatycznie
        console.log('User redirected successfully:', ssoResponse.user);
        
    } catch (error) {
        // 5. Obsługa błędów
        console.error('Redirection failed:', error);
        showErrorMessage('Nie można otworzyć systemu ocen. Spróbuj ponownie.');
    }
}
```

### 2. Synchronizacja użytkowników (batch)

```javascript
async function syncAllUsers() {
    const users = await getAllWebInfoUsers();
    const results = [];
    
    for (const user of users) {
        try {
            await ocenaPlus.syncUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                departmentName: user.department.name,
                positionName: user.position.name,
                managerEmail: user.manager?.email,
                isActive: user.isActive,
                roleNames: user.roles.map(r => r.name)
            });
            
            results.push({ email: user.email, status: 'success' });
        } catch (error) {
            results.push({ email: user.email, status: 'error', error: error.message });
        }
    }
    
    return results;
}
```

### 3. Sprawdzanie stanu integracji

```javascript
async function checkIntegrationHealth() {
    try {
        // Test połączenia
        const users = await ocenaPlus.makeRequest('/GetClientUsers?clientId=' + ocenaPlus.clientId);
        
        return {
            status: 'healthy',
            usersCount: users.length,
            lastCheck: new Date().toISOString()
        };
    } catch (error) {
        return {
            status: 'error',
            error: error.message,
            lastCheck: new Date().toISOString()
        };
    }
}
```

## Testowanie

### 1. Unit testy (C# - backend)

```csharp
[Test]
public async Task SSO_WithValidData_ReturnsToken()
{
    // Arrange
    var ssoDto = new WebInfoSsoDto
    {
        Email = "test@example.com",
        ClientId = Guid.NewGuid()
    };
    
    // Act
    var result = await _controller.SingleSignOn(ssoDto);
    
    // Assert
    Assert.IsInstanceOf<OkObjectResult>(result);
    var response = ((OkObjectResult)result).Value as WebInfoSsoResponse;
    Assert.IsNotNull(response.Token);
}
```

### 2. Integration testy (JavaScript)

```javascript
describe('OcenaPlus Integration', () => {
    const integration = new OcenaPlusIntegration(testConfig);
    
    test('should redirect user successfully', async () => {
        // Mock user data
        const userData = {
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
        };
        
        // Test SSO
        const response = await integration.redirectToEvaluations(userData.email, userData);
        
        expect(response).toHaveProperty('token');
        expect(response).toHaveProperty('user');
        expect(response.user.email).toBe(userData.email);
    });
});
```

### 3. Testowanie manualne

Użyj pliku `webinfo-integration-demo.html`:

1. Otwórz plik w przeglądarce
2. Ustaw poprawne URL-e API
3. Przetestuj wszystkie funkcjonalności:
   - SSO redirect
   - Dodawanie użytkownika
   - Synchronizacja danych
   - Pobieranie ról

## Rozwiązywanie problemów

### Częste problemy i rozwiązania

#### 1. "Invalid API key"
```
Przyczyna: Nieprawidłowy lub brakujący API key
Rozwiązanie: Sprawdź konfigurację w appsettings.json i nagłówek ClientApiKey
```

#### 2. "CORS error"
```
Przyczyna: Aplikacja WebInfo nie ma dostępu do API
Rozwiązanie: Dodaj domenę WebInfo do konfiguracji CORS
```

#### 3. "User not found"
```
Przyczyna: Użytkownik nie istnieje w bazie OcenaPlus
Rozwiązanie: Użyj endpoint AddUser przed SSO lub UpdateUser
```

#### 4. "Token expired"
```
Przyczyna: JWT token stracił ważność
Rozwiązanie: Wygeneruj nowy token przez ponowne wywołanie SSO
```

#### 5. "Database connection error"
```
Przyczyna: Problem z połączeniem do bazy danych
Rozwiązanie: Sprawdź connection string i stan bazy danych
```

### Logi debugowania

#### Backend (C#)
```csharp
_logger.LogInformation($"SSO request for user: {ssoDto.Email}");
_logger.LogWarning($"User not found: {ssoDto.Email}");
_logger.LogError(ex, $"SSO failed for user: {ssoDto.Email}");
```

#### Frontend (JavaScript)
```javascript
// Włącz szczegółowe logowanie
localStorage.setItem('ocenaplus_debug', 'true');

// W kodzie integracji
if (localStorage.getItem('ocenaplus_debug')) {
    console.log('SSO Request:', ssoData);
    console.log('SSO Response:', response);
}
```

## Monitoring i metryki

### Zalecane metryki do śledzenia:

1. **Liczba wywołań SSO** (dziennie/miesięcznie)
2. **Czas odpowiedzi API** (średni/percentyle)
3. **Błędy HTTP** (4xx/5xx)
4. **Aktywni użytkownicy** przekierowani z WebInfo
5. **Synchronizacje danych** (częstotliwość/powodzenie)

### Przykład implementacji logowania metryk:

```csharp
// W WebInfoController
[HttpPost("SSO")]
public async Task<IActionResult> SingleSignOn([FromBody] WebInfoSsoDto ssoDto)
{
    var stopwatch = Stopwatch.StartNew();
    try 
    {
        var result = await ProcessSSO(ssoDto);
        
        // Metryka sukcesu
        _metrics.IncrementCounter("webinfo_sso_success");
        _metrics.RecordValue("webinfo_sso_duration", stopwatch.ElapsedMilliseconds);
        
        return Ok(result);
    }
    catch (Exception ex)
    {
        // Metryka błędu
        _metrics.IncrementCounter("webinfo_sso_error");
        throw;
    }
}
```

---

## Kontakt i wsparcie

W przypadku problemów z integracją:

1. Sprawdź logi aplikacji
2. Użyj demo page do testowania
3. Skonsultuj się z dokumentacją API
4. Skontaktuj się z zespołem OcenaPlus

**Wersja dokumentacji:** 1.0  
**Data ostatniej aktualizacji:** {{ current_date }}  
**Status:** Aktywna
