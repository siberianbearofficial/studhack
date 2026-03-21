using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class AdditionalPositionDataConverter
{
    public static AdditionalPositionDataDb ToDb(this AdditionalPositionData domain)
    {
        var db = new AdditionalPositionDataDb(domain.Id, domain.SpecializationId);

        foreach (var skillId in domain.Skills.Select(x => x.Id).Distinct())
        {
            db.AdditionalPositionSkills.Add(new AdditionalPositionSkillDb(domain.Id, skillId));
        }

        return db;
    }

    public static AdditionalPositionData ToDomain(this AdditionalPositionDataDb db)
    {
        return new AdditionalPositionData(
            db.Id,
            db.SpecializationId,
            db.AdditionalPositionSkills.Select(x => x.Skill.ToDomain()).ToList());
    }
}