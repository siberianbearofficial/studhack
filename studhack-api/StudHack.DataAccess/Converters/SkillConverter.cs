using StudHack.DataAccess.Models;
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
}
