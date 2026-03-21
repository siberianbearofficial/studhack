using System.Linq;
using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class AdditionalPositionDataConverter
{ 
    public static AdditionalPositionData ToDomain(this AdditionalPositionDataDb db)
    {
        return new AdditionalPositionData(
            db.Id,
            db.SpecializationId,
            db.AdditionalPositionSkills.Select(x => x.Skill.ToDomain()).ToList());
    }
}