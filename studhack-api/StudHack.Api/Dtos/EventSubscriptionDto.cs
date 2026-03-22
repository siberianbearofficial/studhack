namespace StudHack.Api.Dtos;

public class EventSubscriptionDto
{
    public bool IsSubscribed { get; init; }
    public DateTime? SubscribedAt { get; init; }
    public int SubscribersCount { get; init; }
}
