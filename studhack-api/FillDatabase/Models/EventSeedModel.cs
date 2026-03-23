namespace FillDatabase.Models;

public class EventSeedModel
{
    public required string Name { get; init; }
    public required string Type { get; init; }
    public string? Description { get; init; }
    public string? RegistrationLink { get; init; }
    public DateTime StartsAt { get; init; }
    public DateTime EndsAt { get; init; }
    public required EventLocationSeedModel Location { get; init; }
    public EventStageSeedModel[] Stages { get; init; } = [];
    public HackathonSeedModel? Hackathon { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public class EventLocationSeedModel
{
    public required string Format { get; init; }
    public string[] CityNames { get; init; } = [];
    public string? AddressText { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}

public class EventStageSeedModel
{
    public required string Title { get; init; }
    public DateTime StartsAt { get; init; }
    public DateTime EndsAt { get; init; }
}

public class HackathonSeedModel
{
    public int MinTeamSize { get; init; }
    public int MaxTeamSize { get; init; }
    public MandatoryPositionSeedModel[] MandatoryPositions { get; init; } = [];
}

public class MandatoryPositionSeedModel
{
    public required string SpecializationName { get; init; }
    public string[] RequiredSkillNames { get; init; } = [];
}
