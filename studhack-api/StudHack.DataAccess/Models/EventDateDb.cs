using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class EventDateDb
{
    internal EventDateDb() { }

    public EventDateDb(Guid id, Guid eventId, DateTime startsAt, DateTime endsAt, string? description)
    {
        Id = id;
        EventId = eventId;
        StartsAt = startsAt;
        EndsAt = endsAt;
        Description = description;
    }

    public Guid Id { get; set; }
    
    [Required]
    public Guid EventId { get; set; }

    public string? Description { get; set; }

    [Required]
    public DateTime StartsAt { get; set; }

    [Required]
    public DateTime EndsAt { get; set; }

    public virtual EventDb Event { get; set; }
}