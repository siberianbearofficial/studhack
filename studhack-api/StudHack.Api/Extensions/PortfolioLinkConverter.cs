using StudHack.Domain.Models;
using StudHack.Api.Dtos;

namespace StudHack.Api.Extensions;

public static class PortfolioLinkConverter
{
    public static PortfolioLinkDto ToDto(this PortfolioLink portfolioLink)
    {
        return new PortfolioLinkDto
        {
            Id = portfolioLink.Id,
            Link = portfolioLink.Link,
            Description = portfolioLink.Description,
        };
    }

    public static PortfolioLink ToDomain(this PortfolioLinkDto dto)
    {
        return new PortfolioLink(dto.Id, dto.Link, dto.Description);
    }
}