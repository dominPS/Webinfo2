# WebInfo API - Dokumentacja techniczna

## Spis treści

1. [Architektura API](#architektura-api)
2. [Modele danych](#modele-danych)
3. [Endpointy szczegółowo](#endpointy-szczegółowo)
4. [Kody błędów](#kody-błędów)
5. [Walidacja danych](#walidacja-danych)
6. [Logowanie i monitoring](#logowanie-i-monitoring)
7. [Testowanie](#testowanie)

## Architektura API

### Struktura projektu

```
OcenaPlus.API/
├── Controllers/
│   └── WebInfoController.cs          # Główny kontroler API
├── DTOs/
│   └── WebInfoDto.cs                 # Modele danych transferu
├── Services/
│   └── IJwtService.cs                # Generowanie JWT tokenów
└── Program.cs                        # Konfiguracja aplikacji
```

### Przepływ danych

```
WebInfo Request → API Controller → Validation → Database → JWT Service → Response
```

### Zależności

- **Entity Framework Core** - dostęp do bazy danych
- **JWT Bearer Authentication** - autoryzacja
- **BCrypt.Net** - hashowanie haseł
- **Microsoft.Extensions.Logging** - logowanie

## Modele danych

### WebInfoUserDto
```csharp
public class WebInfoUserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
}
```

### WebInfoAddUserDto
```csharp
public class WebInfoAddUserDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string EmployeeId { get; set; } = string.Empty;

    [Required]
    public string DepartmentName { get; set; } = string.Empty;

    [Required]
    public string PositionName { get; set; } = string.Empty;

    public string? ManagerEmail { get; set; }
    public Guid? ClientId { get; set; }
    public string? DefaultPassword { get; set; }
    public List<string> RoleNames { get; set; } = new List<string> { "Employee" };
}
```

### WebInfoUpdateUserDto
```csharp
public class WebInfoUpdateUserDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string DepartmentName { get; set; } = string.Empty;

    [Required]
    public string PositionName { get; set; } = string.Empty;

    public string? ManagerEmail { get; set; }
    public bool IsActive { get; set; } = true;

    [Required]
    public Guid? ClientId { get; set; }

    public List<string> RoleNames { get; set; } = new List<string>();
}
```

### WebInfoSsoDto
```csharp
public class WebInfoSsoDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public Guid ClientId { get; set; }

    public string? RedirectUrl { get; set; }
    public WebInfoUserData? UserData { get; set; }
}
```

### WebInfoSsoResponse
```csharp
public class WebInfoSsoResponse
{
    public string Token { get; set; } = string.Empty;
    public string RedirectUrl { get; set; } = string.Empty;
    public WebInfoUserDto User { get; set; } = null!;
}
```

## Endpointy szczegółowo

### 1. POST /api/WebInfo/SSO

**Cel:** Single Sign-On - autoryzacja i przekierowanie użytkownika

#### Request Headers:
```
ClientApiKey: webinfo-api-key-12345
Content-Type: application/json
```

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

#### Logika przetwarzania:
1. **Walidacja API Key** - sprawdzenie `ClientApiKey` w nagłówku
2. **Walidacja danych** - sprawdzenie poprawności email i clientId
3. **Wyszukiwanie użytkownika** - znajdowanie aktywnego użytkownika po email
4. **Aktualizacja danych** - opcjonalna aktualizacja danych z `userData`
5. **Generowanie JWT** - utworzenie tokenu z rolami użytkownika
6. **Zwrócenie odpowiedzi** - token + dane użytkownika

#### Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNSIsImVtYWlsIjoiamFuLmtvd2Fsc2tpQGZpcm1hLnBsIiwicm9sZSI6WyJFbXBsb3llZSIsIkRldmVsb3BlciJdLCJuYmYiOjE2OTQ2ODMyMDAsImV4cCI6MTY5NDY4NjgwMCwiaWF0IjoxNjk0NjgzMjAwLCJpc3MiOiJPY2VuYVBsdXMiLCJhdWQiOiJPY2VuYVBsdXNVc2VycyJ9...",
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

#### Możliwe błędy:
- `401 Unauthorized` - Invalid API key
- `400 Bad Request` - Invalid request data
- `404 Not Found` - User not found or inactive

---

### 2. POST /api/WebInfo/AddUser

**Cel:** Dodanie nowego użytkownika do systemu OcenaPlus

#### Logika przetwarzania:
1. **Walidacja API Key**
2. **Sprawdzenie duplikatów** - email i employeeId muszą być unikalne
3. **Tworzenie/znajdowanie działu** - automatyczne tworzenie jeśli nie istnieje
4. **Tworzenie/znajdowanie stanowiska** - automatyczne tworzenie jeśli nie istnieje
5. **Znajdowanie managera** - opcjonalne, po email
6. **Tworzenie użytkownika** - z hashowanym hasłem
7. **Przypisywanie ról** - dodanie UserRole records

#### Response (200 OK):
```json
{
  "message": "User added successfully",
  "userId": 15,
  "email": "jan.kowalski@firma.pl"
}
```

#### Możliwe błędy:
- `409 Conflict` - User with email/employeeId already exists

---

### 3. PUT /api/WebInfo/UpdateUser

**Cel:** Aktualizacja istniejącego użytkownika

#### Logika przetwarzania:
1. **Walidacja API Key i Client ID**
2. **Znajdowanie użytkownika** - po email
3. **Aktualizacja działu/stanowiska** - tworzenie nowych jeśli potrzeba
4. **Aktualizacja danych użytkownika**
5. **Aktualizacja ról** - usunięcie starych, dodanie nowych

#### Response (200 OK):
```json
{
  "message": "User updated successfully"
}
```

---

### 4. GET /api/WebInfo/GetClientUsers

**Cel:** Pobranie wszystkich użytkowników dla danego klienta

#### Query Parameters:
- `clientId` (required) - GUID klienta

#### Response (200 OK):
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

---

### 5. GET /api/WebInfo/GetUserRoles

**Cel:** Sprawdzenie ról konkretnego użytkownika

#### Query Parameters:
- `email` (required) - email użytkownika
- `clientId` (required) - GUID klienta

#### Response (200 OK):
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

## Kody błędów

### HTTP Status Codes

| Kod | Znaczenie | Opis |
|-----|-----------|------|
| 200 | OK | Żądanie zakończone sukcesem |
| 400 | Bad Request | Nieprawidłowe dane w żądaniu |
| 401 | Unauthorized | Nieprawidłowy API key lub brak autoryzacji |
| 404 | Not Found | Zasób nie został znaleziony |
| 409 | Conflict | Konflikt danych (np. duplicate email) |
| 500 | Internal Server Error | Błąd serwera |

### Szczegółowe komunikaty błędów

#### 401 Unauthorized
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid or has expired"
}
```

#### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "One or more validation errors occurred",
  "details": {
    "Email": ["The Email field is not a valid e-mail address."],
    "FirstName": ["The FirstName field is required."]
  }
}
```

#### 404 Not Found
```json
{
  "error": "User not found",
  "message": "Active user with email 'jan.kowalski@firma.pl' not found"
}
```

#### 409 Conflict
```json
{
  "error": "User already exists",
  "message": "User with email 'jan.kowalski@firma.pl' or employee ID 'EMP001' already exists"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred while processing your request"
}
```

## Walidacja danych

### Walidacja po stronie modelu (Data Annotations)

```csharp
public class WebInfoAddUserDto
{
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Employee ID is required")]
    [MaxLength(20, ErrorMessage = "Employee ID cannot exceed 20 characters")]
    public string EmployeeId { get; set; } = string.Empty;
}
```

### Walidacja po stronie kontrolera

```csharp
public async Task<IActionResult> AddUser([FromBody] WebInfoAddUserDto userDto)
{
    // Model validation
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // Business logic validation
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(u => u.Email.ToLower() == userDto.Email.ToLower() 
                               || u.EmployeeId == userDto.EmployeeId);
    
    if (existingUser != null)
        return Conflict($"User with email '{userDto.Email}' or employee ID '{userDto.EmployeeId}' already exists");
        
    // ... rest of the logic
}
```

### Walidacja API Key

```csharp
private Guid? GetClientIdByApiKey(string? apiKey)
{
    if (string.IsNullOrWhiteSpace(apiKey))
        return null;

    var validApiKeys = _configuration.GetSection("WebInfo:ApiKeys").Get<Dictionary<string, string>>();
    
    if (validApiKeys != null && validApiKeys.ContainsKey(apiKey))
    {
        if (Guid.TryParse(validApiKeys[apiKey], out var clientId))
        {
            return clientId;
        }
    }

    return null;
}

private void ValidateClientApiKey(string? apiKey, Guid clientId)
{
    var validClientId = GetClientIdByApiKey(apiKey);
    
    if (validClientId == null || validClientId != clientId)
    {
        throw new UnauthorizedAccessException("Invalid API key or client ID");
    }
}
```

## Logowanie i monitoring

### Poziomy logów

| Poziom | Zastosowanie | Przykład |
|--------|-------------|----------|
| Information | Normalne operacje | User login, data sync |
| Warning | Nietypowe sytuacje | User not found, empty data |
| Error | Błędy aplikacji | Database errors, validation failures |
| Critical | Krytyczne błędy | System failures, security breaches |

### Przykłady logowania

```csharp
public async Task<IActionResult> SingleSignOn([FromBody] WebInfoSsoDto ssoDto)
{
    _logger.LogInformation($"SSO request received for user: {ssoDto.Email}, client: {ssoDto.ClientId}");
    
    try
    {
        var user = await FindUserByEmail(ssoDto.Email);
        if (user == null)
        {
            _logger.LogWarning($"SSO failed - user not found: {ssoDto.Email}");
            return NotFound($"Active user with email '{ssoDto.Email}' not found");
        }

        var token = GenerateToken(user);
        
        _logger.LogInformation($"SSO successful for user: {user.Email} (ID: {user.Id})");
        
        return Ok(response);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"SSO error for user: {ssoDto.Email}");
        return StatusCode(500, "Internal server error");
    }
}
```

### Structured Logging

```csharp
_logger.LogInformation("SSO request processed successfully for {UserEmail} from client {ClientId} in {Duration}ms", 
    ssoDto.Email, 
    ssoDto.ClientId, 
    stopwatch.ElapsedMilliseconds);
```

### Konfiguracja logowania w appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "OcenaPlus.API.Controllers.WebInfoController": "Debug"
    }
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "logs/webinfo-api-.txt",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 30
        }
      }
    ]
  }
}
```

## Testowanie

### Unit Tests

```csharp
[TestFixture]
public class WebInfoControllerTests
{
    private WebInfoController _controller;
    private Mock<OcenaPlusDbContext> _mockContext;
    private Mock<IJwtService> _mockJwtService;
    private Mock<ILogger<WebInfoController>> _mockLogger;

    [SetUp]
    public void SetUp()
    {
        _mockContext = new Mock<OcenaPlusDbContext>();
        _mockJwtService = new Mock<IJwtService>();
        _mockLogger = new Mock<ILogger<WebInfoController>>();
        
        _controller = new WebInfoController(_mockContext.Object, _mockJwtService.Object, _mockLogger.Object);
    }

    [Test]
    public async Task SSO_WithValidUser_ReturnsOkWithToken()
    {
        // Arrange
        var user = new User { Id = 1, Email = "test@example.com", FirstName = "Test", LastName = "User" };
        var ssoDto = new WebInfoSsoDto { Email = "test@example.com", ClientId = Guid.NewGuid() };
        
        _mockContext.Setup(x => x.Users.FirstOrDefaultAsync(It.IsAny<Expression<Func<User, bool>>>()))
                   .ReturnsAsync(user);
        _mockJwtService.Setup(x => x.GenerateToken(It.IsAny<User>(), It.IsAny<IList<string>>()))
                      .Returns("test-token");

        // Act
        var result = await _controller.SingleSignOn(ssoDto);

        // Assert
        Assert.IsInstanceOf<OkObjectResult>(result);
        var okResult = result as OkObjectResult;
        var response = okResult.Value as WebInfoSsoResponse;
        
        Assert.AreEqual("test-token", response.Token);
        Assert.AreEqual(user.Email, response.User.Email);
    }

    [Test]
    public async Task AddUser_WithDuplicateEmail_ReturnsConflict()
    {
        // Arrange
        var existingUser = new User { Email = "test@example.com" };
        var addUserDto = new WebInfoAddUserDto { Email = "test@example.com" };
        
        _mockContext.Setup(x => x.Users.FirstOrDefaultAsync(It.IsAny<Expression<Func<User, bool>>>()))
                   .ReturnsAsync(existingUser);

        // Act
        var result = await _controller.AddUser(addUserDto);

        // Assert
        Assert.IsInstanceOf<ConflictObjectResult>(result);
    }
}
```

### Integration Tests

```csharp
[TestFixture]
public class WebInfoIntegrationTests
{
    private TestServer _server;
    private HttpClient _client;

    [SetUp]
    public void SetUp()
    {
        var builder = new WebHostBuilder()
            .UseStartup<TestStartup>()
            .ConfigureServices(services =>
            {
                services.AddDbContext<OcenaPlusDbContext>(options =>
                    options.UseInMemoryDatabase("TestDb"));
            });

        _server = new TestServer(builder);
        _client = _server.CreateClient();
        _client.DefaultRequestHeaders.Add("ClientApiKey", "test-api-key");
    }

    [Test]
    public async Task SSO_EndToEnd_ReturnsValidToken()
    {
        // Arrange
        var ssoRequest = new WebInfoSsoDto
        {
            Email = "test@example.com",
            ClientId = Guid.Parse("test-client-id")
        };

        var json = JsonConvert.SerializeObject(ssoRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/WebInfo/SSO", content);

        // Assert
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        
        var responseBody = await response.Content.ReadAsStringAsync();
        var ssoResponse = JsonConvert.DeserializeObject<WebInfoSsoResponse>(responseBody);
        
        Assert.IsNotNull(ssoResponse.Token);
        Assert.IsNotNull(ssoResponse.User);
    }
}
```

### Performance Tests

```csharp
[Test]
public async Task SSO_PerformanceTest_CompletesWithinTimeLimit()
{
    // Arrange
    var stopwatch = Stopwatch.StartNew();
    var tasks = new List<Task>();

    // Act - Simulate 100 concurrent SSO requests
    for (int i = 0; i < 100; i++)
    {
        tasks.Add(CallSSOEndpoint($"test{i}@example.com"));
    }

    await Task.WhenAll(tasks);
    stopwatch.Stop();

    // Assert - Should complete within 5 seconds
    Assert.Less(stopwatch.ElapsedMilliseconds, 5000);
}
```

### API Testing z Postman/Newman

```json
{
  "info": {
    "name": "WebInfo API Tests"
  },
  "item": [
    {
      "name": "SSO Success",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "ClientApiKey",
            "value": "{{apiKey}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/WebInfo/SSO",
          "host": ["{{baseUrl}}"],
          "path": ["api", "WebInfo", "SSO"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"clientId\": \"{{clientId}}\"\n}"
        }
      },
      "tests": [
        "pm.test('Status code is 200', function () {",
        "    pm.response.to.have.status(200);",
        "});",
        "pm.test('Response has token', function () {",
        "    const jsonData = pm.response.json();",
        "    pm.expect(jsonData).to.have.property('token');",
        "});"
      ]
    }
  ]
}
```

## Bezpieczeństwo - aspekty techniczne

### Rate Limiting

```csharp
// Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("WebInfoAPI", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10;
    });
});

// WebInfoController.cs
[EnableRateLimiting("WebInfoAPI")]
[Route("api/[controller]")]
public class WebInfoController : ControllerBase
{
    // ...
}
```

### Input Sanitization

```csharp
public static class InputSanitizer
{
    public static string SanitizeString(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // Remove potentially dangerous characters
        var sanitized = input.Trim();
        sanitized = Regex.Replace(sanitized, @"[<>""']", "");
        
        return sanitized;
    }

    public static string SanitizeEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return string.Empty;

        return email.Trim().ToLowerInvariant();
    }
}
```

### SQL Injection Prevention

Entity Framework Core automatycznie chroni przed SQL Injection przez parametryzowane zapytania:

```csharp
// Bezpieczne - EF Core parametryzuje automatycznie
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

// Niebezpieczne - nigdy nie rób tego
// var query = $"SELECT * FROM Users WHERE Email = '{email}'";
```

### JWT Security

```csharp
public string GenerateToken(User user, IList<string> roles)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);
    
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            // Dodaj role jako osobne claimy
            ...roles.Select(role => new Claim(ClaimTypes.Role, role))
        }),
        Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpireMinutes),
        Issuer = _jwtSettings.Issuer,
        Audience = _jwtSettings.Audience,
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}
```

---

**Wersja:** 1.0  
**Data:** September 2025  
**Autor:** OcenaPlus Development Team
