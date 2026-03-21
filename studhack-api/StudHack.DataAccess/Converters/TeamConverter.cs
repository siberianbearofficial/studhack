using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class TeamConverter
{
    public static Team ToDomain(this TeamDb db)
    {
        return new Team(
            db.Id,
            db.HackatonId,
            db.CaptainId,
            db.CreatorId,
            db.Name,
            db.Description,
            db.CreatedAt,
            db.UpdatedAt,
            db.TeamPositions.Select(x => x.ToDomain()).ToList());
    }
}
