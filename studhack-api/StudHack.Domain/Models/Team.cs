using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class Team
{
    internal Team() { }

    public Team(Guid id, 
        Guid hackatonId,
        Guid captainId,
        Guid creatorId, 
        string name, 
        string? description,
        DateTime createdAt,
        DateTime? updatedAt,
        IEnumerable<TeamPosition> teamPositions)
    {
        Id = id;
        HackatonId = hackatonId;
        CaptainId = captainId;
        CreatorId = creatorId;
        Name = name;
        Description = description;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        TeamPositions = teamPositions;
    }

    public Guid Id { get; init; }

    [Required]
    public Guid HackatonId { get; init; }

    [Required]
    public Guid CaptainId { get; init; }

    [Required]
    public Guid CreatorId { get; init; }

    public string? Description { get; init; }

    [Required]
    [StringLength(100)]
    public string Name { get; init; }

    [Required]
    public DateTime CreatedAt { get; init; }

    [Required]
    public DateTime? UpdatedAt { get; init; }

    public IEnumerable<TeamPosition> TeamPositions { get; init; }
}