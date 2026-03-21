using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class TeamDb
{
    internal TeamDb() { }

    public TeamDb(Guid id, Guid hackatonId, Guid captainId, Guid creatorId, string name, string? description)
    {
        Id = id;
        HackatonId = hackatonId;
        CaptainId = captainId;
        CreatorId = creatorId;
        Name = name;
        Description = description;
    }

    public Guid Id { get; set; }

    [Required]
    public Guid HackatonId { get; set; }

    [Required]
    public Guid CaptainId { get; set; }

    [Required]
    public Guid CreatorId { get; set; }

    public string? Description { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    [Required]
    public DateTime UpdatedAt { get; set; }

    public virtual HackatonDb Hackaton { get; set; }
    public virtual UserDb Captain { get; set; }
    public virtual UserDb Creator { get; set; }

    public virtual ICollection<TeamPositionDb> TeamPositions { get; set; } = new List<TeamPositionDb>();
}