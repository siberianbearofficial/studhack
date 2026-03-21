using System.ComponentModel.DataAnnotations;

namespace Eventity.Domain.Models;

public class Hackaton
{
    internal Hackaton() { }

    public Hackaton(Guid id, int maxTeamSize, int minTeamSize)
    {
        Id = id;
        MaxTeamSize = maxTeamSize;
        MinTeamSize = minTeamSize;
    }

    public Guid Id { get; init; }

    [Required]
    public int MaxTeamSize { get; init; }

    [Required]
    public int MinTeamSize { get; init; }
}