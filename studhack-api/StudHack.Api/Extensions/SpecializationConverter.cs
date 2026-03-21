using Eventity.Domain.Models;
using StudHack.Api.Dtos;

namespace StudHack.Api.Extensions;

public static class SpecializationConverter
{
    public static Specialization ToDomain(this SpecializationDto dto)
    {
        return new Specialization(dto.Id, dto.Name);
    }

    public static SpecializationDto ToDto(this Specialization specialization)
    {
        return new SpecializationDto
        {
            Id = specialization.Id,
            Name = specialization.Name,
        };
    }
}