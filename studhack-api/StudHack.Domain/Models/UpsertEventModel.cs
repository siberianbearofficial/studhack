namespace StudHack.Domain.Models;

public class UpsertEventModel
{
    public Guid? Id { get; init; }
    public required string Name { get; init; }
    public EventType Type { get; init; }
    public string? Description { get; init; }
    public string? RegistrationLink { get; init; }
    public DateTime StartsAt { get; init; }
    public DateTime EndsAt { get; init; }
    public required UpsertEventLocationModel Location { get; init; }
    public IReadOnlyCollection<UpsertEventStageModel> Stages { get; init; } = [];
    public UpsertHackathonModel? Hackathon { get; init; }
}

public class UpsertEventLocationModel
{
    public EventFormat Format { get; init; }
    public Guid? CityId { get; init; }
    public string? AddressText { get; init; }
    public string? VenueName { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}

public class UpsertEventStageModel
{
    public Guid? Id { get; init; }
    public required string Code { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public DateTime? StartsAt { get; init; }
    public DateTime? EndsAt { get; init; }
    public int Order { get; init; }
}

public class UpsertHackathonModel
{
    public int MinTeamSize { get; init; }
    public int MaxTeamSize { get; init; }
    public IReadOnlyCollection<UpsertMandatoryPositionModel> MandatoryPositions { get; init; } = [];
}

public class UpsertMandatoryPositionModel
{
    public Guid? Id { get; init; }
    public required string Title { get; init; }
    public Guid SpecializationId { get; init; }
    public IReadOnlyCollection<Guid> RequiredSkillIds { get; init; } = [];
}
