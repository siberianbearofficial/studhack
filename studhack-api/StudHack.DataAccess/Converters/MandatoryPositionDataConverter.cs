using System.Linq;
using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

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
