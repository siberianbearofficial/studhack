using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class EventDateConverter
{
    public static EventDate ToDomain(this EventDateDb db)
    {
        return new EventDate(db.EventId, db.StartsAt, db.EndsAt, db.Description);
    }
}
