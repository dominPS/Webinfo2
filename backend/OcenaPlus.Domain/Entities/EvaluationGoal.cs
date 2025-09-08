using OcenaPlus.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class EvaluationGoal : BaseEntity
    {
        public int EvaluationId { get; set; }
        public Evaluation Evaluation { get; set; } = null!;

        public GoalType Type { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public GoalStatus Status { get; set; }

        [MaxLength(1000)]
        public string? AchievementDescription { get; set; }

        [Range(0, 100)]
        public int? ProgressPercentage { get; set; }
    }
}
