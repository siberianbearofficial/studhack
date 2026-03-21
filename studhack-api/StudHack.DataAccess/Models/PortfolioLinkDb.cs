using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class PortfolioLinkDb
{
    internal PortfolioLinkDb() { }

    public PortfolioLinkDb(Guid id, string link, string? description)
    {
        Id = id;
        Link = link;
        Description = description;
    }

    public Guid Id { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    [StringLength(500)]
    public string Link { get; set; }

    public virtual UserDb User { get; set; }
}