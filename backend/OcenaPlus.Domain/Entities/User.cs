using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string EmployeeId { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public int DepartmentId { get; set; }
        public Department Department { get; set; } = null!;

        public int PositionId { get; set; }
        public Position Position { get; set; } = null!;

        public int? ManagerId { get; set; }
        public User? Manager { get; set; }

        public int? ClientId { get; set; }
        public Client? Client { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public ICollection<User> DirectReports { get; set; } = new List<User>();
        public ICollection<Evaluation> EvaluationsAsEmployee { get; set; } = new List<Evaluation>();
        public ICollection<Evaluation> EvaluationsAsEvaluator { get; set; } = new List<Evaluation>();
        public ICollection<IDPPlan> IDPPlans { get; set; } = new List<IDPPlan>();
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

        public string FullName => $"{FirstName} {LastName}";
    }
}
