using System.ComponentModel.DataAnnotations;
using OcenaPlus.Domain.Enums;

namespace OcenaPlus.API.DTOs
{
    public class IDPPlanDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeDepartment { get; set; } = string.Empty;
        public string EmployeePosition { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public IDPStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<IDPGoalDto> Goals { get; set; } = new();
    }

    public class CreateIDPPlanDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public List<CreateIDPGoalDto>? Goals { get; set; }
    }

    public class UpdateIDPPlanDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public IDPStatus Status { get; set; }
    }

    public class IDPGoalDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public GoalStatus Status { get; set; }
        public DateTime TargetDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int Progress { get; set; }
    }

    public class CreateIDPGoalDto_Old
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime TargetDate { get; set; }
    }

    public class UpdateGoalProgressDto
    {
        [Range(0, 100, ErrorMessage = "Progress must be between 0 and 100")]
        public int Progress { get; set; }
    }

    public class IDPStatisticsDto
    {
        public int TotalPlans { get; set; }
        public int ActivePlans { get; set; }
        public int CompletedPlans { get; set; }
        public int TotalGoals { get; set; }
        public int CompletedGoals { get; set; }
        public decimal AverageGoalProgress { get; set; }
        public Dictionary<string, int> StatusDistribution { get; set; } = new();
    }
}
