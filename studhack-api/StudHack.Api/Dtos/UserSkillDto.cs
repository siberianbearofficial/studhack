using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class UserSkillDto
{
    public Guid Id { get; init; }

    [StringLength(100)] public required string Name { get; init; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required SkillLevelDto Level { get; init; }
}