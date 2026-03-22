namespace StudHack.Api.Dtos;

public class TeamShortDto
{
    public Guid Id { get; init; }
    public Guid HackatonId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public UserShortDto? Captain { get; init; }
    public int MemberCount { get; init; }
    public int OpenPositionsCount { get; init; }
}