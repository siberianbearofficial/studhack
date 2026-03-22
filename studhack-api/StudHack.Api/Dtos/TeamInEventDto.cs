namespace StudHack.Api.Dtos;

public class TeamInEventDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required UserShortDto Creator { get; init; }
    public UserShortDto? Captain { get; init; }
    public int MemberCount { get; init; }
    public int OpenPositionsCount { get; init; }
    public required MandatoryCoverageDto MandatoryCoverage { get; init; }
    public IEnumerable<TeamMemberDto> Members { get; init; } = [];
    public IEnumerable<TeamPositionDto> Positions { get; init; } = [];
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
