namespace OcenaPlus.API.DTOs
{
    public class CreateIDPDto
    {
        public required int EmployeeId { get; set; }
        public required int Year { get; set; }
    }

    public class CreateMyIDPDto
    {
        public required int Year { get; set; }
    }

    public class UpdateIDPDto
    {
        public string? Status { get; set; }
    }

    public class CreateIDPGoalDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; } // Opis celu - ogólny opis
        public string? Details { get; set; } // Szczegóły celu - szczegółowe kroki i działania
        public required string Category { get; set; } // "business" or "development" - typ celu
        public bool IsDraft { get; set; } = true; // Czy cel jest szkicem
    }

    public class UpdateIDPGoalDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; } // Opis celu
        public string? Details { get; set; } // Szczegóły celu
        public string? Category { get; set; }
        public string? Status { get; set; } // "draft", "submitted", "approved", "correction_needed"
        public bool? IsDraft { get; set; }
    }

    public class SubmitIDPGoalDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Details { get; set; }
        public required string Category { get; set; }
    }

    public class SubmitGoalRequestDto
    {
        public required int GoalId { get; set; }
    }

    public class RejectIDPDto
    {
        public string? Comment { get; set; }
    }
}
