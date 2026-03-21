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
            Url = portfolioLink.Link,
            Description = portfolioLink.Description,
        };
    }

    public static PortfolioLink ToDomain(this PortfolioLinkDto dto)
    {
        return new PortfolioLink(dto.Id, dto.Url, dto.Description);
    }
}