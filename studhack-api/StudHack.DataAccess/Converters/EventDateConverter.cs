using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class EventDateConverter
{
    public static EventDate ToDomain(this EventDateDb db)
    {
        return new EventDate(db.EventId, db.StartsAt, db.EndsAt, db.Description);
    }
}
