using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class HackatonConverter
{
    public static HackatonDb ToDb(this Hackaton domain, Guid eventId)
    {
        return new HackatonDb(domain.Id, domain.MaxTeamSize, domain.MinTeamSize, eventId);
    }

    public static Hackaton ToDomain(this HackatonDb db)
    {
        return new Hackaton(db.Id, db.MaxTeamSize, db.MinTeamSize);
    }
}
