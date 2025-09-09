using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using System.Reflection;
using System.Net;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public HealthController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealth()
        {
            try
            {
                // Test database connection
                var canConnect = await _context.Database.CanConnectAsync();
                
                return Ok(new
                {
                    status = "healthy",
                    timestamp = DateTime.UtcNow,
                    database = canConnect ? "connected" : "disconnected",
                    version = "1.0.0"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "unhealthy",
                    timestamp = DateTime.UtcNow,
                    database = "error",
                    error = ex.Message
                });
            }
        }

        [HttpGet("database")]
        public async Task<IActionResult> GetDatabaseInfo()
        {
            try
            {
                var departmentCount = await _context.Departments.CountAsync();
                var positionCount = await _context.Positions.CountAsync();
                var roleCount = await _context.Roles.CountAsync();
                var userCount = await _context.Users.CountAsync();

                return Ok(new
                {
                    database = "OcenaPlusDB",
                    tables = new
                    {
                        departments = departmentCount,
                        positions = positionCount,
                        roles = roleCount,
                        users = userCount
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("GetStatus")]
        public IActionResult GetStatus()
        {
            try
            {
                AssemblyInformationalVersionAttribute? version = 
                    Assembly.GetExecutingAssembly()
                        .GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute), false)
                        .FirstOrDefault() as AssemblyInformationalVersionAttribute;

                var connection = _context.Database.GetDbConnection();
                
                return Ok(new
                {
                    DatabaseInstanceName = connection.Database,
                    DatabaseHost = $"{connection.DataSource} ({Dns.GetHostName()})",
                    ConnectedToDatabase = _context.Database.CanConnect(),
                    ApiVersion = version?.InformationalVersion ?? "Unknown",
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                    FrontEnd = "React Application" // Możesz skonfigurować to w appsettings.json
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow 
                });
            }
        }
    }
}
