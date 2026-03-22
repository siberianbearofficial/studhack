namespace StudHack.Domain.Models;

public class TeamRequestFeedModel
{
    public IReadOnlyCollection<TeamRequestFullModel> Inbox { get; init; } = [];
    public IReadOnlyCollection<TeamRequestFullModel> Outbox { get; init; } = [];
    public IReadOnlyCollection<TeamRequestFullModel> ManagedTeams { get; init; } = [];
}