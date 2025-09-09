using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;
        private readonly ILogger<ClientsController> _logger;
        private readonly IConfiguration _configuration;

        public ClientsController(
            OcenaPlusDbContext context,
            ILogger<ClientsController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Get all clients (SuperAdmin only)
        /// </summary>
        [HttpGet]
        [Route("GetClients")]
        public async Task<IActionResult> GetClients()
        {
            try
            {
                // Validate SuperAdmin API key
                var apiKey = HttpContext.Request.Headers["SuperAdminApiKey"].FirstOrDefault();
                if (!ValidateSuperAdminApiKey(apiKey))
                {
                    return Unauthorized("Invalid SuperAdmin API key");
                }

                var clients = await _context.Clients
                    .Include(c => c.Users.Where(u => !u.IsDeleted))
                    .Where(c => !c.IsDeleted)
                    .OrderBy(c => c.Name)
                    .ToListAsync();

                var clientDtos = clients.Select(c => new ClientDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    ApiKey = c.ApiKey,
                    ContactEmail = c.ContactEmail,
                    ContactPhone = c.ContactPhone,
                    IsActive = c.IsActive,
                    ExternalClientId = c.ExternalClientId,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    UsersCount = c.Users.Count
                }).ToList();

                _logger.LogInformation($"Retrieved {clientDtos.Count} clients");

                return Ok(clientDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting clients: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get client by ID
        /// </summary>
        [HttpGet]
        [Route("GetClient")]
        public async Task<IActionResult> GetClient([FromQuery] int clientId)
        {
            try
            {
                // Validate API key (can be either SuperAdmin or client's own API key)
                var apiKey = HttpContext.Request.Headers["ClientApiKey"].FirstOrDefault() ?? 
                            HttpContext.Request.Headers["SuperAdminApiKey"].FirstOrDefault();
                
                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    return Unauthorized("API key is required");
                }

                var client = await _context.Clients
                    .Include(c => c.Users.Where(u => !u.IsDeleted))
                        .ThenInclude(u => u.Department)
                    .Include(c => c.Users.Where(u => !u.IsDeleted))
                        .ThenInclude(u => u.Position)
                    .Where(c => c.Id == clientId && !c.IsDeleted)
                    .FirstOrDefaultAsync();

                if (client == null)
                {
                    return NotFound($"Client with ID {clientId} not found");
                }

                // Validate access (either SuperAdmin or client's own API key)
                if (!ValidateSuperAdminApiKey(apiKey) && client.ApiKey != apiKey)
                {
                    return Unauthorized("Access denied");
                }

                var clientDto = new ClientDto
                {
                    Id = client.Id,
                    Name = client.Name,
                    Description = client.Description,
                    ApiKey = client.ApiKey,
                    ContactEmail = client.ContactEmail,
                    ContactPhone = client.ContactPhone,
                    IsActive = client.IsActive,
                    ExternalClientId = client.ExternalClientId,
                    CreatedAt = client.CreatedAt,
                    UpdatedAt = client.UpdatedAt,
                    UsersCount = client.Users.Count
                };

                return Ok(clientDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting client {clientId}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Add new client (SuperAdmin only)
        /// </summary>
        [HttpPost]
        [Route("AddClient")]
        public async Task<IActionResult> AddClient([FromBody] AddClientDto clientDto)
        {
            try
            {
                // Validate SuperAdmin API key
                var apiKey = HttpContext.Request.Headers["SuperAdminApiKey"].FirstOrDefault();
                if (!ValidateSuperAdminApiKey(apiKey))
                {
                    return Unauthorized("Invalid SuperAdmin API key");
                }

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Check if client with external ID already exists
                if (clientDto.ExternalClientId.HasValue)
                {
                    var existingClient = await _context.Clients
                        .FirstOrDefaultAsync(c => c.ExternalClientId == clientDto.ExternalClientId && !c.IsDeleted);
                    
                    if (existingClient != null)
                        return Conflict($"Client with external ID '{clientDto.ExternalClientId}' already exists");
                }

                // Generate unique API key
                var newApiKey = GenerateApiKey();
                
                // Ensure API key is unique
                while (await _context.Clients.AnyAsync(c => c.ApiKey == newApiKey))
                {
                    newApiKey = GenerateApiKey();
                }

                var client = new Client
                {
                    Name = clientDto.Name,
                    Description = clientDto.Description,
                    ApiKey = newApiKey,
                    ContactEmail = clientDto.ContactEmail,
                    ContactPhone = clientDto.ContactPhone,
                    ExternalClientId = clientDto.ExternalClientId,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Clients.Add(client);
                await _context.SaveChangesAsync();

                var responseDto = new ClientDto
                {
                    Id = client.Id,
                    Name = client.Name,
                    Description = client.Description,
                    ApiKey = client.ApiKey,
                    ContactEmail = client.ContactEmail,
                    ContactPhone = client.ContactPhone,
                    IsActive = client.IsActive,
                    ExternalClientId = client.ExternalClientId,
                    CreatedAt = client.CreatedAt,
                    UpdatedAt = client.UpdatedAt,
                    UsersCount = 0
                };

                _logger.LogInformation($"Client '{client.Name}' added successfully with ID {client.Id}");

                return Ok(new { message = "Client added successfully", client = responseDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding client: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update client (SuperAdmin only)
        /// </summary>
        [HttpPut]
        [Route("UpdateClient")]
        public async Task<IActionResult> UpdateClient([FromBody] UpdateClientDto clientDto)
        {
            try
            {
                // Validate SuperAdmin API key
                var apiKey = HttpContext.Request.Headers["SuperAdminApiKey"].FirstOrDefault();
                if (!ValidateSuperAdminApiKey(apiKey))
                {
                    return Unauthorized("Invalid SuperAdmin API key");
                }

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var client = await _context.Clients
                    .FirstOrDefaultAsync(c => c.Id == clientDto.Id && !c.IsDeleted);

                if (client == null)
                    return NotFound($"Client with ID {clientDto.Id} not found");

                // Check if external ID conflicts with another client
                if (clientDto.ExternalClientId.HasValue)
                {
                    var conflictingClient = await _context.Clients
                        .FirstOrDefaultAsync(c => c.ExternalClientId == clientDto.ExternalClientId && 
                                                 c.Id != clientDto.Id && 
                                                 !c.IsDeleted);
                    
                    if (conflictingClient != null)
                        return Conflict($"Another client with external ID '{clientDto.ExternalClientId}' already exists");
                }

                // Update client
                client.Name = clientDto.Name;
                client.Description = clientDto.Description;
                client.ContactEmail = clientDto.ContactEmail;
                client.ContactPhone = clientDto.ContactPhone;
                client.IsActive = clientDto.IsActive;
                client.ExternalClientId = clientDto.ExternalClientId;
                client.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Client '{client.Name}' (ID: {client.Id}) updated successfully");

                return Ok(new { message = "Client updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating client: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        #region Private Methods

        /// <summary>
        /// Validate SuperAdmin API key
        /// </summary>
        private bool ValidateSuperAdminApiKey(string? apiKey)
        {
            if (string.IsNullOrWhiteSpace(apiKey))
                return false;

            // Get SuperAdmin API key from configuration
            var validSuperAdminKey = _configuration["SuperAdmin:ApiKey"];
            
            return !string.IsNullOrWhiteSpace(validSuperAdminKey) && apiKey == validSuperAdminKey;
        }

        /// <summary>
        /// Generate unique API key for client
        /// </summary>
        private string GenerateApiKey()
        {
            return $"client-{Guid.NewGuid():N}";
        }

        #endregion
    }
}
