namespace StudHack.Api.Dtos;

public class UpsertEventStageInput
{
    public Guid? Id { get; init; }
    public required string Code { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public DateTime? StartsAt { get; init; }
    public DateTime? EndsAt { get; init; }
    public int Order { get; init; }
}
