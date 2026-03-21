using Eventity.DataAccess.Models;
using Eventity.Domain.Models;
using StudHack.Domain;

namespace Eventity.DataAccess.Converters;

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
