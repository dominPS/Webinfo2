namespace OcenaPlus.Domain.Enums
{
    public enum IDPStatus
    {
        Draft = 0,
        Submitted = 1,
        Approved = 2,
        InProgress = 3,
        Completed = 4,
        RequiresRevision = 5
    }

    public enum GoalStatus
    {
        NotStarted = 0,
        InProgress = 1,
        Completed = 2,
        Cancelled = 3,
        PartiallyAchieved = 4
    }

    public enum GoalType
    {
        Professional = 0,
        Personal = 1,
        Technical = 2,
        Leadership = 3,
        Business = 4
    }
}
