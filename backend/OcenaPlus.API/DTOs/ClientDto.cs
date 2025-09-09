using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.API.DTOs
{
    /// <summary>
    /// DTO for Client information
    /// </summary>
    public class ClientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string ApiKey { get; set; } = string.Empty;
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public bool IsActive { get; set; }
        public Guid? ExternalClientId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UsersCount { get; set; }
    }

    /// <summary>
    /// DTO for adding new client
    /// </summary>
    public class AddClientDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(255)]
        [EmailAddress]
        public string? ContactEmail { get; set; }

        [MaxLength(20)]
        public string? ContactPhone { get; set; }

        /// <summary>
        /// External client ID (e.g., from WebInfo system)
        /// </summary>
        public Guid? ExternalClientId { get; set; }
    }

    /// <summary>
    /// DTO for updating client
    /// </summary>
    public class UpdateClientDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(255)]
        [EmailAddress]
        public string? ContactEmail { get; set; }

        [MaxLength(20)]
        public string? ContactPhone { get; set; }

        public bool IsActive { get; set; } = true;

        /// <summary>
        /// External client ID (e.g., from WebInfo system)
        /// </summary>
        public Guid? ExternalClientId { get; set; }
    }
}
