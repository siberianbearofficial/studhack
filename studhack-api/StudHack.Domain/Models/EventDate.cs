using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class EventDate
{
    internal EventDate() { }

    public EventDate(Guid eventId, DateTime startsAt, DateTime endsAt, string? description)
    {
        EventId = eventId;
        StartsAt = startsAt;
        EndsAt = endsAt;
        Description = description;
    }

    [Required]
    public Guid EventId { get; init; }

    public string? Description { get; init; }

    [Required]
    public DateTime StartsAt { get; init; }

    [Required]
    public DateTime EndsAt { get; init; }
}