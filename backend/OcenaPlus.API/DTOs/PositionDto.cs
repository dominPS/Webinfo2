namespace OcenaPlus.API.DTOs
{
    public class PositionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int EmployeeCount { get; set; }
    }

    public class CreatePositionDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdatePositionDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
