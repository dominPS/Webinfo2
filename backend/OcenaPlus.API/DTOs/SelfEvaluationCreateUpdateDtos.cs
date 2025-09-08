namespace OcenaPlus.API.DTOs
{
    public class CreateSelfEvaluationDto
    {
        public required string EvaluationPeriod { get; set; }
        public PerformanceAreaDto? JobPerformance { get; set; }
        public CommunicationDto? Communication { get; set; }
        public TeamworkDto? Teamwork { get; set; }
        public LeadershipDto? Leadership { get; set; }
        public ProblemSolvingDto? ProblemSolving { get; set; }
        public ProfessionalDevelopmentDto? ProfessionalDevelopment { get; set; }
        public CurrentYearGoalsDto? CurrentYearGoals { get; set; }
        public NextYearGoalsDto? NextYearGoals { get; set; }
        public int OverallRating { get; set; }
        public string? OverallComments { get; set; }
    }

    public class UpdateSelfEvaluationDto
    {
        public string? EvaluationPeriod { get; set; }
        public PerformanceAreaDto? JobPerformance { get; set; }
        public CommunicationDto? Communication { get; set; }
        public TeamworkDto? Teamwork { get; set; }
        public LeadershipDto? Leadership { get; set; }
        public ProblemSolvingDto? ProblemSolving { get; set; }
        public ProfessionalDevelopmentDto? ProfessionalDevelopment { get; set; }
        public CurrentYearGoalsDto? CurrentYearGoals { get; set; }
        public NextYearGoalsDto? NextYearGoals { get; set; }
        public int? OverallRating { get; set; }
        public string? OverallComments { get; set; }
    }
}
