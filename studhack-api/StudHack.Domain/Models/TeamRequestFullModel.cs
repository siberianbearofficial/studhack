namespace StudHack.Domain.Models;

public class TeamRequestFullModel
{
    public required TeamRequest TeamRequest { get; init; }
    public required User User { get; init; }
    public required Team Team { get; init; }
    public required TeamPosition TeamPosition { get; init; }
    public Specialization? PositionSpecialization { get; init; }
}