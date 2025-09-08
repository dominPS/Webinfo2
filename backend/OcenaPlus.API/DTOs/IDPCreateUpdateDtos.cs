namespace OcenaPlus.API.DTOs
{
    public class CreateIDPDto
    {
        public required int EmployeeId { get; set; }
        public required int Year { get; set; }
    }

    public class UpdateIDPDto
    {
        public string? Status { get; set; }
    }

    public class CreateIDPGoalDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Category { get; set; } // "business" or "development"
    }

    public class UpdateIDPGoalDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? Status { get; set; } // "inProgress", "completed", "notStarted"
    }

    public class RejectIDPDto
    {
        public string? Comment { get; set; }
    }
}
