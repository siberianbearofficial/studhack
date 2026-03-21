using System.ComponentModel.DataAnnotations;

namespace Eventity.Domain.Models;

public class Subscription
{
    internal Subscription() { }

    public Subscription(Guid eventId, Guid userId, DateTime createdAt)
    {
        EventId = eventId;
        UserId = userId;
        CreatedAt = createdAt;
    }

    [Required]
    public Guid EventId { get; init; }

    [Required]
    public Guid UserId { get; init; }

    [Required]
    public DateTime CreatedAt { get; init; }
}