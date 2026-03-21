using Eventity.Domain.Models;
using StudHack.Api.Dtos;

namespace StudHack.Api.Extensions;

public static class SkillsConverter
{
    public static SkillDto ToDto(this Skill skill)
    {
        return new SkillDto
        {
            Id = skill.Id,
            Name = skill.Name,
        };
    }

    public static Skill ToDomain(this SkillDto dto)
    {
        return new Skill(dto.Id, dto.Name);
    }
}