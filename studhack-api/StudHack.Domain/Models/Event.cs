using System.ComponentModel.DataAnnotations;
using StudHack.DataAccess;

namespace Eventity.Domain.Models;

public class Event
{
    internal Event() { }

    public Event(
        Guid id,
        string title,
        string description,
        Guid cityId,
        string? address,
        EventType type,
        string? registrationLink,
        EventFormat format,
        double latitude,
        double longitude,
        DateTime createdAt,
        DateTime updatedAt,
        Hackaton? hackaton = null,
        IEnumerable<EventDate>? eventDates = null)
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
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        Hackaton = hackaton;
        EventDates = eventDates ?? Array.Empty<EventDate>();
    }

    public Guid Id { get; init; }

    [Required]
    [StringLength(100)]
    public string Title { get; init; }

    [Required]
    public string Description { get; init; }

    [Required]
    public Guid CityId { get; init; }

    [StringLength(255)]
    public string? Address { get; init; }

    [Required]
    public EventType Type { get; init; }

    [StringLength(500)]
    public string? RegistrationLink { get; init; }

    [Required]
    public EventFormat Format { get; init; }

    [Required]
    public DateTime CreatedAt { get; init; }

    [Required]
    public DateTime UpdatedAt { get; init; }

    [Required]
    public double Latitude { get; init; }

    [Required]
    public double Longitude { get; init; }

    public Hackaton? Hackaton { get; init; }
    
    public IEnumerable<EventDate> EventDates { get; init; }
}