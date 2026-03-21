using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SkillConverter
{
    public static Skill ToDomain(this SkillDb db)
    {
        return new Skill(db.Id, db.Name);
    }
}