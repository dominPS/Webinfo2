# WebInfo API Integration - OcenaPlus

## 🔗 Informacje o API

### Base URL (Aktualny)
- **Serwer**: `http://172.17.80.104:5140`
- **API Endpoint**: `http://172.17.80.104:5140/api`
- **Dokumentacja Swagger**: `http://172.17.80.104:5140/swagger`

### Dane dostępowe dla WebInfo

**🔑 Główny klucz API**: `webinfo-api-key-12345`  
**🆔 Client ID**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**🧪 Testowy klucz API**: `webinfo-test-key`  
**🆔 Test Client ID**: `b2c3d4e5-f6g7-8901-bcde-f23456789012`

### Nagłówki autoryzacji
```http
ClientApiKey: webinfo-api-key-12345
Content-Type: application/json
Accept: application/json
```

## Dostępne endpointy

### 1. Dodawanie użytkownika
**POST** `/api/WebInfo/AddUser`

```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan.kowalski@firma.pl",
  "employeeId": "EMP001",
  "departmentName": "IT",
  "positionName": "Software Developer",
  "managerEmail": "anna.manager@firma.pl",
  "defaultPassword": "TempPassword123!",
  "roleNames": ["Employee", "Developer"]
}
```

**Odpowiedź:**
```json
{
  "message": "User added successfully",
  "userId": 15,
  "email": "jan.kowalski@firma.pl"
}
```

### 2. Aktualizacja użytkownika
**PUT** `/api/WebInfo/UpdateUser`

```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan.kowalski@firma.pl",
  "departmentName": "IT",
  "positionName": "Senior Developer",
  "managerEmail": "anna.manager@firma.pl",
  "isActive": true,
  "clientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "roleNames": ["Employee", "Senior Developer"]
}
```

### 3. Pobieranie użytkowników klienta
**GET** `/api/WebInfo/GetClientUsers?clientId=a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Odpowiedź:**
```json
[
  {
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
]
```

### 4. Pobieranie ról użytkownika
**GET** `/api/WebInfo/GetUserRoles?email=jan.kowalski@firma.pl&clientId=a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Odpowiedź:**
```json
{
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
```

### 5. Single Sign-On (SSO)
**POST** `/api/WebInfo/SSO`

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

**Odpowiedź:**
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

## Implementacja po stronie WebInfo

### JavaScript/TypeScript przykład:

```typescript
class OcenaPlusIntegration {
  private apiKey = 'webinfo-api-key-12345';
  private baseUrl = 'http://172.17.80.104:5140/api/WebInfo';
  private clientId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  async redirectToEvaluations(userEmail: string) {
    try {
      const response = await fetch(`${this.baseUrl}/SSO`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ClientApiKey': this.apiKey
        },
        body: JSON.stringify({
          email: userEmail,
          clientId: this.clientId,
          redirectUrl: '/evaluations'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Zapisz token do localStorage/sessionStorage
        localStorage.setItem('ocenaplus_token', data.token);
        
        // Przekieruj użytkownika do OcenaPlus
        window.open(
          `http://172.17.80.104:5140${data.redirectUrl}?token=${data.token}`,
          '_blank'
        );
      } else {
        throw new Error('SSO failed');
      }
    } catch (error) {
      console.error('Error during SSO:', error);
      alert('Błąd podczas przekierowywania do systemu ocen');
    }
  }

  async syncUser(userData: UserData) {
    const response = await fetch(`${this.baseUrl}/UpdateUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ClientApiKey': this.apiKey
      },
      body: JSON.stringify({
        ...userData,
        clientId: this.clientId
      })
    });

    return response.ok;
  }

  async addUser(userData: AddUserData) {
    const response = await fetch(`${this.baseUrl}/AddUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ClientApiKey': this.apiKey
      },
      body: JSON.stringify({
        ...userData,
        clientId: this.clientId,
        defaultPassword: 'WebInfo2024!',
        roleNames: ['Employee']
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`User created: ${result.email} (ID: ${result.userId})`);
      return result;
    } else {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
  }
}

// Przykład użycia:
const ocenaPlus = new OcenaPlusIntegration();

// Przycisk "Przejdź do ocen"
document.getElementById('oceny-btn').addEventListener('click', () => {
  const userEmail = getCurrentUserEmail(); // Twoja funkcja z WebInfo
  ocenaPlus.redirectToEvaluations(userEmail);
});

// Dodanie nowego użytkownika
ocenaPlus.addUser({
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan.kowalski@firma.pl',
  employeeId: 'EMP001',
  departmentName: 'IT',
  positionName: 'Developer'
});
```

## Konfiguracja API Keys

W pliku `appsettings.json`:

```json
{
  "WebInfo": {
    "ApiKeys": {
      "webinfo-api-key-12345": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "webinfo-test-key": "b2c3d4e5-f6g7-8901-bcde-f23456789012"
    }
  }
}
```

## 🧪 Testowanie API

### Przy użyciu Postman lub curl

**Test dodania użytkownika:**
```bash
curl -X POST "http://172.17.80.104:5140/api/WebInfo/AddUser" \
  -H "ClientApiKey: webinfo-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@webinfo.pl",
    "employeeId": "TEST001",
    "departmentName": "Test Department",
    "positionName": "Test Position",
    "clientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "defaultPassword": "WebInfo2024!",
    "roleNames": ["Employee"]
  }'
```

**Test SSO:**
```bash
curl -X POST "http://172.17.80.104:5140/api/WebInfo/SSO" \
  -H "ClientApiKey: webinfo-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@webinfo.pl",
    "clientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "redirectUrl": "/dashboard"
  }'
```

**Test pobierania użytkowników:**
```bash
curl -X GET "http://172.17.80.104:5140/api/WebInfo/GetClientUsers?clientId=a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "ClientApiKey: webinfo-api-key-12345"
```

### Dostęp do dokumentacji Swagger
Otwórz w przeglądarce: `http://172.17.80.104:5140/swagger`

Tam znajdziesz:
- Interaktywną dokumentację wszystkich endpointów
- Możliwość testowania bezpośrednio z przeglądarki
- Pełne definicje schematów JSON
- Przykłady żądań i odpowiedzi

## 📊 Status serwera

**Serwer**: ✅ Aktywny  
**IP**: 172.17.80.104  
**Port**: 5140  
**Baza danych**: SQL Server LocalDB - połączenie pomyślne  
**Środowisko**: Development  

**Dostępne role użytkowników:**
- Employee (podstawowa rola)
- Manager (zarządzanie zespołem)
- Admin (administracja)
- HR (kadry)
- Developer (zespół deweloperski)
- Senior Developer (starszy deweloper)

## Bezpieczeństwo

1. **API Keys** powinny być unikalne i bezpieczne
2. **HTTPS** zawsze w produkcji
3. **CORS** skonfigurowany tylko dla zaufanych domen
4. **JWT tokens** mają czas wygaśnięcia (domyślnie 60 minut)
5. **Rate limiting** zalecane w produkcji

## Błędy

- **401 Unauthorized** - nieprawidłowy API key
- **400 Bad Request** - nieprawidłowe dane wejściowe
- **404 Not Found** - użytkownik nie znaleziony
- **409 Conflict** - użytkownik już istnieje
- - **500 Internal Server Error** - błąd serwera

## 📞 Wsparcie techniczne

**Dane serwera:**
- Adres IP: `172.17.80.104`
- Port API: `5140`
- Baza danych: SQL Server LocalDB
- Środowisko: Development

**W przypadku problemów:**
1. Sprawdź dostępność serwera: `ping 172.17.80.104`
2. Sprawdź dokumentację Swagger: `http://172.17.80.104:5140/swagger`
3. Zweryfikuj poprawność kluczy API
4. Sprawdź logi błędów w konsoli przeglądarki

**Najczęstsze problemy:**
- `401 Unauthorized` - sprawdź klucz API w nagłówku
- `404 Not Found` - zweryfikuj URL endpointu
- `409 Conflict` - użytkownik już istnieje w systemie
- Timeout - sprawdź połączenie sieciowe z serwerem

---

*Dokument zaktualizowany: 9 września 2025*  
*Wersja API: v1.0*  
*Status: Aktywne - gotowe do integracji* ✅
