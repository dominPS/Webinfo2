using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.DTOs
{
    /// <summary>
    /// DTO for WebInfo integration - user data
    /// </summary>
    public class WebInfoUserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO for adding user from WebInfo
    /// </summary>
    public class WebInfoAddUserDto
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

        [Required]
        public string DepartmentName { get; set; } = string.Empty;

        [Required]
        public string PositionName { get; set; } = string.Empty;

        public string? ManagerEmail { get; set; }

        /// <summary>
        /// Client ID from WebInfo system
        /// </summary>
        public int? ClientId { get; set; }

        /// <summary>
        /// Default password for the user (will be hashed)
        /// </summary>
        public string? DefaultPassword { get; set; }

        /// <summary>
        /// Role names to assign to user
        /// </summary>
        public List<string> RoleNames { get; set; } = new List<string> { "Employee" };
    }

    /// <summary>
    /// DTO for updating user from WebInfo
    /// </summary>
    public class WebInfoUpdateUserDto
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
        public string DepartmentName { get; set; } = string.Empty;

        [Required]
        public string PositionName { get; set; } = string.Empty;

        public string? ManagerEmail { get; set; }

        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Client ID from WebInfo system
        /// </summary>
        [Required]
        public int? ClientId { get; set; }

        /// <summary>
        /// Role names to assign to user
        /// </summary>
        public List<string> RoleNames { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO for single sign-on from WebInfo
    /// </summary>
    public class WebInfoSsoDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int ClientId { get; set; }

        /// <summary>
        /// Redirect URL after successful login
        /// </summary>
        public string? RedirectUrl { get; set; }

        /// <summary>
        /// Additional user data to sync
        /// </summary>
        public WebInfoUserData? UserData { get; set; }
    }

    /// <summary>
    /// Additional user data from WebInfo
    /// </summary>
    public class WebInfoUserData
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DepartmentName { get; set; }
        public string? PositionName { get; set; }
        public List<string> RoleNames { get; set; } = new List<string>();
    }

    /// <summary>
    /// Response for SSO request
    /// </summary>
    public class WebInfoSsoResponse
    {
        public string Token { get; set; } = string.Empty;
        public string RedirectUrl { get; set; } = string.Empty;
        public WebInfoUserDto User { get; set; } = null!;
    }
}
