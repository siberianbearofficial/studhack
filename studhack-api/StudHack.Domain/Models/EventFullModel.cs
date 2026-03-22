namespace StudHack.Domain.Models;

public class EventFullModel
{
    public required Event Event { get; init; }
    public City? City { get; init; }
    public IReadOnlyCollection<EventDate> Stages { get; init; } = [];
    public Hackaton? Hackathon { get; init; }
    public IReadOnlyCollection<EventMandatoryPositionFullModel> MandatoryPositions { get; init; } = [];
    public required EventSubscriptionModel Subscription { get; init; }
    public IReadOnlyCollection<TeamFullModel> Teams { get; init; } = [];
}

public class EventMandatoryPositionFullModel
{
    public required MandatoryPositionData MandatoryPosition { get; init; }
    public required Specialization Specialization { get; init; }
}

public class EventSubscriptionModel
{
    public bool IsSubscribed { get; init; }
    public DateTime? SubscribedAt { get; init; }
    public int SubscribersCount { get; init; }
}
