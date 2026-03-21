using System.ComponentModel.DataAnnotations;

namespace StudHack.Api.Dtos;

public class SpecializationDto
{
    public Guid Id { get; init; }

    [StringLength(100)]
    public required string Name { get; init; }
}