using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class SkillConverter
{
    public static Skill ToDomain(this SkillDb db)
    {
        return new Skill(db.Id, db.Name);
    }
}
