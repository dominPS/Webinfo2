using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;
using BCrypt.Net;
using System.Security.Claims;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public UsersController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all users (HR/Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "HR,Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
            [FromQuery] int? departmentId = null,
            [FromQuery] bool includeInactive = false,
            [FromQuery] string? search = null)
        {
            var query = _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .Include(u => u.Manager)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .Where(u => !u.IsDeleted);

            // Filter by department
            if (departmentId.HasValue)
                query = query.Where(u => u.DepartmentId == departmentId.Value);

            // Filter by active status
            if (!includeInactive)
                query = query.Where(u => u.IsActive);

            // Search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(u => 
                    u.FirstName.ToLower().Contains(searchLower) ||
                    u.LastName.ToLower().Contains(searchLower) ||
                    u.Email.ToLower().Contains(searchLower) ||
                    u.EmployeeId.ToLower().Contains(searchLower));
            }

            var users = await query
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .ToListAsync();

            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,

                Email = u.Email,
                EmployeeId = u.EmployeeId,
                Department = u.Department.Name,
                Position = u.Position.Name,
                Manager = u.Manager?.FullName,
                IsActive = u.IsActive,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
            }).ToList();

            return Ok(userDtos);
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "HR,Admin,Leader")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            // Users can access their own profile, leaders can access their team members, HR/Admin can access all
            var canAccess = currentUserId == id || 
                           currentUserRoles.Contains("HR") || 
                           currentUserRoles.Contains("Admin");

            if (!canAccess && currentUserRoles.Contains("Leader"))
            {
                // Check if requested user is in leader's team
                var isTeamMember = await _context.Users
                    .AnyAsync(u => u.Id == id && u.ManagerId == currentUserId);
                canAccess = isTeamMember;
            }

            if (!canAccess)
                return Forbid("You don't have permission to access this user");

            var user = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .Include(u => u.Manager)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound();

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
        /// Update user (HR/Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound();

            // Check if email is unique
            if (updateUserDto.Email != user.Email)
            {
                var emailExists = await _context.Users
                    .AnyAsync(u => u.Id != id && u.Email.ToLower() == updateUserDto.Email.ToLower());
                if (emailExists)
                    return Conflict("User with this email already exists");
            }

            // Check if employee ID is unique
            if (updateUserDto.EmployeeId != user.EmployeeId)
            {
                var employeeIdExists = await _context.Users
                    .AnyAsync(u => u.Id != id && u.EmployeeId == updateUserDto.EmployeeId);
                if (employeeIdExists)
                    return Conflict("Employee ID already exists");
            }

            // Validate department and position
            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == updateUserDto.DepartmentId && !d.IsDeleted);
            if (department == null)
                return BadRequest("Invalid department");

            var position = await _context.Positions
                .FirstOrDefaultAsync(p => p.Id == updateUserDto.PositionId && !p.IsDeleted);
            if (position == null)
                return BadRequest("Invalid position");

            // Validate manager if provided
            if (updateUserDto.ManagerId.HasValue)
            {
                var manager = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == updateUserDto.ManagerId.Value && u.IsActive && !u.IsDeleted);
                if (manager == null)
                    return BadRequest("Invalid manager");
                
                // Prevent circular hierarchy
                if (updateUserDto.ManagerId == id)
                    return BadRequest("User cannot be their own manager");
            }

            // Update user properties
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.Email = updateUserDto.Email;
            user.EmployeeId = updateUserDto.EmployeeId;
            user.DepartmentId = updateUserDto.DepartmentId;
            user.PositionId = updateUserDto.PositionId;
            user.ManagerId = updateUserDto.ManagerId;
            user.IsActive = updateUserDto.IsActive;

            // Update roles if provided
            if (updateUserDto.RoleIds.Any())
            {
                // Remove existing roles
                _context.UserRoles.RemoveRange(user.UserRoles);

                // Add new roles
                var validRoles = await _context.Roles
                    .Where(r => updateUserDto.RoleIds.Contains(r.Id))
                    .ToListAsync();

                var userRoles = validRoles.Select(role => new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id
                }).ToList();

                _context.UserRoles.AddRange(userRoles);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Deactivate user (HR/Admin only)
        /// </summary>
        [HttpPatch("{id}/deactivate")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> DeactivateUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound();

            user.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Activate user (HR/Admin only)
        /// </summary>
        [HttpPatch("{id}/activate")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> ActivateUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound();

            user.IsActive = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Soft delete user (HR/Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound();

            user.IsDeleted = true;
            user.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Get team members (Leaders only)
        /// </summary>
        [HttpGet("team")]
        [Authorize(Roles = "Leader")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetTeamMembers()
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var teamMembers = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .Where(u => u.ManagerId == currentUserId && u.IsActive && !u.IsDeleted)
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .ToListAsync();

            var userDtos = teamMembers.Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,

                Email = u.Email,
                EmployeeId = u.EmployeeId,
                Department = u.Department.Name,
                Position = u.Position.Name,
                Manager = null, // Don't need to show manager for team members
                IsActive = u.IsActive,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
            }).ToList();

            return Ok(userDtos);
        }

        /// <summary>
        /// Reset user password (HR/Admin only)
        /// </summary>
        [HttpPost("{id}/reset-password")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> ResetPassword(int id, ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound();

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successfully" });
        }
    }
}
