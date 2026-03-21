using System.ComponentModel.DataAnnotations;
using StudHack.DataAccess;

namespace Eventity.DataAccess.Models;

public class EventDb
{
    internal EventDb() { }

    public EventDb(
        Guid id,
        string title,
        string description,
        Guid cityId,
        string? address,
        EventType type,
        string? registrationLink,
        EventFormat format,
        double latitude,
        double longitude)
    {
        Id = id;
        Title = title;
        Description = description;
        CityId = cityId;
        Address = address;
        Type = type;
        RegistrationLink = registrationLink;
        Format = format;
        Latitude = latitude;
        Longitude = longitude;
    }

    public Guid Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public Guid CityId { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [Required]
    public EventType Type { get; set; }

    [StringLength(500)]
    public string? RegistrationLink { get; set; }

    [Required]
    public EventFormat Format { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    [Required]
    public DateTime UpdatedAt { get; set; }

    [Required]
    public double Latitude { get; set; }

    [Required]
    public double Longitude { get; set; }

    public virtual CityDb City { get; set; }
    public virtual HackatonDb? Hackaton { get; set; }
    
    public virtual ICollection<EventDateDb> EventDates { get; set; } = new List<EventDateDb>();
    public virtual ICollection<SubscriptionDb> Subscriptions { get; set; } = new List<SubscriptionDb>();
}