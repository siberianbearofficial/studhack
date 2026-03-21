using System.ComponentModel.DataAnnotations;

namespace StudHack.Api.Dtos;

public class PortfolioLinkDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    [StringLength(500)] public string? Description { get; init; }

    [StringLength(500)] public required string Link { get; init; }
}