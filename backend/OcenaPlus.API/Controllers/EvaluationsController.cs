using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;
using OcenaPlus.Domain.Enums;
using System.Security.Claims;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EvaluationsController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public EvaluationsController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get evaluations for current user or all evaluations (HR/Admin)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EvaluationDto>>> GetEvaluations(
            [FromQuery] int? employeeId = null,
            [FromQuery] EvaluationType? type = null,
            [FromQuery] EvaluationStatus? status = null,
            [FromQuery] int? year = null)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            var query = _context.Evaluations
                .Include(e => e.Employee)
                    .ThenInclude(e => e.Department)
                .Include(e => e.Employee)
                    .ThenInclude(e => e.Position)
                .Include(e => e.Evaluator)
                .Include(e => e.Criteria)
                .Where(e => !e.IsDeleted);

            // Apply authorization filters
            if (!currentUserRoles.Contains("HR") && !currentUserRoles.Contains("Admin"))
            {
                if (employeeId.HasValue)
                {
                    // Check if user can access this employee's evaluations
                    var canAccess = currentUserId == employeeId || // Own evaluations
                                   (currentUserRoles.Contains("Leader") && 
                                    await _context.Users.AnyAsync(u => u.Id == employeeId && u.ManagerId == currentUserId));

                    if (!canAccess)
                        return Forbid("You don't have permission to access these evaluations");
                    
                    query = query.Where(e => e.EmployeeId == employeeId);
                }
                else if (currentUserRoles.Contains("Leader"))
                {
                    // Leaders see their own evaluations and their team's evaluations
                    query = query.Where(e => e.EmployeeId == currentUserId || 
                                           _context.Users.Any(u => u.Id == e.EmployeeId && u.ManagerId == currentUserId));
                }
                else
                {
                    // Regular users see only their own evaluations
                    query = query.Where(e => e.EmployeeId == currentUserId);
                }
            }
            else if (employeeId.HasValue)
            {
                // HR/Admin can filter by specific employee
                query = query.Where(e => e.EmployeeId == employeeId);
            }

            // Apply additional filters
            if (type.HasValue)
                query = query.Where(e => e.Type == type);

            if (status.HasValue)
                query = query.Where(e => e.Status == status);

            if (year.HasValue)
                query = query.Where(e => e.CreatedAt.Year == year);

            var evaluations = await query
                .OrderByDescending(e => e.CreatedAt)
                .ThenBy(e => e.Employee.LastName)
                .ToListAsync();

            var evaluationDtos = evaluations.Select(e => new EvaluationDto
            {
                Id = e.Id,
                EmployeeId = e.EmployeeId,
                EmployeeName = e.Employee.FullName,
                EmployeeDepartment = e.Employee.Department.Name,
                EmployeePosition = e.Employee.Position.Name,
                EvaluatorId = e.EvaluatorId,
                EvaluatorName = e.Evaluator?.FullName,
                Type = e.Type,
                Status = e.Status,
                EvaluationDate = e.CreatedAt,
                Period = e.EvaluationPeriod,
                SelfAssessmentScore = null, // Not in our model
                ManagerAssessmentScore = null, // Not in our model
                HRAssessmentScore = null, // Not in our model
                FinalScore = e.OverallRating,
                Goals = string.Join("; ", e.Goals?.Select(g => g.Description) ?? new List<string>()),
                Achievements = "", // Not in our model
                AreasForImprovement = "", // Not in our model
                Comments = e.OverallComments ?? "",
                CriteriaScores = e.Criteria?.Select(ec => new CriteriaScoreDto
                {
                    CriterionName = ec.CriteriaType,
                    Weight = 1.0m, // Default weight since not in our model
                    SelfScore = ec.Rating,
                    ManagerScore = null, // Not available in our simple model
                    HRScore = null, // Not available in our simple model
                    Comments = ec.Comments ?? ""
                }).ToList() ?? new List<CriteriaScoreDto>()
            }).ToList();

            return Ok(evaluationDtos);
        }

        /// <summary>
        /// Get specific evaluation by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<EvaluationDto>> GetEvaluation(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            var evaluation = await _context.Evaluations
                .Include(e => e.Employee)
                    .ThenInclude(e => e.Department)
                .Include(e => e.Employee)
                    .ThenInclude(e => e.Position)
                .Include(e => e.Evaluator)
                .Include(e => e.Criteria)
                .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

            if (evaluation == null)
                return NotFound();

            // Check authorization
            var canAccess = currentUserRoles.Contains("HR") || 
                           currentUserRoles.Contains("Admin") ||
                           evaluation.EmployeeId == currentUserId || // Own evaluation
                           evaluation.EvaluatorId == currentUserId || // Evaluating this person
                           (currentUserRoles.Contains("Leader") && 
                            await _context.Users.AnyAsync(u => u.Id == evaluation.EmployeeId && u.ManagerId == currentUserId));

            if (!canAccess)
                return Forbid("You don't have permission to access this evaluation");

            var evaluationDto = new EvaluationDto
            {
                Id = evaluation.Id,
                EmployeeId = evaluation.EmployeeId,
                EmployeeName = evaluation.Employee.FullName,
                EmployeeDepartment = evaluation.Employee.Department.Name,
                EmployeePosition = evaluation.Employee.Position.Name,
                EvaluatorId = evaluation.EvaluatorId,
                EvaluatorName = evaluation.Evaluator?.FullName,
                Type = evaluation.Type,
                Status = evaluation.Status,
                EvaluationDate = evaluation.CreatedAt,
                Period = evaluation.EvaluationPeriod,
                SelfAssessmentScore = null,
                ManagerAssessmentScore = null,
                HRAssessmentScore = null,
                FinalScore = evaluation.OverallRating,
                Goals = string.Join("; ", evaluation.Goals?.Select(g => g.Description) ?? new List<string>()),
                Achievements = "",
                AreasForImprovement = "",
                Comments = evaluation.OverallComments ?? "",
                CriteriaScores = evaluation.Criteria?.Select(ec => new CriteriaScoreDto
                {
                    CriterionName = ec.CriteriaType,
                    Weight = 1.0m,
                    SelfScore = ec.Rating,
                    ManagerScore = null,
                    HRScore = null,
                    Comments = ec.Comments ?? ""
                }).ToList() ?? new List<CriteriaScoreDto>()
            };

            return Ok(evaluationDto);
        }

        /// <summary>
        /// Create new evaluation (HR/Admin/Leader)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "HR,Admin,Leader")]
        public async Task<ActionResult<EvaluationDto>> CreateEvaluation(CreateEvaluationDto createEvaluationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            // Check if employee exists and user has permission
            var employee = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == createEvaluationDto.EmployeeId && u.IsActive && !u.IsDeleted);

            if (employee == null)
                return BadRequest("Employee not found");

            // Check authorization to create evaluation for this employee
            if (!currentUserRoles.Contains("HR") && !currentUserRoles.Contains("Admin"))
            {
                if (currentUserRoles.Contains("Leader"))
                {
                    var isTeamMember = await _context.Users
                        .AnyAsync(u => u.Id == createEvaluationDto.EmployeeId && u.ManagerId == currentUserId);
                    if (!isTeamMember)
                        return Forbid("You can only create evaluations for your team members");
                }
                else
                {
                    return Forbid("You don't have permission to create evaluations");
                }
            }

            var evaluation = new Evaluation
            {
                EmployeeId = createEvaluationDto.EmployeeId,
                EvaluatorId = currentUserId,
                Type = createEvaluationDto.Type,
                Status = EvaluationStatus.Draft,
                EvaluationPeriod = createEvaluationDto.Period,
                OverallComments = createEvaluationDto.Goals ?? string.Empty
            };

            _context.Evaluations.Add(evaluation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvaluation), new { id = evaluation.Id }, new { id = evaluation.Id });
        }

        /// <summary>
        /// Update evaluation status (HR/Admin)
        /// </summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> UpdateEvaluationStatus(int id, [FromBody] EvaluationStatus status)
        {
            var evaluation = await _context.Evaluations
                .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

            if (evaluation == null)
                return NotFound();

            evaluation.Status = status;

            if (status == EvaluationStatus.Completed || status == EvaluationStatus.Approved)
            {
                evaluation.ApprovalDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Delete evaluation (HR/Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> DeleteEvaluation(int id)
        {
            var evaluation = await _context.Evaluations
                .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

            if (evaluation == null)
                return NotFound();

            evaluation.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Get evaluation statistics (HR/Admin/Leader)
        /// </summary>
        [HttpGet("statistics")]
        [Authorize(Roles = "HR,Admin,Leader")]
        public async Task<ActionResult<EvaluationStatisticsDto>> GetEvaluationStatistics(
            [FromQuery] int? departmentId = null,
            [FromQuery] int? year = null)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            var query = _context.Evaluations
                .Include(e => e.Employee)
                .Where(e => !e.IsDeleted);

            // Apply authorization filters
            if (!currentUserRoles.Contains("HR") && !currentUserRoles.Contains("Admin"))
            {
                if (currentUserRoles.Contains("Leader"))
                {
                    // Leaders see only their team's statistics
                    query = query.Where(e => _context.Users.Any(u => u.Id == e.EmployeeId && u.ManagerId == currentUserId));
                }
                else
                {
                    return Forbid("You don't have permission to view statistics");
                }
            }

            // Apply filters
            if (departmentId.HasValue)
                query = query.Where(e => e.Employee.DepartmentId == departmentId);

            if (year.HasValue)
                query = query.Where(e => e.CreatedAt.Year == year);

            var evaluations = await query.ToListAsync();

            var statistics = new EvaluationStatisticsDto
            {
                TotalEvaluations = evaluations.Count,
                CompletedEvaluations = evaluations.Count(e => e.Status == EvaluationStatus.Completed),
                PendingEvaluations = evaluations.Count(e => e.Status != EvaluationStatus.Completed),
                AverageScore = evaluations.Where(e => e.OverallRating.HasValue).Any() ? 
                    (decimal)evaluations.Where(e => e.OverallRating.HasValue).Average(e => e.OverallRating.Value) : 0,
                StatusDistribution = evaluations
                    .GroupBy(e => e.Status)
                    .ToDictionary(g => g.Key.ToString(), g => g.Count()),
                TypeDistribution = evaluations
                    .GroupBy(e => e.Type)
                    .ToDictionary(g => g.Key.ToString(), g => g.Count())
            };

            return Ok(statistics);
        }
    }
}
