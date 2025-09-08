using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PositionsController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public PositionsController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all positions
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PositionDto>>> GetPositions()
        {
            var positions = await _context.Positions
                .Include(p => p.Users)
                .Where(p => !p.IsDeleted)
                .Select(p => new PositionDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    EmployeeCount = p.Users.Count(u => u.IsActive && !u.IsDeleted)
                })
                .ToListAsync();

            return Ok(positions);
        }

        /// <summary>
        /// Get position by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PositionDto>> GetPosition(int id)
        {
            var position = await _context.Positions
                .Include(p => p.Users)
                .Where(p => p.Id == id && !p.IsDeleted)
                .Select(p => new PositionDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    EmployeeCount = p.Users.Count(u => u.IsActive && !u.IsDeleted)
                })
                .FirstOrDefaultAsync();

            if (position == null)
            {
                return NotFound($"Position with ID {id} not found");
            }

            return Ok(position);
        }

        /// <summary>
        /// Create new position
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PositionDto>> CreatePosition(CreatePositionDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingPosition = await _context.Positions
                .AnyAsync(p => p.Name.ToLower() == createDto.Name.ToLower() && !p.IsDeleted);

            if (existingPosition)
            {
                return Conflict($"Position with name '{createDto.Name}' already exists");
            }

            var position = new Position
            {
                Name = createDto.Name,
                Description = createDto.Description
            };

            _context.Positions.Add(position);
            await _context.SaveChangesAsync();

            var positionDto = new PositionDto
            {
                Id = position.Id,
                Name = position.Name,
                Description = position.Description,
                EmployeeCount = 0
            };

            return CreatedAtAction(nameof(GetPosition), new { id = position.Id }, positionDto);
        }

        /// <summary>
        /// Update existing position
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<PositionDto>> UpdatePosition(int id, UpdatePositionDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var position = await _context.Positions
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

            if (position == null)
            {
                return NotFound($"Position with ID {id} not found");
            }

            var nameExists = await _context.Positions
                .AnyAsync(p => p.Id != id && p.Name.ToLower() == updateDto.Name.ToLower() && !p.IsDeleted);

            if (nameExists)
            {
                return Conflict($"Another position with name '{updateDto.Name}' already exists");
            }

            position.Name = updateDto.Name;
            position.Description = updateDto.Description;

            await _context.SaveChangesAsync();

            var employeeCount = await _context.Users
                .CountAsync(u => u.PositionId == id && u.IsActive && !u.IsDeleted);

            var positionDto = new PositionDto
            {
                Id = position.Id,
                Name = position.Name,
                Description = position.Description,
                EmployeeCount = employeeCount
            };

            return Ok(positionDto);
        }

        /// <summary>
        /// Delete position (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePosition(int id)
        {
            var position = await _context.Positions
                .Include(p => p.Users)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

            if (position == null)
            {
                return NotFound($"Position with ID {id} not found");
            }

            var hasActiveUsers = position.Users.Any(u => u.IsActive && !u.IsDeleted);
            if (hasActiveUsers)
            {
                return BadRequest("Cannot delete position that has active employees. Please reassign employees first.");
            }

            position.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
