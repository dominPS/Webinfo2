using OcenaPlus.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class EvaluationRound : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public EvaluationRoundStatus Status { get; set; }

        // Navigation properties
        public ICollection<Evaluation> Evaluations { get; set; } = new List<Evaluation>();
    }
}
