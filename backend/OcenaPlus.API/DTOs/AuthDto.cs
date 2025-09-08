using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Email { get; set; } = string.Empty; // Może być email lub username

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
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
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public int PositionId { get; set; }

        public int? ManagerId { get; set; }

        public List<int> RoleIds { get; set; } = new();
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserDto User { get; set; } = null!;
    }

    public class ChangePasswordDto
    {
        [Required]
        [MinLength(6, ErrorMessage = "Current password must be at least 6 characters long")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "New password must be at least 6 characters long")]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword", ErrorMessage = "Password confirmation does not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
