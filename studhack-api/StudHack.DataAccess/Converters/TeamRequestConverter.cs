using StudHack.DataAccess.Models;
using StudHack.Domain.Models;
using StudHack.Domain;

namespace StudHack.DataAccess.Converters;

public static class TeamRequestConverter
{
    public static TeamRequest ToDomain(this TeamRequestDb db)
    {
        return new TeamRequest(
            db.Id,
            db.TeamPositionId,
            db.UserId,
            (TeamRequestType)db.Type,
            (TeamRequestStatus)db.Status,
            db.Message,
            db.CreatedAt,
            db.ResolvedAt);
    }
}
