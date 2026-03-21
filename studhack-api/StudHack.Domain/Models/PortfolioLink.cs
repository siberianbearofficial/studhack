using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class PortfolioLink
{
    internal PortfolioLink() { }

    public PortfolioLink(Guid id, string link, string? description)
    {
        Id = id;
        Link = link;
        Description = description;
    }

    public Guid Id { get; init; }

    [StringLength(500)]
    public string? Description { get; init; }

    [Required]
    [StringLength(500)]
    public string Link { get; init; }
}