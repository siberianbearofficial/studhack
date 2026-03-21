using System.Linq;
using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

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
