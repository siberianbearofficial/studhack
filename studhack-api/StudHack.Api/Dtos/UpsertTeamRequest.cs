namespace StudHack.Api.Dtos;

public class UpsertTeamRequest
{
    public Guid? Id { get; init; }
    public Guid HackatonId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public Guid? CaptainUserId { get; init; }
    public IEnumerable<UpsertTeamPositionInput> Positions { get; init; } = [];
}