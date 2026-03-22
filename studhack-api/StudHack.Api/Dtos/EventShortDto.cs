using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class EventShortDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public EventTypeDto Type { get; init; }
    public DateTime StartsAt { get; init; }
    public DateTime EndsAt { get; init; }
    public EventFormatDto Format { get; init; }
    public CityDto? City { get; init; }
}