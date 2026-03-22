namespace StudHack.Api.Dtos;

public class TeamRequestsFeedDto
{
    public IEnumerable<TeamRequestDto> Inbox { get; init; } = [];
    public IEnumerable<TeamRequestDto> Outbox { get; init; } = [];
    public IEnumerable<TeamRequestDto> ManagedTeams { get; init; } = [];
}