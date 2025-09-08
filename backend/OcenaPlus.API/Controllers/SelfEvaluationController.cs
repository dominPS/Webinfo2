using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.API.DTOs;
using OcenaPlus.Domain.Entities;
using System.Security.Claims;
using System.Text.Json;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SelfEvaluationController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public SelfEvaluationController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all self-evaluations for the current user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<SelfEvaluationFormDto>>> GetMySelfEvaluations()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var evaluations = await _context.SelfEvaluations
                .Where(se => se.EmployeeId == userId.Value)
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Department)
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Position)
                .OrderByDescending(se => se.LastModified)
                .ToListAsync();

            var result = evaluations.Select(MapToDto).ToList();
            return Ok(result);
        }

        /// <summary>
        /// Get specific self-evaluation by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<SelfEvaluationFormDto>> GetSelfEvaluation(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var evaluation = await _context.SelfEvaluations
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Department)
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Position)
                .FirstOrDefaultAsync(se => se.Id == id && se.EmployeeId == userId.Value);

            if (evaluation == null)
                return NotFound();

            return Ok(MapToDto(evaluation));
        }

        /// <summary>
        /// Create new self-evaluation
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<SelfEvaluationFormDto>> CreateSelfEvaluation(CreateSelfEvaluationDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Position)
                .FirstOrDefaultAsync(u => u.Id == userId.Value);

            if (user == null)
                return NotFound("User not found");

            var selfEvaluation = new SelfEvaluation
            {
                EmployeeId = userId.Value,
                EvaluationPeriod = dto.EvaluationPeriod,
                Status = "draft",
                LastModified = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                
                // Serialize complex data as JSON
                JobPerformanceData = JsonSerializer.Serialize(dto.JobPerformance ?? new PerformanceAreaDto()),
                CommunicationData = JsonSerializer.Serialize(dto.Communication ?? new CommunicationDto()),
                TeamworkData = JsonSerializer.Serialize(dto.Teamwork ?? new TeamworkDto()),
                LeadershipData = JsonSerializer.Serialize(dto.Leadership ?? new LeadershipDto()),
                ProblemSolvingData = JsonSerializer.Serialize(dto.ProblemSolving ?? new ProblemSolvingDto()),
                ProfessionalDevelopmentData = JsonSerializer.Serialize(dto.ProfessionalDevelopment ?? new ProfessionalDevelopmentDto()),
                CurrentYearGoalsData = JsonSerializer.Serialize(dto.CurrentYearGoals ?? new CurrentYearGoalsDto()),
                NextYearGoalsData = JsonSerializer.Serialize(dto.NextYearGoals ?? new NextYearGoalsDto()),
                
                OverallRating = dto.OverallRating,
                OverallComments = dto.OverallComments ?? string.Empty
            };

            _context.SelfEvaluations.Add(selfEvaluation);
            await _context.SaveChangesAsync();

            // Reload with related data
            selfEvaluation = await _context.SelfEvaluations
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Department)
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Position)
                .FirstAsync(se => se.Id == selfEvaluation.Id);

            return CreatedAtAction(nameof(GetSelfEvaluation), new { id = selfEvaluation.Id }, MapToDto(selfEvaluation));
        }

        /// <summary>
        /// Update existing self-evaluation (save draft)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<SelfEvaluationFormDto>> UpdateSelfEvaluation(int id, UpdateSelfEvaluationDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var evaluation = await _context.SelfEvaluations
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Department)
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Position)
                .FirstOrDefaultAsync(se => se.Id == id && se.EmployeeId == userId.Value);

            if (evaluation == null)
                return NotFound();

            // Don't allow editing submitted/approved evaluations
            if (evaluation.Status == "submitted" || evaluation.Status == "approved")
                return BadRequest("Cannot edit submitted or approved evaluation");

            // Update fields
            if (dto.EvaluationPeriod != null)
                evaluation.EvaluationPeriod = dto.EvaluationPeriod;
            
            if (dto.JobPerformance != null)
                evaluation.JobPerformanceData = JsonSerializer.Serialize(dto.JobPerformance);
            
            if (dto.Communication != null)
                evaluation.CommunicationData = JsonSerializer.Serialize(dto.Communication);
            
            if (dto.Teamwork != null)
                evaluation.TeamworkData = JsonSerializer.Serialize(dto.Teamwork);
            
            if (dto.Leadership != null)
                evaluation.LeadershipData = JsonSerializer.Serialize(dto.Leadership);
            
            if (dto.ProblemSolving != null)
                evaluation.ProblemSolvingData = JsonSerializer.Serialize(dto.ProblemSolving);
            
            if (dto.ProfessionalDevelopment != null)
                evaluation.ProfessionalDevelopmentData = JsonSerializer.Serialize(dto.ProfessionalDevelopment);
            
            if (dto.CurrentYearGoals != null)
                evaluation.CurrentYearGoalsData = JsonSerializer.Serialize(dto.CurrentYearGoals);
            
            if (dto.NextYearGoals != null)
                evaluation.NextYearGoalsData = JsonSerializer.Serialize(dto.NextYearGoals);
            
            if (dto.OverallRating.HasValue)
                evaluation.OverallRating = dto.OverallRating.Value;
            
            if (dto.OverallComments != null)
                evaluation.OverallComments = dto.OverallComments;

            evaluation.LastModified = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapToDto(evaluation));
        }

        /// <summary>
        /// Submit self-evaluation for review
        /// </summary>
        [HttpPost("{id}/submit")]
        public async Task<ActionResult<SelfEvaluationFormDto>> SubmitSelfEvaluation(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var evaluation = await _context.SelfEvaluations
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Department)
                .Include(se => se.Employee)
                    .ThenInclude(e => e.Position)
                .FirstOrDefaultAsync(se => se.Id == id && se.EmployeeId == userId.Value);

            if (evaluation == null)
                return NotFound();

            if (evaluation.Status == "submitted" || evaluation.Status == "approved")
                return BadRequest("Evaluation is already submitted or approved");

            evaluation.Status = "submitted";
            evaluation.SubmissionDate = DateTime.UtcNow;
            evaluation.LastModified = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapToDto(evaluation));
        }

        /// <summary>
        /// Delete self-evaluation
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSelfEvaluation(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var evaluation = await _context.SelfEvaluations
                .FirstOrDefaultAsync(se => se.Id == id && se.EmployeeId == userId.Value);

            if (evaluation == null)
                return NotFound();

            // Only allow deleting drafts
            if (evaluation.Status != "draft")
                return BadRequest("Can only delete draft evaluations");

            _context.SelfEvaluations.Remove(evaluation);
            await _context.SaveChangesAsync();

            return NoContent();
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

        private SelfEvaluationFormDto MapToDto(SelfEvaluation evaluation)
        {
            return new SelfEvaluationFormDto
            {
                Id = evaluation.Id,
                EmployeeId = evaluation.Employee.EmployeeId,
                EmployeeName = $"{evaluation.Employee.FirstName} {evaluation.Employee.LastName}",
                Position = evaluation.Employee.Position?.Name ?? string.Empty,
                Department = evaluation.Employee.Department?.Name ?? string.Empty,
                EvaluationPeriod = evaluation.EvaluationPeriod,
                
                JobPerformance = SafeDeserialize<PerformanceAreaDto>(evaluation.JobPerformanceData),
                Communication = SafeDeserialize<CommunicationDto>(evaluation.CommunicationData),
                Teamwork = SafeDeserialize<TeamworkDto>(evaluation.TeamworkData),
                Leadership = SafeDeserialize<LeadershipDto>(evaluation.LeadershipData),
                ProblemSolving = SafeDeserialize<ProblemSolvingDto>(evaluation.ProblemSolvingData),
                ProfessionalDevelopment = SafeDeserialize<ProfessionalDevelopmentDto>(evaluation.ProfessionalDevelopmentData),
                CurrentYearGoals = SafeDeserialize<CurrentYearGoalsDto>(evaluation.CurrentYearGoalsData),
                NextYearGoals = SafeDeserialize<NextYearGoalsDto>(evaluation.NextYearGoalsData),
                
                OverallRating = evaluation.OverallRating,
                OverallComments = evaluation.OverallComments,
                ManagerFeedback = evaluation.ManagerFeedback,
                
                Status = evaluation.Status,
                SubmissionDate = evaluation.SubmissionDate,
                LastModified = evaluation.LastModified
            };
        }

        private T SafeDeserialize<T>(string? json) where T : new()
        {
            if (string.IsNullOrEmpty(json))
                return new T();

            try
            {
                return JsonSerializer.Deserialize<T>(json) ?? new T();
            }
            catch
            {
                return new T();
            }
        }
    }
}
