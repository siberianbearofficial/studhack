using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

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