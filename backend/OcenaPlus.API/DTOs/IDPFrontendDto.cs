using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.DTOs
{
    /// <summary>
    /// Main DTO for IDP Plans compatible with frontend expectations
    /// </summary>
    public class IDPFrontendDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public int Year { get; set; } = DateTime.Now.Year;
        public string Status { get; set; } = "draft"; // draft | submitted | approved
        public List<IDPGoalFrontendDto> Goals { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// DTO for IDP Goals compatible with frontend expectations
    /// </summary>
    public class IDPGoalFrontendDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "business"; // business | development
        public string Status { get; set; } = "inProgress"; // inProgress | completed | notStarted
    }

    public class CreateIDPGoalFrontendDto
    {
        [Required]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(business|development)$", ErrorMessage = "Category must be either 'business' or 'development'")]
        public string Category { get; set; } = "business";
    }

    public class UpdateIDPGoalFrontendDto
    {
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string? Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [RegularExpression("^(business|development)$", ErrorMessage = "Category must be either 'business' or 'development'")]
        public string? Category { get; set; }

        [RegularExpression("^(inProgress|completed|notStarted)$", ErrorMessage = "Invalid status")]
        public string? Status { get; set; }
    }


}
