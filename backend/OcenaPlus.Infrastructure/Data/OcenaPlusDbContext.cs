using Microsoft.EntityFrameworkCore;
using OcenaPlus.Domain.Entities;

namespace OcenaPlus.Infrastructure.Data
{
    public class OcenaPlusDbContext : DbContext
    {
        public OcenaPlusDbContext(DbContextOptions<OcenaPlusDbContext> options)
            : base(options)
        {
        }

        // Users and Organization
        public DbSet<User> Users { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Client> Clients { get; set; }

        // Evaluations
        public DbSet<EvaluationRound> EvaluationRounds { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<EvaluationCriteria> EvaluationCriteria { get; set; }
        public DbSet<EvaluationGoal> EvaluationGoals { get; set; }
        public DbSet<SelfEvaluation> SelfEvaluations { get; set; }

        // IDP Plans
        public DbSet<IDPPlan> IDPPlans { get; set; }
        public DbSet<IDPGoal> IDPGoals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasIndex(e => e.Email)
                    .IsUnique();
                
                entity.HasIndex(e => e.EmployeeId)
                    .IsUnique();

                entity.HasOne(e => e.Department)
                    .WithMany(d => d.Users)
                    .HasForeignKey(e => e.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Position)
                    .WithMany(p => p.Users)
                    .HasForeignKey(e => e.PositionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Manager)
                    .WithMany(m => m.DirectReports)
                    .HasForeignKey(e => e.ManagerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Client)
                    .WithMany(c => c.Users)
                    .HasForeignKey(e => e.ClientId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Client entity configuration
            modelBuilder.Entity<Client>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasIndex(e => e.ApiKey)
                    .IsUnique();
                
                entity.HasIndex(e => e.ExternalClientId)
                    .IsUnique()
                    .HasFilter("[ExternalClientId] IS NOT NULL");
            });

            // UserRole entity configuration
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(ur => ur.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Evaluation entity configuration
            modelBuilder.Entity<Evaluation>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Employee)
                    .WithMany(u => u.EvaluationsAsEmployee)
                    .HasForeignKey(e => e.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Evaluator)
                    .WithMany(u => u.EvaluationsAsEvaluator)
                    .HasForeignKey(e => e.EvaluatorId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.EvaluationRound)
                    .WithMany(r => r.Evaluations)
                    .HasForeignKey(e => e.EvaluationRoundId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // EvaluationCriteria entity configuration
            modelBuilder.Entity<EvaluationCriteria>(entity =>
            {
                entity.HasKey(ec => ec.Id);

                entity.HasOne(ec => ec.Evaluation)
                    .WithMany(e => e.Criteria)
                    .HasForeignKey(ec => ec.EvaluationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // EvaluationGoal entity configuration
            modelBuilder.Entity<EvaluationGoal>(entity =>
            {
                entity.HasKey(eg => eg.Id);

                entity.HasOne(eg => eg.Evaluation)
                    .WithMany(e => e.Goals)
                    .HasForeignKey(eg => eg.EvaluationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // SelfEvaluation entity configuration
            modelBuilder.Entity<SelfEvaluation>(entity =>
            {
                entity.HasKey(se => se.Id);

                entity.HasOne(se => se.Employee)
                    .WithMany()
                    .HasForeignKey(se => se.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // IDPPlan entity configuration
            modelBuilder.Entity<IDPPlan>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.HasOne(p => p.Employee)
                    .WithMany(u => u.IDPPlans)
                    .HasForeignKey(p => p.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.ApprovedBy)
                    .WithMany()
                    .HasForeignKey(p => p.ApprovedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // IDPGoal entity configuration
            modelBuilder.Entity<IDPGoal>(entity =>
            {
                entity.HasKey(g => g.Id);

                entity.HasOne(g => g.Plan)
                    .WithMany(p => p.Goals)
                    .HasForeignKey(g => g.PlanId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(g => g.ApprovedBy)
                    .WithMany()
                    .HasForeignKey(g => g.ApprovedById)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure automatic timestamps
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    modelBuilder.Entity(entityType.ClrType)
                        .Property<DateTime>("CreatedAt")
                        .HasDefaultValueSql("GETUTCDATE()");

                    modelBuilder.Entity(entityType.ClrType)
                        .Property<DateTime>("UpdatedAt")
                        .HasDefaultValueSql("GETUTCDATE()");
                }
            }

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            
            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Employee", Description = "Regular employee", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Role { Id = 2, Name = "Manager", Description = "Team manager", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Role { Id = 3, Name = "HR", Description = "Human Resources", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Role { Id = 4, Name = "Admin", Description = "System administrator", CreatedAt = seedDate, UpdatedAt = seedDate }
            );

            // Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { Id = 1, Name = "IT", Description = "Information Technology", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Department { Id = 2, Name = "HR", Description = "Human Resources", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Department { Id = 3, Name = "Finance", Description = "Finance and Accounting", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Department { Id = 4, Name = "Marketing", Description = "Marketing and Sales", CreatedAt = seedDate, UpdatedAt = seedDate }
            );

            // Seed Positions
            modelBuilder.Entity<Position>().HasData(
                new Position { Id = 1, Name = "Software Developer", Description = "Software Development", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Position { Id = 2, Name = "Team Lead", Description = "Team Leadership", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Position { Id = 3, Name = "HR Specialist", Description = "Human Resources", CreatedAt = seedDate, UpdatedAt = seedDate },
                new Position { Id = 4, Name = "Project Manager", Description = "Project Management", CreatedAt = seedDate, UpdatedAt = seedDate }
            );

            // Seed Clients
            modelBuilder.Entity<Client>().HasData(
                new Client 
                { 
                    Id = 1, 
                    Name = "WebInfo Test Client", 
                    Description = "Test client for WebInfo integration", 
                    ApiKey = "webinfo-api-key-12345",
                    ExternalClientId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    ContactEmail = "test@webinfo.com",
                    ContactPhone = "+48123456789",
                    IsActive = true,
                    CreatedAt = seedDate, 
                    UpdatedAt = seedDate 
                },
                new Client 
                { 
                    Id = 2, 
                    Name = "WebInfo Demo Client", 
                    Description = "Demo client for WebInfo integration", 
                    ApiKey = "webinfo-test-key",
                    ExternalClientId = Guid.Parse("b2c3d4e5-f6a7-8901-bcde-f23456789012"),
                    ContactEmail = "demo@webinfo.com",
                    IsActive = true,
                    CreatedAt = seedDate, 
                    UpdatedAt = seedDate 
                }
            );
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }
        }
    }
}
