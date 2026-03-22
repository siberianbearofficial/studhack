using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class EventFullDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public EventTypeDto Type { get; init; }
    public string? Description { get; init; }
    public string? RegistrationLink { get; init; }
    public required EventLocationDto Location { get; init; }
    public DateTime StartsAt { get; init; }
    public DateTime EndsAt { get; init; }
    public IEnumerable<EventStageDto> Stages { get; init; } = [];
    public HackathonDetailsDto? Hackathon { get; init; }
    public required EventSubscriptionDto Subscription { get; init; }
    public IEnumerable<TeamInEventDto> Teams { get; init; } = [];
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
