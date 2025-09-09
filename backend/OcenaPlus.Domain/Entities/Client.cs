using System.ComponentModel.DataAnnotations;

namespace OcenaPlus.Domain.Entities
{
    public class Client : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Contact email for client
        /// </summary>
        [MaxLength(255)]
        public string? ContactEmail { get; set; }

        /// <summary>
        /// Contact phone for client
        /// </summary>
        [MaxLength(20)]
        public string? ContactPhone { get; set; }

        /// <summary>
        /// Whether client is active
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// External client ID (e.g., from WebInfo system)
        /// </summary>
        public Guid? ExternalClientId { get; set; }

        // Navigation properties
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}
