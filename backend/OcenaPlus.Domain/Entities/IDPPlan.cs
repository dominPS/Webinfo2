using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class IDPPlan : BaseEntity
    {
        public int EmployeeId { get; set; }
        public User Employee { get; set; } = null!;

        [Required]
        public int Year { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "draft"; // "draft", "submitted", "approved"

        public DateTime? ApprovalDate { get; set; }

        public int? ApprovedById { get; set; }
        public User? ApprovedBy { get; set; }

        [MaxLength(2000)]
        public string? OverallComments { get; set; }

        // Navigation properties
        public ICollection<IDPGoal> Goals { get; set; } = new List<IDPGoal>();
    }
}
