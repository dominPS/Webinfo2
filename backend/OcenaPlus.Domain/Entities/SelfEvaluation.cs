using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class SelfEvaluation : BaseEntity
    {
        public int EmployeeId { get; set; }
        public User Employee { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string EvaluationPeriod { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Status { get; set; } = "draft"; // "draft", "submitted", "approved"

        public DateTime? SubmissionDate { get; set; }

        // JSON data fields for complex frontend objects
        public string? JobPerformanceData { get; set; }
        public string? CommunicationData { get; set; }
        public string? TeamworkData { get; set; }
        public string? LeadershipData { get; set; }
        public string? ProblemSolvingData { get; set; }
        public string? ProfessionalDevelopmentData { get; set; }
        public string? CurrentYearGoalsData { get; set; }
        public string? NextYearGoalsData { get; set; }

        [Range(1, 5)]
        public int OverallRating { get; set; }

        [MaxLength(2000)]
        public string OverallComments { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? ManagerFeedback { get; set; }

        public DateTime LastModified { get; set; } = DateTime.UtcNow;
    }
}
