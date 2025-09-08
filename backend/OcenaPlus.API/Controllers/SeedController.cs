using Microsoft.AspNetCore.Mvc;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public SeedController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Seed sample data for testing
        /// </summary>
        [HttpPost("sample-data")]
        public async Task<IActionResult> SeedSampleData()
        {
            try
            {
                // Check if data already exists
                var hasData = await _context.Users.AnyAsync();
                if (hasData)
                {
                    return BadRequest("Sample data already exists. Database is not empty.");
                }

                // Seed sample users with properly hashed passwords
                var testPassword = "Test123!"; // Common test password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(testPassword);
                
                var users = new List<User>
                {
                    new User
                    {
                        FirstName = "Jan",
                        LastName = "Kowalski",
                        Email = "jan.kowalski@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP001",
                        PasswordHash = hashedPassword, // Properly hashed Test123!
                        DepartmentId = 1, // IT
                        PositionId = 1, // Software Developer
                        IsActive = true
                    },
                    new User
                    {
                        FirstName = "Anna",
                        LastName = "Nowak",
                        Email = "anna.nowak@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP002",
                        PasswordHash = hashedPassword,
                        DepartmentId = 1, // IT
                        PositionId = 2, // Team Lead
                        IsActive = true
                    },
                    new User
                    {
                        FirstName = "Piotr",
                        LastName = "Wiśniewski",
                        Email = "piotr.wisniewski@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP003",
                        PasswordHash = hashedPassword,
                        DepartmentId = 2, // HR
                        PositionId = 3, // HR Specialist
                        IsActive = true
                    },
                    new User
                    {
                        FirstName = "Maria",
                        LastName = "Kowal",
                        Email = "maria.kowal@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP004",
                        PasswordHash = hashedPassword,
                        DepartmentId = 3, // Finance
                        PositionId = 4, // Project Manager
                        IsActive = true
                    }
                };

                _context.Users.AddRange(users);
                await _context.SaveChangesAsync();

                // Set manager relationships
                var anna = await _context.Users.FirstAsync(u => u.EmployeeId == "EMP002");
                var jan = await _context.Users.FirstAsync(u => u.EmployeeId == "EMP001");
                jan.ManagerId = anna.Id;

                // Assign roles
                var employeeRole = await _context.Roles.FirstAsync(r => r.Name == "Employee");
                var managerRole = await _context.Roles.FirstAsync(r => r.Name == "Manager");
                var hrRole = await _context.Roles.FirstAsync(r => r.Name == "HR");

                var userRoles = new List<UserRole>
                {
                    new UserRole { UserId = jan.Id, RoleId = employeeRole.Id },
                    new UserRole { UserId = anna.Id, RoleId = managerRole.Id },
                    new UserRole { UserId = users[2].Id, RoleId = hrRole.Id },
                    new UserRole { UserId = users[3].Id, RoleId = employeeRole.Id }
                };

                _context.UserRoles.AddRange(userRoles);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Sample data seeded successfully",
                    usersCreated = users.Count,
                    rolesAssigned = userRoles.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Clear all data from database
        /// </summary>
        [HttpDelete("clear-all")]
        public async Task<IActionResult> ClearAllData()
        {
            try
            {
                // Delete in correct order to avoid FK constraints
                _context.UserRoles.RemoveRange(_context.UserRoles);
                _context.EvaluationCriteria.RemoveRange(_context.EvaluationCriteria);
                _context.EvaluationGoals.RemoveRange(_context.EvaluationGoals);
                _context.IDPGoals.RemoveRange(_context.IDPGoals);
                _context.Evaluations.RemoveRange(_context.Evaluations);
                _context.IDPPlans.RemoveRange(_context.IDPPlans);
                _context.SelfEvaluations.RemoveRange(_context.SelfEvaluations);
                _context.Users.RemoveRange(_context.Users);
                _context.EvaluationRounds.RemoveRange(_context.EvaluationRounds);

                await _context.SaveChangesAsync();

                return Ok(new { message = "All data cleared successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
