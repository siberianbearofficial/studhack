using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class EventDateConverter
{
    public static EventDateDb ToDb(this EventDate domain)
    {
        return new EventDateDb(domain.Id, domain.EventId, domain.StartsAt, domain.EndsAt, domain.Description);
    }

    public static EventDate ToDomain(this EventDateDb db)
    {
        return new EventDate(db.Id, db.EventId, db.StartsAt, db.EndsAt, db.Description);
    }
}
