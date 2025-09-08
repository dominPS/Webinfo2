using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public DepartmentsController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all departments
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetDepartments()
        {
            var departments = await _context.Departments
                .Include(d => d.Users)
                .Where(d => !d.IsDeleted)
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    EmployeeCount = d.Users.Count(u => u.IsActive && !u.IsDeleted)
                })
                .ToListAsync();

            return Ok(departments);
        }

        /// <summary>
        /// Get department by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
        {
            var department = await _context.Departments
                .Include(d => d.Users)
                .Where(d => d.Id == id && !d.IsDeleted)
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    EmployeeCount = d.Users.Count(u => u.IsActive && !u.IsDeleted)
                })
                .FirstOrDefaultAsync();

            if (department == null)
            {
                return NotFound($"Department with ID {id} not found");
            }

            return Ok(department);
        }

        /// <summary>
        /// Create new department
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<DepartmentDto>> CreateDepartment(CreateDepartmentDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if department with same name already exists
            var existingDepartment = await _context.Departments
                .AnyAsync(d => d.Name.ToLower() == createDto.Name.ToLower() && !d.IsDeleted);

            if (existingDepartment)
            {
                return Conflict($"Department with name '{createDto.Name}' already exists");
            }

            var department = new Department
            {
                Name = createDto.Name,
                Description = createDto.Description
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            var departmentDto = new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Description = department.Description,
                EmployeeCount = 0
            };

            return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, departmentDto);
        }

        /// <summary>
        /// Update existing department
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<DepartmentDto>> UpdateDepartment(int id, UpdateDepartmentDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

            if (department == null)
            {
                return NotFound($"Department with ID {id} not found");
            }

            // Check if another department with same name exists
            var nameExists = await _context.Departments
                .AnyAsync(d => d.Id != id && d.Name.ToLower() == updateDto.Name.ToLower() && !d.IsDeleted);

            if (nameExists)
            {
                return Conflict($"Another department with name '{updateDto.Name}' already exists");
            }

            department.Name = updateDto.Name;
            department.Description = updateDto.Description;

            await _context.SaveChangesAsync();

            var employeeCount = await _context.Users
                .CountAsync(u => u.DepartmentId == id && u.IsActive && !u.IsDeleted);

            var departmentDto = new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Description = department.Description,
                EmployeeCount = employeeCount
            };

            return Ok(departmentDto);
        }

        /// <summary>
        /// Delete department (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments
                .Include(d => d.Users)
                .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

            if (department == null)
            {
                return NotFound($"Department with ID {id} not found");
            }

            // Check if department has active users
            var hasActiveUsers = department.Users.Any(u => u.IsActive && !u.IsDeleted);
            if (hasActiveUsers)
            {
                return BadRequest("Cannot delete department that has active employees. Please reassign or deactivate employees first.");
            }

            department.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Get employees in department
        /// </summary>
        [HttpGet("{id}/employees")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetDepartmentEmployees(int id)
        {
            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

            if (department == null)
            {
                return NotFound($"Department with ID {id} not found");
            }

            var employees = await _context.Users
                .Include(u => u.Position)
                .Include(u => u.Manager)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .Where(u => u.DepartmentId == id && !u.IsDeleted)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,

                    Email = u.Email,
                    EmployeeId = u.EmployeeId,
                    Department = department.Name,
                    Position = u.Position.Name,
                    Manager = u.Manager != null ? u.Manager.FullName : null,
                    IsActive = u.IsActive,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(employees);
        }
    }
}
