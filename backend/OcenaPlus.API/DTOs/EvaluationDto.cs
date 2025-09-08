using System.ComponentModel.DataAnnotations;
using OcenaPlus.Domain.Enums;

namespace OcenaPlus.API.DTOs
{
    public class EvaluationDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeDepartment { get; set; } = string.Empty;
        public string EmployeePosition { get; set; } = string.Empty;
        public int? EvaluatorId { get; set; }
        public string? EvaluatorName { get; set; }
        public EvaluationType Type { get; set; }
        public EvaluationStatus Status { get; set; }
        public DateTime EvaluationDate { get; set; }
        public string Period { get; set; } = string.Empty;
        public decimal? SelfAssessmentScore { get; set; }
        public decimal? ManagerAssessmentScore { get; set; }
        public decimal? HRAssessmentScore { get; set; }
        public decimal? FinalScore { get; set; }
        public string Goals { get; set; } = string.Empty;
        public string Achievements { get; set; } = string.Empty;
        public string AreasForImprovement { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
        public List<CriteriaScoreDto> CriteriaScores { get; set; } = new();
    }

    public class CreateEvaluationDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public EvaluationType Type { get; set; }

        [Required]
        public string Period { get; set; } = string.Empty;

        public string? Goals { get; set; }

        public List<CreateCriteriaDto>? Criteria { get; set; }
    }

    public class CreateCriteriaDto
    {
        [Required]
        public string CriterionName { get; set; } = string.Empty;

        [Range(0.1, 1.0, ErrorMessage = "Weight must be between 0.1 and 1.0")]
        public decimal Weight { get; set; }
    }

    public class SelfAssessmentDto
    {
        [Range(1, 5, ErrorMessage = "Self assessment score must be between 1 and 5")]
        public decimal? SelfAssessmentScore { get; set; }

        public string? Achievements { get; set; }

        public List<SelfCriteriaScoreDto>? CriteriaScores { get; set; }
    }

    public class SelfCriteriaScoreDto
    {
        [Required]
        public string CriterionName { get; set; } = string.Empty;

        [Range(1, 5, ErrorMessage = "Self score must be between 1 and 5")]
        public decimal? SelfScore { get; set; }

        public string? Comments { get; set; }
    }

    public class ManagerAssessmentDto
    {
        [Range(1, 5, ErrorMessage = "Manager assessment score must be between 1 and 5")]
        public decimal? ManagerAssessmentScore { get; set; }

        public string? AreasForImprovement { get; set; }

        public string? Comments { get; set; }

        public List<ManagerCriteriaScoreDto>? CriteriaScores { get; set; }
    }

    public class ManagerCriteriaScoreDto
    {
        [Required]
        public string CriterionName { get; set; } = string.Empty;

        [Range(1, 5, ErrorMessage = "Manager score must be between 1 and 5")]
        public decimal? ManagerScore { get; set; }
    }

    public class FinalizeEvaluationDto
    {
        [Range(1, 5, ErrorMessage = "HR assessment score must be between 1 and 5")]
        public decimal? HRAssessmentScore { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Final score must be between 1 and 5")]
        public decimal FinalScore { get; set; }

        public List<HRCriteriaScoreDto>? CriteriaScores { get; set; }
    }

    public class HRCriteriaScoreDto
    {
        [Required]
        public string CriterionName { get; set; } = string.Empty;

        [Range(1, 5, ErrorMessage = "HR score must be between 1 and 5")]
        public decimal? HRScore { get; set; }
    }

    public class CriteriaScoreDto
    {
        public string CriterionName { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public decimal? SelfScore { get; set; }
        public decimal? ManagerScore { get; set; }
        public decimal? HRScore { get; set; }
        public string Comments { get; set; } = string.Empty;
    }

    public class EvaluationStatisticsDto
    {
        public int TotalEvaluations { get; set; }
        public int CompletedEvaluations { get; set; }
        public int PendingEvaluations { get; set; }
        public decimal AverageScore { get; set; }
        public Dictionary<string, int> StatusDistribution { get; set; } = new();
        public Dictionary<string, int> TypeDistribution { get; set; } = new();
    }
}
