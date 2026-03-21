using StudHack.DataAccess.Models;
using StudHack.Domain.Models;
using StudHack.Domain;

namespace StudHack.DataAccess.Converters;

public static class TeamPositionConverter
{
    public static TeamPositionDb ToDb(this TeamPosition domain)
    {
        return new TeamPositionDb(
            domain.Id,
            domain.TeamId,
            domain.FilledByExternal,
            (TeamPositionTypeDb)domain.Type,
            domain.UserId,
            domain.AddPositionData?.Id,
            domain.MandPositionData?.Id);
    }

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
