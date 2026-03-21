using System.ComponentModel.DataAnnotations;

namespace Eventity.Domain.Models;

public class PortfolioLink
{
    internal PortfolioLink() { }

    public PortfolioLink(Guid id, Guid userId, string link, string? description)
    {
        Id = id;
        UserId = userId;
        Link = link;
        Description = description;
    }

    public Guid Id { get; init; }

    [Required]
    public Guid UserId { get; init; }

    [StringLength(500)]
    public string? Description { get; init; }

    [Required]
    [StringLength(500)]
    public string Link { get; init; }
}