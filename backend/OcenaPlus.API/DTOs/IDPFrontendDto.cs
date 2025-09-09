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
        public string EmployeeDepartment { get; set; } = string.Empty;
        public string EmployeePosition { get; set; } = string.Empty;
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
        public string Description { get; set; } = string.Empty; // Opis celu - ogólny opis
        public string Details { get; set; } = string.Empty; // Szczegóły celu - szczegółowe kroki i działania
        public string Category { get; set; } = "business"; // business | development - typ celu
        public string Status { get; set; } = "draft"; // draft | submitted | approved | correction_needed
        public bool IsDraft { get; set; } = true; // Czy cel jest szkicem
        public DateTime? SubmittedDate { get; set; } // Data przesłania do akceptacji
        public DateTime? ApprovalDate { get; set; } // Data akceptacji
        public string? ApprovalComments { get; set; } // Komentarze do celu
    }

    public class CreateIDPGoalFrontendDto
    {
        [Required]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; } = string.Empty; // Opis celu

        [StringLength(2000, ErrorMessage = "Details cannot exceed 2000 characters")]
        public string? Details { get; set; } = string.Empty; // Szczegóły celu

        [Required]
        [RegularExpression("^(business|development)$", ErrorMessage = "Category must be either 'business' or 'development'")]
        public string Category { get; set; } = "business"; // Typ celu

        public bool IsDraft { get; set; } = true; // Czy cel jest szkicem
    }

    public class UpdateIDPGoalFrontendDto
    {
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string? Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; } // Opis celu

        [StringLength(2000, ErrorMessage = "Details cannot exceed 2000 characters")]
        public string? Details { get; set; } // Szczegóły celu

        [RegularExpression("^(business|development)$", ErrorMessage = "Category must be either 'business' or 'development'")]
        public string? Category { get; set; }

        [RegularExpression("^(draft|submitted|approved|correction_needed)$", ErrorMessage = "Invalid status")]
        public string? Status { get; set; }

        public bool? IsDraft { get; set; }
    }


}
