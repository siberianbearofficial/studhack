using System.ComponentModel.DataAnnotations;

namespace Eventity.DataAccess.Models;

public class PortfolioLinkDb
{
    internal PortfolioLinkDb() { }

    public PortfolioLinkDb(Guid id, Guid userId, string link, string? description)
    {
        Id = id;
        UserId = userId;
        Link = link;
        Description = description;
    }

    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    [StringLength(500)]
    public string Link { get; set; }

    public virtual UserDb User { get; set; }
}