using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class SubscriptionDb
{
    internal SubscriptionDb() { }

    public SubscriptionDb(Guid id, Guid eventId, Guid userId)
    {
        Id = id;
        EventId = eventId;
        UserId = userId;
    }

    [Required]
    public Guid Id { get; set; }

    [Required]
    public Guid EventId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public virtual EventDb Event { get; set; }
    public virtual UserDb User { get; set; }
}