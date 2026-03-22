using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class UpsertEventRequest
{
    public Guid? Id { get; init; }
    public required string Name { get; init; }
    public EventTypeDto Type { get; init; }
    public string? Description { get; init; }
    public string? RegistrationLink { get; init; }
    public DateTime StartsAt { get; init; }
    public DateTime EndsAt { get; init; }
    public required UpsertEventLocationInput Location { get; init; }
    public IEnumerable<UpsertEventStageInput> Stages { get; init; } = [];
    public UpsertHackathonInput? Hackathon { get; init; }
}

public class UpsertEventLocationInput
{
    public EventFormatDto Format { get; init; }
    public Guid? CityId { get; init; }
    public string? AddressText { get; init; }
    public string? VenueName { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}

public class UpsertHackathonInput
{
    public int MinTeamSize { get; init; }
    public int MaxTeamSize { get; init; }
    public IEnumerable<UpsertMandatoryPositionInput> MandatoryPositions { get; init; } = [];
}
