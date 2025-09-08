using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string EmployeeId { get; set; } = string.Empty;

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int PositionId { get; set; }

        public int? ManagerId { get; set; }

        public bool IsActive { get; set; } = true;

        public List<int> RoleIds { get; set; } = new();
    }

    public class ResetPasswordDto
    {
        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
