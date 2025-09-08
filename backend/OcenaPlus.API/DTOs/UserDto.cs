namespace OcenaPlus.API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // FirstName + LastName
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}".Trim();
        public string Email { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? Position { get; set; }
        public string? Manager { get; set; }
        public string Role { get; set; } = string.Empty; // Primary role for frontend: Admin, HR, Leader, Employee
        public List<string> Roles { get; set; } = new(); // All roles
        public bool IsActive { get; set; }
    }

    public class CreateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public int PositionId { get; set; }
        public int? ManagerId { get; set; }
        public List<int> RoleIds { get; set; } = new();
    }
}
