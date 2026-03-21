using StudHack.Domain.Models;
using StudHack.Api.Dtos;

namespace StudHack.Api.Extensions;

public static class CityConverter
{
    public static CityDto ToDto(this City city)
    {
        return new CityDto
        {
            Id = city.Id,
            Name = city.Name,
            Region = city.Region.ToDto(),
        };
    }

    public static City ToDomain(this CityDto dto)
    {
        return new City(dto.Id, dto.Name, dto.Region.ToDomain());
    }
}