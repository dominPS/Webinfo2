using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;
using System.Security.Claims;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class IDPController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public IDPController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all IDP plans for current user (or team if leader/HR)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<IDPFrontendDto>>> GetPlans()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var role = GetCurrentUserRole();
            var query = _context.IDPPlans
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Include(p => p.Employee)
                .ThenInclude(e => e.Position)
                .AsQueryable();

            if (role == "Employee")
            {
                query = query.Where(p => p.EmployeeId == userId.Value);
            }
            else if (role == "Manager")
            {
                var teamMemberIds = await _context.Users
                    .Where(u => u.ManagerId == userId.Value)
                    .Select(u => u.Id)
                    .ToListAsync();
                
                teamMemberIds.Add(userId.Value);
                query = query.Where(p => teamMemberIds.Contains(p.EmployeeId));
            }

            var plans = await query.Include(p => p.Goals).ToListAsync();
            var result = plans.Select(MapToFrontendDto).ToList();
            return Ok(result);
        }

        /// <summary>
        /// Get specific IDP plan by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<IDPFrontendDto>> GetPlan(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var plan = await _context.IDPPlans
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Include(p => p.Employee)
                .ThenInclude(e => e.Position)
                .Include(p => p.Goals)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            // Check access permissions
            if (!await HasAccessToPlan(plan, userId.Value))
                return Forbid();

            return Ok(MapToFrontendDto(plan));
        }

        /// <summary>
        /// Create new IDP plan
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<IDPFrontendDto>> CreatePlan(CreateIDPDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            // Only allow creating plans for self or team members (if leader)
            if (!await CanManageEmployee(dto.EmployeeId, userId.Value))
                return Forbid();

            var plan = new IDPPlan
            {
                EmployeeId = dto.EmployeeId,
                Year = dto.Year,
                Status = "draft",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.IDPPlans.Add(plan);
            await _context.SaveChangesAsync();

            // Reload with related data
            plan = await _context.IDPPlans
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Include(p => p.Employee)
                .ThenInclude(e => e.Position)
                .Include(p => p.Goals)
                .FirstAsync(p => p.Id == plan.Id);

            return CreatedAtAction(nameof(GetPlan), new { id = plan.Id }, MapToFrontendDto(plan));
        }

        /// <summary>
        /// Update IDP plan status
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<IDPFrontendDto>> UpdatePlan(int id, UpdateIDPDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var plan = await _context.IDPPlans
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Include(p => p.Employee)
                .ThenInclude(e => e.Position)
                .Include(p => p.Goals)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            if (!await HasAccessToPlan(plan, userId.Value))
                return Forbid();

            if (dto.Status != null)
                plan.Status = dto.Status;

            plan.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(MapToFrontendDto(plan));
        }

        /// <summary>
        /// Delete IDP plan
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePlan(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var plan = await _context.IDPPlans.FindAsync(id);
            if (plan == null)
                return NotFound();

            if (!await HasAccessToPlan(plan, userId.Value))
                return Forbid();

            _context.IDPPlans.Remove(plan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Add goal to IDP plan
        /// </summary>
        [HttpPost("{id}/goals")]
        public async Task<ActionResult<IDPGoalFrontendDto>> AddGoal(int id, CreateIDPGoalDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var plan = await _context.IDPPlans.FindAsync(id);
            if (plan == null)
                return NotFound();

            if (!await HasAccessToPlan(plan, userId.Value))
                return Forbid();

            var goal = new IDPGoal
            {
                PlanId = id,
                GoalId = Guid.NewGuid().ToString(),
                Title = dto.Title,
                Description = dto.Description ?? string.Empty,
                Category = dto.Category,
                Status = "inProgress",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.IDPGoals.Add(goal);
            await _context.SaveChangesAsync();

            return Ok(MapGoalToFrontendDto(goal));
        }

        /// <summary>
        /// Update goal in IDP plan
        /// </summary>
        [HttpPut("{id}/goals/{goalId}")]
        public async Task<ActionResult<IDPGoalFrontendDto>> UpdateGoal(int id, string goalId, UpdateIDPGoalDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var goal = await _context.IDPGoals
                .Include(g => g.Plan)
                .FirstOrDefaultAsync(g => g.PlanId == id && g.GoalId == goalId);

            if (goal == null)
                return NotFound();

            if (!await HasAccessToPlan(goal.Plan, userId.Value))
                return Forbid();

            if (dto.Title != null)
                goal.Title = dto.Title;
            
            if (dto.Description != null)
                goal.Description = dto.Description;
            
            if (dto.Category != null)
                goal.Category = dto.Category;
            
            if (dto.Status != null)
                goal.Status = dto.Status;

            goal.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(MapGoalToFrontendDto(goal));
        }

        /// <summary>
        /// Delete goal from IDP plan
        /// </summary>
        [HttpDelete("{id}/goals/{goalId}")]
        public async Task<ActionResult> DeleteGoal(int id, string goalId)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var goal = await _context.IDPGoals
                .Include(g => g.Plan)
                .FirstOrDefaultAsync(g => g.PlanId == id && g.GoalId == goalId);

            if (goal == null)
                return NotFound();

            if (!await HasAccessToPlan(goal.Plan, userId.Value))
                return Forbid();

            _context.IDPGoals.Remove(goal);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Submit IDP plan for approval
        /// </summary>
        [HttpPost("{id}/submit")]
        public async Task<ActionResult<IDPFrontendDto>> SubmitPlan(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var plan = await _context.IDPPlans
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Include(p => p.Employee)
                .ThenInclude(e => e.Position)
                .Include(p => p.Goals)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            if (!await HasAccessToPlan(plan, userId.Value))
                return Forbid();

            if (plan.Status == "submitted" || plan.Status == "approved")
                return BadRequest("Plan is already submitted or approved");

            plan.Status = "submitted";
            plan.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(MapToFrontendDto(plan));
        }

        /// <summary>
        /// Approve IDP plan (Leaders and HR only)
        /// </summary>
        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Leader,Manager,HR,Admin")]
        public async Task<ActionResult<IDPFrontendDto>> ApprovePlan(int id)
        {
            var plan = await _context.IDPPlans
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Include(p => p.Employee)
                .ThenInclude(e => e.Position)
                .Include(p => p.Goals)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            if (plan.Status != "submitted")
                return BadRequest("Plan must be submitted before approval");

            plan.Status = "approved";
            plan.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(MapToFrontendDto(plan));
        }

        /// <summary>
        /// Send IDP plan back for correction (Leaders and HR only)
        /// </summary>
        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Leader,Manager,HR,Admin")]
        public async Task<ActionResult<IDPFrontendDto>> RejectPlan(int id, [FromBody] RejectIDPDto dto)
        {
            var plan = await _context.IDPPlans
                .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
                .Include(p => p.Employee)
                .ThenInclude(e => e.Position)
                .Include(p => p.Goals)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            if (plan.Status != "submitted")
                return BadRequest("Plan must be submitted before rejection");

            plan.Status = "draft";
            plan.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // TODO: W przyszłości można dodać tabelę komentarzy/historii dla dto.Comment

            return Ok(MapToFrontendDto(plan));
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }

        private string GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? "Employee";
        }

        private async Task<bool> HasAccessToPlan(IDPPlan plan, int userId)
        {
            var role = GetCurrentUserRole();
            
            if (role == "Admin" || role == "HR")
                return true;
            
            if (plan.EmployeeId == userId)
                return true;
            
            if (role == "Leader" || role == "Manager")
            {
                return await _context.Users
                    .AnyAsync(u => u.Id == plan.EmployeeId && u.ManagerId == userId);
            }
            
            return false;
        }

        private async Task<bool> CanManageEmployee(int employeeId, int managerId)
        {
            var role = GetCurrentUserRole();
            
            if (role == "Admin" || role == "HR")
                return true;
            
            if (employeeId == managerId)
                return true;
            
            if (role == "Leader" || role == "Manager")
            {
                return await _context.Users
                    .AnyAsync(u => u.Id == employeeId && u.ManagerId == managerId);
            }
            
            return false;
        }

        private IDPFrontendDto MapToFrontendDto(IDPPlan plan)
        {
            return new IDPFrontendDto
            {
                Id = plan.Id.ToString(),
                EmployeeId = plan.Employee.EmployeeId,
                EmployeeName = $"{plan.Employee.FirstName} {plan.Employee.LastName}",
                EmployeeDepartment = plan.Employee.Department?.Name ?? "Nieznany",
                EmployeePosition = plan.Employee.Position?.Name ?? "Nieznane",
                Year = plan.Year,
                Status = plan.Status,
                Goals = plan.Goals?.Select(MapGoalToFrontendDto).ToList() ?? new List<IDPGoalFrontendDto>(),
                CreatedAt = plan.CreatedAt,
                UpdatedAt = plan.UpdatedAt
            };
        }

        private IDPGoalFrontendDto MapGoalToFrontendDto(IDPGoal goal)
        {
            return new IDPGoalFrontendDto
            {
                Id = goal.GoalId,
                Title = goal.Title,
                Description = goal.Description,
                Category = goal.Category,
                Status = goal.Status
            };
        }
}
}
