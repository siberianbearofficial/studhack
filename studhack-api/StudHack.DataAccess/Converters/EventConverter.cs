using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;
using StudHack.Domain;

namespace StudHack.DataAccess.Converters;

public static class EventConverter
{
    public static Event ToDomain(this EventDb db)
    {
        return new Event(
            db.Id,
            db.Title,
            db.Description,
            db.CityId,
            db.Address,
            (EventType)db.Type,
            db.RegistrationLink,
            (EventFormat)db.Format,
            db.Latitude,
            db.Longitude,
            db.CreatedAt,
            db.UpdatedAt,
            db.Hackaton?.ToDomain(),
            db.EventDates.Select(x => x.ToDomain()).ToList());
    }
}
