namespace StudHack.Domain.Models;

public class UpsertTeamModel
{
    public Guid? Id { get; init; }
    public Guid EventId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public Guid? CaptainUserId { get; init; }
    public IReadOnlyCollection<UpsertTeamPositionModel> Positions { get; init; } = [];
}

public class UpsertTeamPositionModel
{
    public Guid? Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public Guid? MandatoryPositionId { get; init; }
    public Guid? SpecializationId { get; init; }
    public IReadOnlyCollection<Guid> RequiredSkillIds { get; init; } = [];
    public bool FilledByExternal { get; init; }
    public Guid? UserId { get; init; }
}