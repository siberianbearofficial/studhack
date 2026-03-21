namespace FillDatabase.Models;

public class CityModel
{
    public required string Name { get; init; }
    public required int Population { get; init; }
    public required string Subject { get; init; }
    public required string District { get; init; }
}