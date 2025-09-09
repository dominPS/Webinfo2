using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;
using OcenaPlus.API.Services;
using BCrypt.Net;
using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebInfoController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly ILogger<WebInfoController> _logger;
        private readonly IConfiguration _configuration;

        public WebInfoController(
            OcenaPlusDbContext context,
            IJwtService jwtService,
            ILogger<WebInfoController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _jwtService = jwtService;
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Redirect to Swagger documentation
        /// </summary>
        [Route("/docs")]
        [Route("/swagger")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult Index()
        {
            return new RedirectResult("~/swagger/index.html");
        }

        /// <summary>
        /// Add user from WebInfo system
        /// </summary>
        [HttpPost]
        [Route("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] WebInfoAddUserDto userDto)
        {
            try
            {
                // Validate API key
                var clientId = await GetClientIdByApiKeyAsync(HttpContext.Request.Headers["ClientApiKey"].FirstOrDefault());
                if (clientId == null)
                    return Unauthorized("Invalid API key");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Check if user already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == userDto.Email.ToLower() || u.EmployeeId == userDto.EmployeeId);
                
                if (existingUser != null)
                    return Conflict($"User with email '{userDto.Email}' or employee ID '{userDto.EmployeeId}' already exists");

                // Find or create department
                var department = await _context.Departments
                    .FirstOrDefaultAsync(d => d.Name.ToLower() == userDto.DepartmentName.ToLower() && !d.IsDeleted);
                
                if (department == null)
                {
                    department = new Department
                    {
                        Name = userDto.DepartmentName,
                        Description = $"Department {userDto.DepartmentName}",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Departments.Add(department);
                    await _context.SaveChangesAsync();
                }

                // Find or create position
                var position = await _context.Positions
                    .FirstOrDefaultAsync(p => p.Name.ToLower() == userDto.PositionName.ToLower() && !p.IsDeleted);
                
                if (position == null)
                {
                    position = new Position
                    {
                        Name = userDto.PositionName,
                        Description = $"Position {userDto.PositionName}",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Positions.Add(position);
                    await _context.SaveChangesAsync();
                }

                // Find manager if specified
                User? manager = null;
                if (!string.IsNullOrWhiteSpace(userDto.ManagerEmail))
                {
                    manager = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email.ToLower() == userDto.ManagerEmail.ToLower() && u.IsActive && !u.IsDeleted);
                }

                // Create user
                var user = new User
                {
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    Email = userDto.Email,
                    EmployeeId = userDto.EmployeeId,
                    DepartmentId = department.Id,
                    PositionId = position.Id,
                    ManagerId = manager?.Id,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.DefaultPassword ?? "OcenaPlus2024!"),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Assign roles
                if (userDto.RoleNames.Any())
                {
                    var roles = await _context.Roles
                        .Where(r => userDto.RoleNames.Contains(r.Name))
                        .ToListAsync();

                    var userRoles = roles.Select(role => new UserRole
                    {
                        UserId = user.Id,
                        RoleId = role.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }).ToList();

                    _context.UserRoles.AddRange(userRoles);
                    await _context.SaveChangesAsync();
                }

                _logger.LogInformation($"User {user.Email} added successfully from WebInfo (Client: {clientId})");

                return Ok(new { 
                    message = "User added successfully", 
                    userId = user.Id,
                    email = user.Email 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding user from WebInfo: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update user from WebInfo system
        /// </summary>
        [HttpPut]
        [Route("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] WebInfoUpdateUserDto userDto)
        {
            try
            {
                // Validate API key and client ID
                if (userDto.ClientId == null)
                    return BadRequest("Client ID is required");
                    
                await ValidateClientApiKeyAsync(HttpContext.Request.Headers["ClientApiKey"].FirstOrDefault(), userDto.ClientId.Value);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Find user by email
                var user = await _context.Users
                    .Include(u => u.UserRoles)
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == userDto.Email.ToLower() && !u.IsDeleted);

                if (user == null)
                    return NotFound($"User with email '{userDto.Email}' not found");

                // Find or create department
                var department = await _context.Departments
                    .FirstOrDefaultAsync(d => d.Name.ToLower() == userDto.DepartmentName.ToLower() && !d.IsDeleted);
                
                if (department == null)
                {
                    department = new Department
                    {
                        Name = userDto.DepartmentName,
                        Description = $"Department {userDto.DepartmentName}",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Departments.Add(department);
                    await _context.SaveChangesAsync();
                }

                // Find or create position
                var position = await _context.Positions
                    .FirstOrDefaultAsync(p => p.Name.ToLower() == userDto.PositionName.ToLower() && !p.IsDeleted);
                
                if (position == null)
                {
                    position = new Position
                    {
                        Name = userDto.PositionName,
                        Description = $"Position {userDto.PositionName}",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Positions.Add(position);
                    await _context.SaveChangesAsync();
                }

                // Find manager if specified
                User? manager = null;
                if (!string.IsNullOrWhiteSpace(userDto.ManagerEmail))
                {
                    manager = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email.ToLower() == userDto.ManagerEmail.ToLower() && u.IsActive && !u.IsDeleted);
                }

                // Update user
                user.FirstName = userDto.FirstName;
                user.LastName = userDto.LastName;
                user.DepartmentId = department.Id;
                user.PositionId = position.Id;
                user.ManagerId = manager?.Id;
                user.IsActive = userDto.IsActive;
                user.UpdatedAt = DateTime.UtcNow;

                // Update roles if specified
                if (userDto.RoleNames.Any())
                {
                    // Remove existing roles
                    _context.UserRoles.RemoveRange(user.UserRoles);

                    // Add new roles
                    var roles = await _context.Roles
                        .Where(r => userDto.RoleNames.Contains(r.Name))
                        .ToListAsync();

                    var userRoles = roles.Select(role => new UserRole
                    {
                        UserId = user.Id,
                        RoleId = role.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }).ToList();

                    _context.UserRoles.AddRange(userRoles);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"User {user.Email} updated successfully from WebInfo (Client: {userDto.ClientId})");

                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user from WebInfo: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get users for specific client
        /// </summary>
        [HttpGet]
        [Route("GetClientUsers")]
        public async Task<IActionResult> GetClientUsers([FromQuery] int clientId)
        {
            try
            {
                await ValidateClientApiKeyAsync(HttpContext.Request.Headers["ClientApiKey"].FirstOrDefault(), clientId);

                var users = await _context.Users
                    .Include(u => u.Department)
                    .Include(u => u.Position)
                    .Include(u => u.UserRoles)
                        .ThenInclude(ur => ur.Role)
                    .Where(u => !u.IsDeleted)
                    .OrderBy(u => u.LastName)
                    .ThenBy(u => u.FirstName)
                    .ToListAsync();

                var userDtos = users.Select(u => new WebInfoUserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    EmployeeId = u.EmployeeId,
                    Department = u.Department.Name,
                    Position = u.Position.Name,
                    IsActive = u.IsActive,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
                }).ToList();

                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting client users: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get user roles by email
        /// </summary>
        [HttpGet]
        [Route("GetUserRoles")]
        public async Task<IActionResult> GetUserRoles([FromQuery] string email, [FromQuery] int clientId)
        {
            try
            {
                await ValidateClientApiKeyAsync(HttpContext.Request.Headers["ClientApiKey"].FirstOrDefault(), clientId);

                if (string.IsNullOrWhiteSpace(email))
                    return BadRequest("Email is required");

                var user = await _context.Users
                    .Include(u => u.Department)
                    .Include(u => u.Position)
                    .Include(u => u.Manager)
                    .Include(u => u.UserRoles)
                        .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower() && !u.IsDeleted);

                if (user == null)
                    return NotFound($"User with email '{email}' not found");

                var userDto = new WebInfoUserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    EmployeeId = user.EmployeeId,
                    Department = user.Department.Name,
                    Position = user.Position.Name,
                    IsActive = user.IsActive,
                    Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting user roles: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Single Sign-On from WebInfo - automatically login user and redirect
        /// </summary>
        [HttpPost]
        [Route("SSO")]
        public async Task<IActionResult> SingleSignOn([FromBody] WebInfoSsoDto ssoDto)
        {
            try
            {
                await ValidateClientApiKeyAsync(HttpContext.Request.Headers["ClientApiKey"].FirstOrDefault(), ssoDto.ClientId);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Find user
                var user = await _context.Users
                    .Include(u => u.Department)
                    .Include(u => u.Position)
                    .Include(u => u.UserRoles)
                        .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == ssoDto.Email.ToLower() && u.IsActive && !u.IsDeleted);

                if (user == null)
                    return NotFound($"Active user with email '{ssoDto.Email}' not found");

                // Update user data if provided
                if (ssoDto.UserData != null)
                {
                    bool userUpdated = false;

                    if (!string.IsNullOrWhiteSpace(ssoDto.UserData.FirstName) && user.FirstName != ssoDto.UserData.FirstName)
                    {
                        user.FirstName = ssoDto.UserData.FirstName;
                        userUpdated = true;
                    }

                    if (!string.IsNullOrWhiteSpace(ssoDto.UserData.LastName) && user.LastName != ssoDto.UserData.LastName)
                    {
                        user.LastName = ssoDto.UserData.LastName;
                        userUpdated = true;
                    }

                    if (userUpdated)
                    {
                        user.UpdatedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                    }
                }

                // Generate JWT token
                var userRoles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
                var token = _jwtService.GenerateToken(user, userRoles);

                // Prepare response
                var response = new WebInfoSsoResponse
                {
                    Token = token,
                    RedirectUrl = ssoDto.RedirectUrl ?? "/dashboard",
                    User = new WebInfoUserDto
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        EmployeeId = user.EmployeeId,
                        Department = user.Department.Name,
                        Position = user.Position.Name,
                        IsActive = user.IsActive,
                        Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
                    }
                };

                _logger.LogInformation($"SSO successful for user {user.Email} from WebInfo (Client: {ssoDto.ClientId})");

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in SSO: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #region Private Methods

        /// <summary>
        /// Get Client ID by API Key from database
        /// </summary>
        private async Task<int?> GetClientIdByApiKeyAsync(string? apiKey)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                return null;

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.ApiKey == apiKey && c.IsActive && !c.IsDeleted);

            return client?.Id;
        }

        /// <summary>
        /// Validate Client API Key
        /// </summary>
        private async Task ValidateClientApiKeyAsync(string? apiKey, int clientId)
        {
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == clientId && c.IsActive && !c.IsDeleted);
            
            if (client == null || client.ApiKey != apiKey)
            {
                throw new UnauthorizedAccessException("Invalid API key or client ID");
            }
        }

        #endregion
    }
}
