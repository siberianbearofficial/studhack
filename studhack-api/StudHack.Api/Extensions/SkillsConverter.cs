using StudHack.Domain.Models;
using StudHack.Api.Dtos;
using StudHack.Api.Enums;
using StudHack.Domain;
using StudHack.Domain.Enums;

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

    public static UserSkillDto ToDto(this UserSkill skill)
    {
        return new UserSkillDto
        {
            Id = skill.Id,
            Name = skill.Name,
            Level = (SkillLevelDto)skill.Level,
        };
    }

    public static UserSkill ToDomain(this UserSkillDto dto)
    {
        return new UserSkill(dto.Id, dto.Name, (ExperienceLevel)dto.Level);
    }
}