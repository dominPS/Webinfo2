using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public TestController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        [HttpGet("database-status")]
        public async Task<IActionResult> GetDatabaseStatus()
        {
            try
            {
                var result = new
                {
                    DatabaseConnected = true,
                    TablesInfo = new
                    {
                        UsersCount = await _context.Users.CountAsync(),
                        SelfEvaluationsCount = await _context.SelfEvaluations.CountAsync(),
                        IDPPlansCount = await _context.IDPPlans.CountAsync(),
                        IDPGoalsCount = await _context.IDPGoals.CountAsync(),
                        DepartmentsCount = await _context.Departments.CountAsync(),
                        RolesCount = await _context.Roles.CountAsync()
                    },
                    SampleUsers = await _context.Users
                        .Select(u => new { u.Id, u.Email, u.FirstName, u.LastName })
                        .Take(5)
                        .ToListAsync(),
                    SampleEvaluations = await _context.SelfEvaluations
                        .Select(se => new { se.Id, se.EmployeeId, se.EvaluationPeriod, se.Status, se.LastModified })
                        .Take(5)
                        .ToListAsync()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    DatabaseConnected = false,
                    Error = ex.Message,
                    InnerError = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("cors-test")]
        public IActionResult CorsTest()
        {
            return Ok(new { message = "CORS działa!", timestamp = DateTime.Now });
        }
    }
}
