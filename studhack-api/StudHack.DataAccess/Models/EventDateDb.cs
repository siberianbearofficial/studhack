using System.ComponentModel.DataAnnotations;

namespace Eventity.DataAccess.Models;

public class EventDateDb
{
    internal EventDateDb() { }

    public EventDateDb(Guid eventId, DateTime startsAt, DateTime endsAt, string? description)
    {
        EventId = eventId;
        StartsAt = startsAt;
        EndsAt = endsAt;
        Description = description;
    }

    [Required]
    public Guid EventId { get; set; }

    public string? Description { get; set; }

    [Required]
    public DateTime StartsAt { get; set; }

    [Required]
    public DateTime EndsAt { get; set; }

    public virtual EventDb Event { get; set; }
}