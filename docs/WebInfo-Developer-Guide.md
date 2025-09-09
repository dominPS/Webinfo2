# WebInfo Developer Guide - Implementacja integracji z OcenaPlus

## Quick Start

### 1. Minimalna implementacja (5 minut)

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebInfo - Quick Integration</title>
</head>
<body>
    <button onclick="goToEvaluations()">🎯 Przejdź do ocen</button>

    <script>
        async function goToEvaluations() {
            try {
                const response = await fetch('https://api.ocenaplus.com/api/WebInfo/SSO', {
                    method: 'POST',
                    headers: {
                        'ClientApiKey': 'your-api-key-here',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'jan.kowalski@firma.pl', // Pobierz z sesji użytkownika
                        clientId: 'your-client-id-here',
                        redirectUrl: '/evaluations'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    window.open(`https://ocenaplus.com${data.redirectUrl}?token=${data.token}`, '_blank');
                } else {
                    alert('Błąd podczas przekierowywania');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Wystąpił błąd');
            }
        }
    </script>
</body>
</html>
```

### 2. Konfiguracja

Skontaktuj się z zespołem OcenaPlus aby otrzymać:
- **API Key** - unikalny klucz dostępu
- **Client ID** - identyfikator twojej organizacji  
- **API URL** - adres endpoint'ów

## Pełna implementacja

### 1. Klasa integracji JavaScript

```javascript
/**
 * OcenaPlus Integration Library
 * @version 1.0.0
 */
class OcenaPlusIntegration {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.apiBaseUrl;
        this.frontendUrl = config.frontendUrl;
        this.clientId = config.clientId;
        this.debug = config.debug || false;
        
        // Walidacja konfiguracji
        this.validateConfig();
    }

    validateConfig() {
        const required = ['apiKey', 'baseUrl', 'frontendUrl', 'clientId'];
        const missing = required.filter(key => !this[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required config: ${missing.join(', ')}`);
        }
    }

    /**
     * Przekierowanie użytkownika do systemu ocen
     * @param {string} userEmail - Email użytkownika
     * @param {Object} userData - Dodatkowe dane użytkownika (opcjonalne)
     * @param {string} redirectPath - Ścieżka przekierowania (domyślnie '/evaluations')
     * @returns {Promise<Object>} SSO Response
     */
    async redirectToEvaluations(userEmail, userData = null, redirectPath = '/evaluations') {
        try {
            this.log('Starting SSO for user:', userEmail);

            const ssoData = {
                email: userEmail,
                clientId: this.clientId,
                redirectUrl: redirectPath,
                userData: userData
            };

            const response = await this.makeRequest('/SSO', 'POST', ssoData);
            
            // Zapisz token do localStorage (opcjonalne)
            if (response.token) {
                localStorage.setItem('ocenaplus_token', response.token);
                localStorage.setItem('ocenaplus_user', JSON.stringify(response.user));
            }
            
            // Otwórz nową kartę
            const fullUrl = `${this.frontendUrl}${response.redirectUrl}?token=${response.token}`;
            const newWindow = window.open(fullUrl, '_blank');
            
            if (!newWindow) {
                throw new Error('Popup został zablokowany przez przeglądarkę');
            }
            
            this.log('SSO successful, user redirected');
            return response;
            
        } catch (error) {
            this.log('SSO failed:', error);
            throw new Error(`Nie można przekierować do systemu ocen: ${error.message}`);
        }
    }

    /**
     * Synchronizacja danych użytkownika
     */
    async syncUser(userData) {
        try {
            this.log('Syncing user data:', userData.email);
            
            const response = await this.makeRequest('/UpdateUser', 'PUT', {
                ...userData,
                clientId: this.clientId
            });
            
            this.log('User sync successful');
            return response;
            
        } catch (error) {
            this.log('User sync failed:', error);
            throw error;
        }
    }

    /**
     * Dodanie nowego użytkownika
     */
    async addUser(userData) {
        try {
            this.log('Adding new user:', userData.email);
            
            const response = await this.makeRequest('/AddUser', 'POST', userData);
            
            this.log('User added successfully');
            return response;
            
        } catch (error) {
            this.log('Add user failed:', error);
            throw error;
        }
    }

    /**
     * Pobranie ról użytkownika
     */
    async getUserRoles(userEmail) {
        try {
            const response = await this.makeRequest(
                `/GetUserRoles?email=${encodeURIComponent(userEmail)}&clientId=${this.clientId}`
            );
            
            return response;
        } catch (error) {
            this.log('Get user roles failed:', error);
            throw error;
        }
    }

    /**
     * Sprawdzenie stanu połączenia z API
     */
    async checkConnection() {
        try {
            const response = await this.makeRequest(`/GetClientUsers?clientId=${this.clientId}`);
            return {
                status: 'connected',
                usersCount: response.length
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message
            };
        }
    }

    /**
     * Uniwersalna metoda do wykonywania requestów
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        
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

        this.log(`Making ${method} request to:`, url);

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorText;
            } catch {
                errorMessage = errorText;
            }
            
            throw new Error(`HTTP ${response.status}: ${errorMessage}`);
        }

        const result = await response.json();
        this.log('Request successful:', result);
        
        return result;
    }

    /**
     * Logowanie (jeśli włączone)
     */
    log(...args) {
        if (this.debug) {
            console.log('[OcenaPlusIntegration]', ...args);
        }
    }

    /**
     * Pobranie wersji biblioteki
     */
    static getVersion() {
        return '1.0.0';
    }
}

// Export dla użytkowników ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OcenaPlusIntegration;
}
```

### 2. Przykłady implementacji w różnych frameworkach

#### React.js

```jsx
import React, { useState, useEffect } from 'react';

const OcenyButton = ({ currentUser }) => {
    const [integration, setIntegration] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ocenaPlus = new OcenaPlusIntegration({
            apiKey: process.env.REACT_APP_OCENAPLUS_API_KEY,
            apiBaseUrl: process.env.REACT_APP_OCENAPLUS_API_URL,
            frontendUrl: process.env.REACT_APP_OCENAPLUS_FRONTEND_URL,
            clientId: process.env.REACT_APP_OCENAPLUS_CLIENT_ID,
            debug: process.env.NODE_ENV === 'development'
        });
        
        setIntegration(ocenaPlus);
    }, []);

    const handleRedirectToEvaluations = async () => {
        if (!integration || !currentUser) return;
        
        setLoading(true);
        
        try {
            await integration.redirectToEvaluations(currentUser.email, {
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                departmentName: currentUser.department?.name,
                positionName: currentUser.position?.name,
                roleNames: currentUser.roles?.map(r => r.name) || ['Employee']
            });
        } catch (error) {
            alert(`Błąd: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleRedirectToEvaluations}
            disabled={loading || !currentUser}
            className="btn btn-primary"
        >
            {loading ? 'Przekierowywanie...' : '🎯 Przejdź do ocen'}
        </button>
    );
};

export default OcenyButton;
```

#### Vue.js

```vue
<template>
  <button 
    @click="redirectToEvaluations" 
    :disabled="loading"
    class="btn btn-primary"
  >
    {{ loading ? 'Przekierowywanie...' : '🎯 Przejdź do ocen' }}
  </button>
</template>

<script>
export default {
  name: 'OcenyButton',
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      integration: null
    };
  },
  created() {
    this.integration = new OcenaPlusIntegration({
      apiKey: process.env.VUE_APP_OCENAPLUS_API_KEY,
      apiBaseUrl: process.env.VUE_APP_OCENAPLUS_API_URL,
      frontendUrl: process.env.VUE_APP_OCENAPLUS_FRONTEND_URL,
      clientId: process.env.VUE_APP_OCENAPLUS_CLIENT_ID,
      debug: process.env.NODE_ENV === 'development'
    });
  },
  methods: {
    async redirectToEvaluations() {
      this.loading = true;
      
      try {
        await this.integration.redirectToEvaluations(this.currentUser.email, {
          firstName: this.currentUser.firstName,
          lastName: this.currentUser.lastName,
          departmentName: this.currentUser.department?.name,
          positionName: this.currentUser.position?.name,
          roleNames: this.currentUser.roles?.map(r => r.name) || ['Employee']
        });
      } catch (error) {
        this.$toast.error(`Błąd: ${error.message}`);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

#### Angular

```typescript
// ocenaplus.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

declare global {
  interface Window {
    OcenaPlusIntegration: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OcenaPlusService {
  private integration: any;

  constructor() {
    this.integration = new window.OcenaPlusIntegration({
      apiKey: environment.ocenaPlusApiKey,
      apiBaseUrl: environment.ocenaPlusApiUrl,
      frontendUrl: environment.ocenaPlusFrontendUrl,
      clientId: environment.ocenaPlusClientId,
      debug: !environment.production
    });
  }

  async redirectToEvaluations(user: any): Promise<void> {
    try {
      await this.integration.redirectToEvaluations(user.email, {
        firstName: user.firstName,
        lastName: user.lastName,
        departmentName: user.department?.name,
        positionName: user.position?.name,
        roleNames: user.roles?.map((r: any) => r.name) || ['Employee']
      });
    } catch (error) {
      throw new Error(`Błąd przekierowania: ${error.message}`);
    }
  }
}

// oceny-button.component.ts
import { Component, Input } from '@angular/core';
import { OcenaPlusService } from '../services/ocenaplus.service';

@Component({
  selector: 'app-oceny-button',
  template: `
    <button 
      (click)="redirectToEvaluations()" 
      [disabled]="loading"
      class="btn btn-primary"
    >
      {{ loading ? 'Przekierowywanie...' : '🎯 Przejdź do ocen' }}
    </button>
  `
})
export class OcenyButtonComponent {
  @Input() currentUser: any;
  loading = false;

  constructor(private ocenaPlusService: OcenaPlusService) {}

  async redirectToEvaluations(): Promise<void> {
    this.loading = true;
    
    try {
      await this.ocenaPlusService.redirectToEvaluations(this.currentUser);
    } catch (error) {
      alert(`Błąd: ${error.message}`);
    } finally {
      this.loading = false;
    }
  }
}
```

### 3. Backend implementacja (PHP przykład)

```php
<?php
class OcenaPlusIntegration {
    private $apiKey;
    private $baseUrl;
    private $clientId;

    public function __construct($config) {
        $this->apiKey = $config['apiKey'];
        $this->baseUrl = $config['baseUrl'];
        $this->clientId = $config['clientId'];
    }

    public function redirectUser($userEmail, $userData = null) {
        $ssoData = [
            'email' => $userEmail,
            'clientId' => $this->clientId,
            'redirectUrl' => '/evaluations',
            'userData' => $userData
        ];

        $response = $this->makeRequest('/SSO', 'POST', $ssoData);
        
        if ($response && isset($response['token'])) {
            return [
                'success' => true,
                'redirectUrl' => 'https://ocenaplus.com/evaluations?token=' . $response['token'],
                'user' => $response['user']
            ];
        }

        return ['success' => false, 'error' => 'SSO failed'];
    }

    public function syncUser($userData) {
        $userData['clientId'] = $this->clientId;
        return $this->makeRequest('/UpdateUser', 'PUT', $userData);
    }

    private function makeRequest($endpoint, $method = 'GET', $data = null) {
        $url = $this->baseUrl . $endpoint;
        
        $headers = [
            'ClientApiKey: ' . $this->apiKey,
            'Content-Type: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            return json_decode($response, true);
        }

        throw new Exception("API request failed: HTTP $httpCode - $response");
    }
}

// Użycie:
$ocenaPlus = new OcenaPlusIntegration([
    'apiKey' => $_ENV['OCENAPLUS_API_KEY'],
    'baseUrl' => $_ENV['OCENAPLUS_API_URL'],
    'clientId' => $_ENV['OCENAPLUS_CLIENT_ID']
]);

// Endpoint w WebInfo
if ($_POST['action'] === 'redirect_to_evaluations') {
    $userEmail = $_SESSION['user']['email'];
    $userData = [
        'firstName' => $_SESSION['user']['first_name'],
        'lastName' => $_SESSION['user']['last_name'],
        'departmentName' => $_SESSION['user']['department'],
        'positionName' => $_SESSION['user']['position']
    ];

    try {
        $result = $ocenaPlus->redirectUser($userEmail, $userData);
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>
```

### 4. Konfiguracja środowiskowa

#### .env (Node.js/React)
```env
# OcenaPlus Integration
REACT_APP_OCENAPLUS_API_KEY=webinfo-production-key
REACT_APP_OCENAPLUS_API_URL=https://api.ocenaplus.com/api/WebInfo
REACT_APP_OCENAPLUS_FRONTEND_URL=https://ocenaplus.com
REACT_APP_OCENAPLUS_CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

#### config.php (PHP)
```php
<?php
return [
    'ocenaplus' => [
        'api_key' => env('OCENAPLUS_API_KEY', 'webinfo-production-key'),
        'api_url' => env('OCENAPLUS_API_URL', 'https://api.ocenaplus.com/api/WebInfo'),
        'frontend_url' => env('OCENAPLUS_FRONTEND_URL', 'https://ocenaplus.com'),
        'client_id' => env('OCENAPLUS_CLIENT_ID', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
    ]
];
?>
```

### 5. Obsługa błędów

```javascript
class ErrorHandler {
    static handle(error, context = '') {
        console.error(`[OcenaPlus Error] ${context}:`, error);
        
        // Mapowanie błędów na przyjazne komunikaty
        const userFriendlyMessages = {
            'Invalid API key': 'Problem z autoryzacją. Skontaktuj się z administratorem.',
            'User not found': 'Nie znaleziono użytkownika w systemie ocen.',
            'Network error': 'Problem z połączeniem internetowym.',
            'Popup został zablokowany': 'Odblokuj wyskakujące okna dla tej strony.'
        };
        
        let message = error.message;
        for (const [key, value] of Object.entries(userFriendlyMessages)) {
            if (message.includes(key)) {
                message = value;
                break;
            }
        }
        
        return {
            originalError: error,
            userMessage: message,
            shouldRetry: this.isRetryableError(error)
        };
    }
    
    static isRetryableError(error) {
        const retryableErrors = [
            'Network error',
            'timeout',
            'Internal server error'
        ];
        
        return retryableErrors.some(err => 
            error.message.toLowerCase().includes(err.toLowerCase())
        );
    }
}

// Użycie w kodzie
try {
    await integration.redirectToEvaluations(userEmail);
} catch (error) {
    const handled = ErrorHandler.handle(error, 'SSO Redirect');
    
    // Pokaż użytkownikowi przyjazny komunikat
    alert(handled.userMessage);
    
    // Opcjonalnie: zaproponuj ponowną próbę
    if (handled.shouldRetry) {
        if (confirm('Czy chcesz spróbować ponownie?')) {
            // Retry logic
        }
    }
}
```

### 6. Monitoring i analytics

```javascript
class OcenaPlusAnalytics {
    constructor(integration) {
        this.integration = integration;
        this.events = [];
    }

    trackEvent(eventName, data = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            event: eventName,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.events.push(event);
        
        // Wyślij do swojego systemu analytics
        this.sendToAnalytics(event);
    }

    trackSSO(userEmail, success, duration, error = null) {
        this.trackEvent('sso_attempt', {
            userEmail: userEmail,
            success: success,
            duration: duration,
            error: error?.message
        });
    }

    trackUserSync(userEmail, success, error = null) {
        this.trackEvent('user_sync', {
            userEmail: userEmail,
            success: success,
            error: error?.message
        });
    }

    sendToAnalytics(event) {
        // Integracja z Google Analytics, Mixpanel, itp.
        if (typeof gtag !== 'undefined') {
            gtag('event', event.event, {
                custom_parameter: JSON.stringify(event.data)
            });
        }
        
        // Lub własny endpoint
        fetch('/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        }).catch(console.error);
    }

    getMetrics() {
        const now = Date.now();
        const last24h = this.events.filter(e => 
            now - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000
        );
        
        return {
            totalEvents: this.events.length,
            last24h: last24h.length,
            successRate: this.calculateSuccessRate(),
            commonErrors: this.getCommonErrors()
        };
    }
}

// Użycie
const analytics = new OcenaPlusAnalytics(integration);

// Rozszerzenie integration z trackingiem
const originalRedirect = integration.redirectToEvaluations;
integration.redirectToEvaluations = async function(userEmail, userData) {
    const startTime = Date.now();
    
    try {
        const result = await originalRedirect.call(this, userEmail, userData);
        analytics.trackSSO(userEmail, true, Date.now() - startTime);
        return result;
    } catch (error) {
        analytics.trackSSO(userEmail, false, Date.now() - startTime, error);
        throw error;
    }
};
```

### 7. Checklist implementacji

#### Przed implementacją
- [ ] Otrzymałeś API Key od zespołu OcenaPlus
- [ ] Otrzymałeś Client ID dla swojej organizacji
- [ ] Znasz URL-e API (dev/prod)
- [ ] Masz dostęp do danych użytkowników w WebInfo

#### Implementacja
- [ ] Zaimplementowana klasa OcenaPlusIntegration
- [ ] Dodany przycisk "Przejdź do ocen" w interfejsie
- [ ] Skonfigurowane zmienne środowiskowe
- [ ] Obsługa błędów i komunikatów użytkownika
- [ ] Testowanie na środowisku deweloperskim

#### Przed produkcją
- [ ] Testy z prawdziwymi danymi użytkowników
- [ ] Sprawdzenie poprawności przekierowań
- [ ] Konfiguracja HTTPS
- [ ] Monitoring i logowanie błędów
- [ ] Dokumentacja dla zespołu
- [ ] Plan wdrożenia i rollback'u

#### Po wdrożeniu
- [ ] Monitoring metryk i błędów
- [ ] Feedback od użytkowników
- [ ] Optymalizacja performance
- [ ] Regularne testy połączenia
- [ ] Aktualizacja dokumentacji

## FAQ dla developerów

**Q: Czy mogę testować API bez prawdziwych użytkowników?**
A: Tak, możesz utworzyć testowych użytkowników przez endpoint AddUser lub skorzystać z demo page.

**Q: Co się stanie jeśli użytkownik nie istnieje w OcenaPlus?**
A: API zwróci błąd 404. Możesz najpierw dodać użytkownika przez AddUser endpoint.

**Q: Czy token JWT ma czas wygaśnięcia?**
A: Tak, domyślnie 60 minut. Po tym czasie użytkownik musi się zalogować ponownie.

**Q: Czy mogę dostosować ścieżkę przekierowania?**
A: Tak, użyj parametru `redirectUrl` w SSO request.

**Q: Jak obsłużyć użytkowników którzy mają zablokowane popup'y?**
A: Sprawdź czy `window.open()` zwraca `null` i poinformuj użytkownika.

**Q: Czy mogę używać API z aplikacji mobilnej?**
A: Tak, ale pamiętaj o konfiguracji CORS po stronie OcenaPlus API.

---

**Wsparcie techniczne:** developers@ocenaplus.com  
**Dokumentacja API:** https://api.ocenaplus.com/swagger  
**Status systemu:** https://status.ocenaplus.com
