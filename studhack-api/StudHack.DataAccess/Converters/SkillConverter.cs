using StudHack.DataAccess.Models;
using StudHack.Domain;
using StudHack.Domain.Enums;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SkillConverter
{
    public static SkillDb ToDb(this Skill domain)
    {
        return new SkillDb(domain.Id, domain.Name);
    }

    public static Skill ToDomain(this SkillDb db)
    {
        return new Skill(db.Id, db.Name);
    }

    public static UserSkill ToDomain(this UserSkillDb db)
    {
        return new UserSkill(db.SkillId, db.Skill.Name, (ExperienceLevel)db.ExperienceLevel);
    }

    public static UserSkillDb ToDb(this UserSkill skill, Guid userId)
    {
        return new UserSkillDb(userId, skill.Id, (ExperienceLevelDb)skill.Level);
    }
}
