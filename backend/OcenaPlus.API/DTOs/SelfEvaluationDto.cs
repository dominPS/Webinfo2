using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.DTOs
{
    public class SelfEvaluationFormDto
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EvaluationPeriod { get; set; } = string.Empty;
        
        // Performance Areas with ratings and comments
        public PerformanceAreaDto JobPerformance { get; set; } = new();
        public CommunicationDto Communication { get; set; } = new();
        public TeamworkDto Teamwork { get; set; } = new();
        public LeadershipDto Leadership { get; set; } = new();
        public ProblemSolvingDto ProblemSolving { get; set; } = new();
        public ProfessionalDevelopmentDto ProfessionalDevelopment { get; set; } = new();
        
        // Goals
        public CurrentYearGoalsDto CurrentYearGoals { get; set; } = new();
        public NextYearGoalsDto NextYearGoals { get; set; } = new();
        
        // Overall Assessment
        [Range(0, 5, ErrorMessage = "Overall rating must be between 0 and 5")]
        public int OverallRating { get; set; }
        public string OverallComments { get; set; } = string.Empty;
        public string ManagerFeedback { get; set; } = string.Empty;
        
        // Status and tracking
        public string Status { get; set; } = "draft"; // draft, submitted, approved, requires_revision
        public DateTime? SubmissionDate { get; set; }
        public DateTime LastModified { get; set; } = DateTime.UtcNow;
    }

    public class PerformanceAreaDto
    {
        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public int Rating { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string Achievements { get; set; } = string.Empty;
        public string Challenges { get; set; } = string.Empty;
    }

    public class CommunicationDto
    {
        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public int Rating { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string Improvements { get; set; } = string.Empty;
    }

    public class TeamworkDto
    {
        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public int Rating { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string Collaboration { get; set; } = string.Empty;
    }

    public class LeadershipDto
    {
        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public int Rating { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string Initiatives { get; set; } = string.Empty;
    }

    public class ProblemSolvingDto
    {
        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public int Rating { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string Examples { get; set; } = string.Empty;
    }

    public class ProfessionalDevelopmentDto
    {
        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public int Rating { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string Goals { get; set; } = string.Empty;
        public string Training { get; set; } = string.Empty;
    }

    public class CurrentYearGoalsDto
    {
        public string Achieved { get; set; } = string.Empty;
        public string PartiallyAchieved { get; set; } = string.Empty;
        public string NotAchieved { get; set; } = string.Empty;
    }

    public class NextYearGoalsDto
    {
        public string Professional { get; set; } = string.Empty;
        public string Personal { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;
    }

    public class CreateSelfEvaluationDto_Old
    {
        [Required]
        public string EvaluationPeriod { get; set; } = string.Empty;
        
        // Performance Areas
        public PerformanceAreaDto? JobPerformance { get; set; }
        public CommunicationDto? Communication { get; set; }
        public TeamworkDto? Teamwork { get; set; }
        public LeadershipDto? Leadership { get; set; }
        public ProblemSolvingDto? ProblemSolving { get; set; }
        public ProfessionalDevelopmentDto? ProfessionalDevelopment { get; set; }
        
        // Goals
        public CurrentYearGoalsDto? CurrentYearGoals { get; set; }
        public NextYearGoalsDto? NextYearGoals { get; set; }
        
        // Overall
        public int OverallRating { get; set; }
        public string? OverallComments { get; set; }
    }

    public class UpdateSelfEvaluationDto_Old
    {
        public string? EvaluationPeriod { get; set; }
        
        // Performance Areas
        public PerformanceAreaDto? JobPerformance { get; set; }
        public CommunicationDto? Communication { get; set; }
        public TeamworkDto? Teamwork { get; set; }
        public LeadershipDto? Leadership { get; set; }
        public ProblemSolvingDto? ProblemSolving { get; set; }
        public ProfessionalDevelopmentDto? ProfessionalDevelopment { get; set; }
        
        // Goals
        public CurrentYearGoalsDto? CurrentYearGoals { get; set; }
        public NextYearGoalsDto? NextYearGoals { get; set; }
        
        // Overall
        public int? OverallRating { get; set; }
        public string? OverallComments { get; set; }
    }
}
