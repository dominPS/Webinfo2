namespace OcenaPlus.Domain.Enums
{
    public enum EvaluationStatus
    {
        Draft = 0,
        Submitted = 1,
        InProgress = 2,
        RequiresCorrection = 3,
        Approved = 4,
        Completed = 5
    }

    public enum EvaluationType
    {
        SelfEvaluation = 0,
        ManagerEvaluation = 1,
        PeerReview = 2,
        AnnualReview = 3
    }

    public enum EvaluationRoundStatus
    {
        Draft = 0,
        Active = 1,
        Completed = 2,
        Cancelled = 3
    }
}
