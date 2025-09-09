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
        public string Description { get; set; } = string.Empty; // Opis celu - ogólny opis

        [MaxLength(2000)]
        public string? Details { get; set; } = string.Empty; // Szczegóły celu - szczegółowe kroki i działania

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // "business" or "development" - typ celu

        [MaxLength(50)]
        public string Status { get; set; } = "draft"; // "draft", "submitted", "approved", "correction_needed"

        public DateTime? TargetDate { get; set; }

        [Range(0, 100)]
        public int Progress { get; set; } = 0;

        [MaxLength(1000)]
        public string? Notes { get; set; }

        // Nowe pole do oznaczenia czy cel jest szkicem
        public bool IsDraft { get; set; } = true;

        // Data przesłania do akceptacji
        public DateTime? SubmittedDate { get; set; }

        // Data akceptacji
        public DateTime? ApprovalDate { get; set; }

        // Kto zaakceptował cel
        public int? ApprovedById { get; set; }
        public User? ApprovedBy { get; set; }

        // Komentarze do celu
        [MaxLength(1000)]
        public string? ApprovalComments { get; set; }
    }
}
