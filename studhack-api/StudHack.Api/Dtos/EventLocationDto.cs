using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class EventLocationDto
{
    public EventFormatDto Format { get; init; }
    public CityDto? City { get; init; }
    public string? AddressText { get; init; }
    public string? VenueName { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}