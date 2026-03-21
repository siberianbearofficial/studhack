using StudHack.DataAccess.Models;
using StudHack.Domain.Models;
using StudHack.Domain;

namespace StudHack.DataAccess.Converters;

public static class TeamPositionConverter
{
    public static TeamPosition ToDomain(this TeamPositionDb db)
    {
        return new TeamPosition(
            db.Id,
            db.TeamId,
            db.FilledByExternal,
            (TeamPositionType)db.Type,
            db.UserId,
            db.AdditionalPositionData?.ToDomain(),
            db.MandatoryPositionData?.ToDomain());
    }
}
