using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class HackatonConverter
{
    public static HackatonDb ToDb(this Hackaton domain)
    {
        return new HackatonDb(domain.Id, domain.EventId, domain.MaxTeamSize, domain.MinTeamSize);
    }

    public static Hackaton ToDomain(this HackatonDb db)
    {
        return new Hackaton(db.Id, db.EventId, db.MaxTeamSize, db.MinTeamSize);
    }
}
