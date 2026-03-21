using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class MandatoryPositionDataConverter
{
    public static MandatoryPositionDb ToDb(this MandatoryPositionData domain)
    {
        var db = new MandatoryPositionDb(domain.Id, domain.HackatonId, domain.SpecializationId);

        foreach (var skillId in domain.Skills.Select(x => x.Id).Distinct())
        {
            db.MandatoryPositionSkills.Add(new MandatoryPositionSkillDb(domain.Id, skillId));
        }

        return db;
    }

    public static MandatoryPositionData ToDomain(this MandatoryPositionDb db)
    {
        return new MandatoryPositionData(
            db.Id,
            db.HackatonId,
            db.SpecializationId,
            db.MandatoryPositionSkills.Select(x => x.Skill.ToDomain()).ToList());
    }
}
