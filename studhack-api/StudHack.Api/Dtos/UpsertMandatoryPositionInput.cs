namespace StudHack.Api.Dtos;

public class UpsertMandatoryPositionInput
{
    public Guid? Id { get; init; }
    public required string Title { get; init; }
    public Guid SpecializationId { get; init; }
    public IEnumerable<Guid> RequiredSkillIds { get; init; } = [];
}
