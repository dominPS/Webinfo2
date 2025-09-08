using Microsoft.AspNetCore.Mvc;
using OcenaPlus.Infrastructure.Data;
using OcenaPlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace OcenaPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly OcenaPlusDbContext _context;

        public SeedController(OcenaPlusDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Seed sample data for testing
        /// </summary>
        [HttpPost("sample-data")]
        public async Task<IActionResult> SeedSampleData()
        {
            try
            {
                // Check if data already exists
                var hasData = await _context.Users.AnyAsync();
                if (hasData)
                {
                    return BadRequest("Sample data already exists. Database is not empty.");
                }

                // Seed sample users with properly hashed passwords
                var testPassword = "Test123!"; // Common test password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(testPassword);
                
                var users = new List<User>
                {
                    new User
                    {
                        FirstName = "Jan",
                        LastName = "Kowalski",
                        Email = "jan.kowalski@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP001",
                        PasswordHash = hashedPassword, // Properly hashed Test123!
                        DepartmentId = 1, // IT
                        PositionId = 1, // Software Developer
                        IsActive = true
                    },
                    new User
                    {
                        FirstName = "Anna",
                        LastName = "Nowak",
                        Email = "anna.nowak@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP002",
                        PasswordHash = hashedPassword,
                        DepartmentId = 1, // IT
                        PositionId = 2, // Team Lead
                        IsActive = true
                    },
                    new User
                    {
                        FirstName = "Piotr",
                        LastName = "Wiśniewski",
                        Email = "piotr.wisniewski@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP003",
                        PasswordHash = hashedPassword,
                        DepartmentId = 2, // HR
                        PositionId = 3, // HR Specialist
                        IsActive = true
                    },
                    new User
                    {
                        FirstName = "Maria",
                        LastName = "Kowal",
                        Email = "maria.kowal@company.com", // Updated to match frontend expectation
                        EmployeeId = "EMP004",
                        PasswordHash = hashedPassword,
                        DepartmentId = 3, // Finance
                        PositionId = 4, // Project Manager
                        IsActive = true
                    }
                };

                _context.Users.AddRange(users);
                await _context.SaveChangesAsync();

                // Set manager relationships
                var anna = await _context.Users.FirstAsync(u => u.EmployeeId == "EMP002");
                var jan = await _context.Users.FirstAsync(u => u.EmployeeId == "EMP001");
                jan.ManagerId = anna.Id;

                // Assign roles
                var employeeRole = await _context.Roles.FirstAsync(r => r.Name == "Employee");
                var managerRole = await _context.Roles.FirstAsync(r => r.Name == "Manager");
                var hrRole = await _context.Roles.FirstAsync(r => r.Name == "HR");

                var userRoles = new List<UserRole>
                {
                    new UserRole { UserId = jan.Id, RoleId = employeeRole.Id },
                    new UserRole { UserId = anna.Id, RoleId = managerRole.Id },
                    new UserRole { UserId = users[2].Id, RoleId = hrRole.Id },
                    new UserRole { UserId = users[3].Id, RoleId = employeeRole.Id }
                };

                _context.UserRoles.AddRange(userRoles);
                await _context.SaveChangesAsync();

                // Seed sample evaluation data for Jan Kowalski
                await SeedSampleEvaluations();

                return Ok(new
                {
                    message = "Sample data seeded successfully",
                    usersCreated = users.Count,
                    rolesAssigned = userRoles.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Seed sample evaluation data
        /// </summary>
        [HttpPost("sample-evaluations")]
        public async Task<IActionResult> SeedSampleEvaluations()
        {
            try
            {
                // Check if we already have self-evaluations
                var hasEvaluations = await _context.SelfEvaluations.AnyAsync();
                if (hasEvaluations)
                {
                    return BadRequest("Sample evaluations already exist.");
                }

                // Get our users
                var jan = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == "EMP001");
                var anna = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == "EMP002");
                var piotr = await _context.Users.FirstOrDefaultAsync(u => u.EmployeeId == "EMP003");

                if (jan == null || anna == null || piotr == null)
                {
                    return BadRequest("Required users don't exist. Please seed sample data first.");
                }

                // Create example performance area content
                var performanceAreaExample = new
                {
                    Rating = 4,
                    Comments = "Osiągnąłem wszystkie kluczowe cele projektowe w tym okresie.",
                    Achievements = "Zakończenie projektu X przed terminem, wdrożenie funkcji Y z 15% wzrostem wydajności.",
                    Challenges = "Napięty harmonogram, zmiany wymagań w trakcie projektu."
                };

                var communicationExample = new
                {
                    Rating = 3,
                    Comments = "Poprawiłem komunikację z zespołem i interesariuszami.",
                    Improvements = "Regularne aktualizacje statusu, bardziej przejrzysta dokumentacja."
                };

                var teamworkExample = new
                {
                    Rating = 5,
                    Comments = "Efektywna współpraca z zespołem deweloperskim i działem UX.",
                    Collaboration = "Wspólne sesje rozwiązywania problemów, wzajemne code review."
                };

                var leadershipExample = new
                {
                    Rating = 4,
                    Comments = "Proaktywnie prowadziłem inicjatywy w zespole.",
                    Initiatives = "Organizacja wewnętrznych warsztatów, mentoring nowych członków zespołu."
                };

                var problemSolvingExample = new
                {
                    Rating = 4,
                    Comments = "Skutecznie rozwiązywałem złożone problemy techniczne.",
                    Examples = "Optymalizacja wydajności bazy danych, rozwiązanie problemów z integracją API."
                };

                var professionalDevExample = new
                {
                    Rating = 3,
                    Comments = "Rozwijałem kompetencje techniczne i miękkie.",
                    Goals = "Certyfikacja, pogłębienie wiedzy w obszarze X.",
                    Training = "Ukończone kursy online, konferencje branżowe."
                };

                var currentYearGoalsExample = new
                {
                    Achieved = "Wdrożenie systemu CI/CD, refaktoryzacja modułu X.",
                    PartiallyAchieved = "Automatyzacja testów (70% ukończona).",
                    NotAchieved = "Migracja do nowej wersji frameworka (przełożona na następny kwartał)."
                };

                var nextYearGoalsExample = new
                {
                    Professional = "Uzyskanie certyfikacji cloud, prowadzenie wewnętrznych szkoleń.",
                    Personal = "Lepsza równowaga praca-życie, redukcja nadgodzin.",
                    Skills = "Rozwijanie umiejętności w obszarze architektury, pogłębienie wiedzy o wzorcach projektowych."
                };

                // Create sample self-evaluations for Jan (current year - submitted)
                var janCurrentYearEvaluation = new SelfEvaluation
                {
                    EmployeeId = jan.Id,
                    EvaluationPeriod = "2024",
                    Status = "submitted",
                    SubmissionDate = DateTime.UtcNow.AddDays(-15),
                    LastModified = DateTime.UtcNow.AddDays(-15),
                    
                    JobPerformanceData = JsonSerializer.Serialize(performanceAreaExample),
                    CommunicationData = JsonSerializer.Serialize(communicationExample),
                    TeamworkData = JsonSerializer.Serialize(teamworkExample),
                    LeadershipData = JsonSerializer.Serialize(leadershipExample),
                    ProblemSolvingData = JsonSerializer.Serialize(problemSolvingExample),
                    ProfessionalDevelopmentData = JsonSerializer.Serialize(professionalDevExample),
                    CurrentYearGoalsData = JsonSerializer.Serialize(currentYearGoalsExample),
                    NextYearGoalsData = JsonSerializer.Serialize(nextYearGoalsExample),
                    
                    OverallRating = 4,
                    OverallComments = "Ogólnie był to dobry rok z kilkoma znaczącymi osiągnięciami i obszarami do poprawy w przyszłości."
                };

                // Create sample self-evaluations for Jan (previous year - approved)
                var janLastYearEvaluation = new SelfEvaluation
                {
                    EmployeeId = jan.Id,
                    EvaluationPeriod = "2023",
                    Status = "approved",
                    SubmissionDate = DateTime.UtcNow.AddYears(-1).AddDays(-20),
                    LastModified = DateTime.UtcNow.AddYears(-1).AddDays(-15),
                    
                    JobPerformanceData = JsonSerializer.Serialize(performanceAreaExample),
                    CommunicationData = JsonSerializer.Serialize(communicationExample),
                    TeamworkData = JsonSerializer.Serialize(teamworkExample),
                    LeadershipData = JsonSerializer.Serialize(leadershipExample),
                    ProblemSolvingData = JsonSerializer.Serialize(problemSolvingExample),
                    ProfessionalDevelopmentData = JsonSerializer.Serialize(professionalDevExample),
                    CurrentYearGoalsData = JsonSerializer.Serialize(currentYearGoalsExample),
                    NextYearGoalsData = JsonSerializer.Serialize(nextYearGoalsExample),
                    
                    OverallRating = 4,
                    OverallComments = "Dobry rok z wieloma osiągnięciami projektowymi.",
                    ManagerFeedback = "Pracownik konsekwentnie osiągał wysokie wyniki. Zalecam dalszy rozwój umiejętności przywódczych."
                };

                // Create sample self-evaluations for Anna (current year - draft)
                var annaCurrentYearEvaluation = new SelfEvaluation
                {
                    EmployeeId = anna.Id,
                    EvaluationPeriod = "2024",
                    Status = "draft",
                    LastModified = DateTime.UtcNow.AddDays(-5),
                    
                    JobPerformanceData = JsonSerializer.Serialize(new
                    {
                        Rating = 5,
                        Comments = "Zrealizowałam wszystkie projekty zgodnie z harmonogramem.",
                        Achievements = "Wzrost wydajności zespołu o 25%, redukcja czasu realizacji projektów o 15%.",
                        Challenges = "Koordynacja pracy zdalnej podczas pandemii, zmiany priorytetów biznesowych."
                    }),
                    CommunicationData = JsonSerializer.Serialize(new
                    {
                        Rating = 4,
                        Comments = "Skuteczna komunikacja w zespole i z interesariuszami.",
                        Improvements = "Wprowadzenie regularnych spotkań statusowych, usprawnienie dokumentacji projektowej."
                    }),
                    TeamworkData = JsonSerializer.Serialize(new
                    {
                        Rating = 5,
                        Comments = "Silny nacisk na współpracę i wspólne rozwiązywanie problemów.",
                        Collaboration = "Wprowadzenie nowych narzędzi do współpracy zespołowej, mentoring junior developerów."
                    }),
                    
                    OverallRating = 5,
                    OverallComments = "Bardzo dobry rok pod względem realizacji celów i rozwoju zespołu."
                };

                // Create sample self-evaluations for Anna (previous year - approved)
                var annaLastYearEvaluation = new SelfEvaluation
                {
                    EmployeeId = anna.Id,
                    EvaluationPeriod = "2023",
                    Status = "approved",
                    SubmissionDate = DateTime.UtcNow.AddYears(-1).AddDays(-25),
                    LastModified = DateTime.UtcNow.AddYears(-1).AddDays(-20),
                    
                    JobPerformanceData = JsonSerializer.Serialize(new
                    {
                        Rating = 4,
                        Comments = "Zrealizowałam większość kluczowych projektów zgodnie z planem.",
                        Achievements = "Wdrożenie nowej metodologii pracy w zespole, usprawnienie procesów.",
                        Challenges = "Ograniczenia budżetowe, rotacja w zespole."
                    }),
                    TeamworkData = JsonSerializer.Serialize(new
                    {
                        Rating = 4,
                        Comments = "Dobra współpraca w zespole.",
                        Collaboration = "Regularne spotkania zespołu, wspólne sesje code review."
                    }),
                    
                    OverallRating = 4,
                    OverallComments = "Dobry rok z wieloma osiągnięciami w zarządzaniu zespołem.",
                    ManagerFeedback = "Doskonałe wyniki w zarządzaniu zespołem i projektami. Sugeruję dalszy rozwój w obszarze strategii produktowej."
                };

                // Create sample self-evaluations for Piotr (current year - approved)
                var piotrCurrentYearEvaluation = new SelfEvaluation
                {
                    EmployeeId = piotr.Id,
                    EvaluationPeriod = "2024",
                    Status = "approved",
                    SubmissionDate = DateTime.UtcNow.AddDays(-30),
                    LastModified = DateTime.UtcNow.AddDays(-25),
                    
                    JobPerformanceData = JsonSerializer.Serialize(new
                    {
                        Rating = 4,
                        Comments = "Zrealizowałem wszystkie zadania HR na czas.",
                        Achievements = "Usprawnienie procesu rekrutacji, wdrożenie nowego programu szkoleniowego.",
                        Challenges = "Wysoka dynamika rekrutacji, zmiany w prawie pracy."
                    }),
                    CommunicationData = JsonSerializer.Serialize(new
                    {
                        Rating = 5,
                        Comments = "Skuteczna komunikacja z kandydatami i pracownikami.",
                        Improvements = "Wprowadzenie regularnych ankiet pracowniczych, usprawnienie onboardingu."
                    }),
                    
                    OverallRating = 4,
                    OverallComments = "Dobry rok dla działu HR.",
                    ManagerFeedback = "Bardzo dobre wyniki. Proponuję dalszy rozwój w kierunku HR Business Partnera."
                };

                // Add all evaluations to the context
                _context.SelfEvaluations.Add(janCurrentYearEvaluation);
                _context.SelfEvaluations.Add(janLastYearEvaluation);
                _context.SelfEvaluations.Add(annaCurrentYearEvaluation);
                _context.SelfEvaluations.Add(annaLastYearEvaluation);
                _context.SelfEvaluations.Add(piotrCurrentYearEvaluation);
                
                await _context.SaveChangesAsync();

                return Ok(new { message = "Sample evaluation data seeded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Clear all data from database
        /// </summary>
        [HttpDelete("clear-all")]
        public async Task<IActionResult> ClearAllData()
        {
            try
            {
                // Delete in correct order to avoid FK constraints
                _context.UserRoles.RemoveRange(_context.UserRoles);
                _context.EvaluationCriteria.RemoveRange(_context.EvaluationCriteria);
                _context.EvaluationGoals.RemoveRange(_context.EvaluationGoals);
                _context.IDPGoals.RemoveRange(_context.IDPGoals);
                _context.Evaluations.RemoveRange(_context.Evaluations);
                _context.IDPPlans.RemoveRange(_context.IDPPlans);
                _context.SelfEvaluations.RemoveRange(_context.SelfEvaluations);
                _context.Users.RemoveRange(_context.Users);
                _context.EvaluationRounds.RemoveRange(_context.EvaluationRounds);

                await _context.SaveChangesAsync();

                return Ok(new { message = "All data cleared successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
