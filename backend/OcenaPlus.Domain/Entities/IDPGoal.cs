using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class IDPGoal : BaseEntity
    {
        public int PlanId { get; set; }
        public IDPPlan Plan { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string GoalId { get; set; } = string.Empty; // Frontend uses string IDs

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // "business" or "development"

        [MaxLength(50)]
        public string Status { get; set; } = "inProgress"; // "inProgress", "completed", "notStarted"

        public DateTime? TargetDate { get; set; }

        [Range(0, 100)]
        public int Progress { get; set; } = 0;

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }
}
