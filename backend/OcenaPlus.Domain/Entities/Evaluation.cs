using OcenaPlus.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class Evaluation : BaseEntity
    {
        public int EmployeeId { get; set; }
        public User Employee { get; set; } = null!;

        public int? EvaluatorId { get; set; }
        public User? Evaluator { get; set; }

        public int? EvaluationRoundId { get; set; }
        public EvaluationRound? EvaluationRound { get; set; }

        [Required]
        public EvaluationType Type { get; set; }

        [Required]
        public EvaluationStatus Status { get; set; }

        [MaxLength(20)]
        public string EvaluationPeriod { get; set; } = string.Empty;

        public DateTime? SubmissionDate { get; set; }

        public DateTime? ApprovalDate { get; set; }

        [MaxLength(2000)]
        public string? OverallComments { get; set; }

        public int? OverallRating { get; set; } // 1-5 scale

        // Navigation properties
        public ICollection<EvaluationCriteria> Criteria { get; set; } = new List<EvaluationCriteria>();
        public ICollection<EvaluationGoal> Goals { get; set; } = new List<EvaluationGoal>();
    }
}
