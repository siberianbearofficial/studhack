using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class Hackaton
{
    internal Hackaton() { }

    public Hackaton(Guid id, Guid eventId, int maxTeamSize, int minTeamSize)
    {
        Id = id;
        EventId = eventId;
        MaxTeamSize = maxTeamSize;
        MinTeamSize = minTeamSize;
    }

    public Guid Id { get; init; }
    
    public Guid EventId { get; init; }

    [Required]
    public int MaxTeamSize { get; init; }

    [Required]
    public int MinTeamSize { get; init; }
}