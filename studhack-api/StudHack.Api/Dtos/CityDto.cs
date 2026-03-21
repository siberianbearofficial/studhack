namespace StudHack.Api.Dtos;

public class CityDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required Guid RegionId { get; init; }
}