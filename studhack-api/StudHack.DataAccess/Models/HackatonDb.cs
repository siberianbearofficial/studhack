using System.ComponentModel.DataAnnotations;

namespace Eventity.DataAccess.Models;

public class HackatonDb
{
    internal HackatonDb() { }

    public HackatonDb(Guid id, int maxTeamSize, int minTeamSize, Guid eventId)
    {
        Id = id;
        MaxTeamSize = maxTeamSize;
        MinTeamSize = minTeamSize;
        EventId = eventId;
    }

    public Guid Id { get; set; }

    [Required]
    public int MaxTeamSize { get; set; }

    [Required]
    public int MinTeamSize { get; set; }

    [Required]
    public Guid EventId { get; set; }

    public virtual EventDb Event { get; set; }

    public virtual ICollection<TeamDb> Teams { get; set; } = new List<TeamDb>();
    public virtual ICollection<MandatoryPositionDb> MandatoryPositions { get; set; } = new List<MandatoryPositionDb>();
}