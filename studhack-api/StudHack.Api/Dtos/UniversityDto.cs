using System.ComponentModel.DataAnnotations;

namespace StudHack.Api.Dtos;

public class UniversityDto
{
    public Guid Id { get; init; }

    [StringLength(200)] public required string Name { get; init; }

    public required CityDto City { get; init; }
}