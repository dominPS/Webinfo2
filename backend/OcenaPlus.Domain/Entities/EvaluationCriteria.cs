using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class EvaluationCriteria : BaseEntity
    {
        public int EvaluationId { get; set; }
        public Evaluation Evaluation { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string CriteriaType { get; set; } = string.Empty; // jobPerformance, communication, teamwork, leadership, etc.

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comments { get; set; }

        [MaxLength(1000)]
        public string? Achievements { get; set; }

        [MaxLength(1000)]
        public string? Challenges { get; set; }

        [MaxLength(1000)]
        public string? Improvements { get; set; }

        [MaxLength(1000)]
        public string? Examples { get; set; }
    }
}
