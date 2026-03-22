namespace StudHack.Api.Dtos;

public class UpsertTeamPositionInput
{
    public Guid? Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public Guid? MandatoryPositionId { get; init; }
    public Guid? SpecializationId { get; init; }
    public IEnumerable<Guid>? RequiredSkillIds { get; init; }
    public bool? FilledByExternal { get; init; }
    public Guid? UserId { get; init; }
}