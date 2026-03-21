using System.Linq;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;
using StudHack.Domain;

namespace StudHack.DataAccess.Converters;

public static class EventConverter
{
    public static EventDb ToDb(this Event domain)
    {
        var db = new EventDb(
            domain.Id,
            domain.Title,
            domain.Description,
            domain.CityId,
            domain.Address,
            (EventTypeDb)domain.Type,
            domain.RegistrationLink,
            (EventFormatDb)domain.Format,
            domain.Latitude,
            domain.Longitude)
        {
            CreatedAt = domain.CreatedAt,
            UpdatedAt = domain.UpdatedAt
        };

        if (domain.Hackaton is not null)
        {
            db.Hackaton = domain.Hackaton.ToDb();
        }

        foreach (var eventDate in domain.EventDates)
        {
            db.EventDates.Add(eventDate.ToDb());
        }

        return db;
    }

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
