using StudHack.DataAccess.Models;
using StudHack.Domain.Models;
using StudHack.Domain;

namespace StudHack.DataAccess.Converters;

public static class TeamRequestConverter
{
    public static TeamRequestDb ToDb(this TeamRequest domain)
    {
        return new TeamRequestDb(
            domain.Id,
            domain.TeamPositionId,
            domain.UserId,
            (TeamRequestTypeDb)domain.Type,
            (TeamRequestStatusDb)domain.Status,
            domain.Message)
        {
            CreatedAt = domain.CreatedAt,
            ResolvedAt = domain.ResolvedAt
        };
    }

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
