using System.ComponentModel.DataAnnotations;

namespace StudHack.Api.Dtos;

public class SkillDto
{
    public Guid Id { get; init; }

    [StringLength(100)] public required string Name { get; init; }
}