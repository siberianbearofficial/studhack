using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class TeamConverter
{
    public static TeamDb ToDb(this Team domain)
    {
        var db = new TeamDb(
            domain.Id,
            domain.HackatonId,
            domain.CaptainId,
            domain.CreatorId,
            domain.Name,
            domain.Description)
        {
            CreatedAt = domain.CreatedAt,
            UpdatedAt = domain.UpdatedAt ?? domain.CreatedAt
        };

        foreach (var teamPosition in domain.TeamPositions)
        {
            db.TeamPositions.Add(teamPosition.ToDb());
        }

        return db;
    }

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
