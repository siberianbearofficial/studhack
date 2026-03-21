using StudHack.Api.Dtos;
using StudHack.Domain.Models;

namespace StudHack.Api.Extensions;

public static class UniversityConverter
{
    public static UniversityDto ToDto(this University university)
    {
        return new UniversityDto
        {
            Id = university.Id,
            Name = university.Name,
            City = university.City.ToDto(),
        };
    }
}