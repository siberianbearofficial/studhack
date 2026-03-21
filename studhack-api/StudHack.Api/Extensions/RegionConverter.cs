using StudHack.Api.Dtos;
using StudHack.Domain.Models;

namespace StudHack.Api.Extensions;

public static class RegionConverter
{
    public static RegionDto ToDto(this Region region)
    {
        return new RegionDto
        {
            Id = region.Id,
            Name = region.Name,
        };
    }

    public static Region ToDomain(this RegionDto dto)
    {
        return new Region(dto.Id, dto.Name);
    }
}