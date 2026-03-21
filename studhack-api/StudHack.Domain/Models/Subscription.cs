using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class Subscription
{
    internal Subscription() { }

    public Subscription(Guid id, Guid eventId, Guid userId, DateTime createdAt)
    {
        Id = id;
        EventId = eventId;
        UserId = userId;
        CreatedAt = createdAt;
    }

    [Required]
    public Guid Id { get; init; }

    [Required]
    public Guid EventId { get; init; }

    [Required]
    public Guid UserId { get; init; }

    [Required]
    public DateTime CreatedAt { get; init; }
}