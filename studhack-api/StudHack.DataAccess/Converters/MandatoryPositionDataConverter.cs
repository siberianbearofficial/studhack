using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class MandatoryPositionDataConverter
{
    public static MandatoryPositionData ToDomain(this MandatoryPositionDb db)
    {
        return new MandatoryPositionData(
            db.Id,
            db.HackatonId,
            db.SpecializationId,
            db.MandatoryPositionSkills.Select(x => x.Skill.ToDomain()).ToList());
    }
}
