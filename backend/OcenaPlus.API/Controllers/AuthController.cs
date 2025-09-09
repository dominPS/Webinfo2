using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.API.Services;
using OcenaPlus.Domain.Entities;
using BCrypt.Net;
using System.Security.Claims;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(OcenaPlusDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        /// <summary>
        /// Login user
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find user by email
            var user = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .Include(u => u.Manager)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower() && u.IsActive && !u.IsDeleted);

            if (user == null)
                return Unauthorized("Invalid email or password");

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password");

            // Get user roles
            var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();

            // Generate JWT token
            var token = _jwtService.GenerateToken(user, roles);
            var expiresAt = DateTime.UtcNow.AddMinutes(60); // Should match JWT configuration

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,

                Email = user.Email,
                EmployeeId = user.EmployeeId,
                Department = user.Department.Name,
                Position = user.Position.Name,
                Manager = user.Manager?.FullName,
                IsActive = user.IsActive,
                Roles = roles
            };

            var response = new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = userDto
            };

            return Ok(response);
        }

        /// <summary>
        /// Register new user (HR only)
        /// </summary>
        [HttpPost("register")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if user with email exists
            var existingUser = await _context.Users
                .AnyAsync(u => u.Email.ToLower() == registerDto.Email.ToLower());
            if (existingUser)
                return Conflict("User with this email already exists");

            // Check if employee ID exists
            var existingEmployeeId = await _context.Users
                .AnyAsync(u => u.EmployeeId == registerDto.EmployeeId);
            if (existingEmployeeId)
                return Conflict("Employee ID already exists");

            // Validate department and position exist
            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == registerDto.DepartmentId && !d.IsDeleted);
            if (department == null)
                return BadRequest("Invalid department");

            var position = await _context.Positions
                .FirstOrDefaultAsync(p => p.Id == registerDto.PositionId && !p.IsDeleted);
            if (position == null)
                return BadRequest("Invalid position");

            // Validate manager if provided
            User? manager = null;
            if (registerDto.ManagerId.HasValue)
            {
                manager = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == registerDto.ManagerId.Value && u.IsActive && !u.IsDeleted);
                if (manager == null)
                    return BadRequest("Invalid manager");
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Create user
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                EmployeeId = registerDto.EmployeeId,
                PasswordHash = passwordHash,
                DepartmentId = registerDto.DepartmentId,
                PositionId = registerDto.PositionId,
                ManagerId = registerDto.ManagerId,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Assign roles
            if (registerDto.RoleIds.Any())
            {
                var validRoles = await _context.Roles
                    .Where(r => registerDto.RoleIds.Contains(r.Id))
                    .ToListAsync();

                var userRoles = validRoles.Select(role => new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id
                }).ToList();

                _context.UserRoles.AddRange(userRoles);
                await _context.SaveChangesAsync();
            }

            // Return user DTO
            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,

                Email = user.Email,
                EmployeeId = user.EmployeeId,
                Department = department.Name,
                Position = position.Name,
                Manager = manager?.FullName,
                IsActive = user.IsActive,
                Roles = registerDto.RoleIds.Any() ? 
                    (await _context.Roles.Where(r => registerDto.RoleIds.Contains(r.Id)).Select(r => r.Name).ToListAsync()) : 
                    new List<string>()
            };

            return CreatedAtAction("GetUser", "Users", new { id = user.Id }, userDto);
        }

        /// <summary>
        /// Get current user info
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var user = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .Include(u => u.Manager)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && !u.IsDeleted);

            if (user == null)
                return NotFound("User not found");

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,

                Email = user.Email,
                EmployeeId = user.EmployeeId,
                Department = user.Department.Name,
                Position = user.Position.Name,
                Manager = user.Manager?.FullName,
                IsActive = user.IsActive,
                Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
            };

            return Ok(userDto);
        }

        /// <summary>
        /// Change password
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && !u.IsDeleted);

            if (user == null)
                return NotFound("User not found");

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
                return BadRequest("Current password is incorrect");

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }

        /// <summary>
        /// Refresh token (validate current token)
        /// </summary>
        [HttpPost("refresh")]
        [Authorize]
        public async Task<ActionResult<AuthResponseDto>> RefreshToken()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var user = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .Include(u => u.Manager)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && !u.IsDeleted);

            if (user == null)
                return Unauthorized("User not found");

            var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
            var token = _jwtService.GenerateToken(user, roles);
            var expiresAt = DateTime.UtcNow.AddMinutes(60);

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,

                Email = user.Email,
                EmployeeId = user.EmployeeId,
                Department = user.Department.Name,
                Position = user.Position.Name,
                Manager = user.Manager?.FullName,
                IsActive = user.IsActive,
                Roles = roles
            };

            var response = new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = userDto
            };

            return Ok(response);
        }

        /// <summary>
        /// Logout user
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // Since we're using stateless JWT tokens, logout is handled client-side
            // by removing the token from storage. This endpoint confirms successful logout.
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
