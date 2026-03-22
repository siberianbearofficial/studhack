namespace StudHack.Domain.Models;

public class TeamFullModel
{
    public required Team Team { get; init; }
    public Event? Event { get; init; }
    public City? EventCity { get; init; }
    public DateTime? EventStartsAt { get; init; }
    public DateTime? EventEndsAt { get; init; }
    public User? Creator { get; init; }
    public User? Captain { get; init; }
    public IReadOnlyCollection<TeamPositionFullModel> Positions { get; init; } = [];
    public IReadOnlyCollection<TeamMemberFullModel> Members { get; init; } = [];
}

public class TeamPositionFullModel
{
    public required TeamPosition Position { get; init; }
    public Specialization? Specialization { get; init; }
    public IReadOnlyCollection<Skill> RequiredSkills { get; init; } = [];
    public User? User { get; init; }
    public IReadOnlyCollection<TeamRequestFullModel> Requests { get; init; } = [];
}

public class TeamMemberFullModel
{
    public required TeamPosition Position { get; init; }
    public required User User { get; init; }
}