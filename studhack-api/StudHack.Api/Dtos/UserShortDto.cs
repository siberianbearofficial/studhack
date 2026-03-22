namespace StudHack.Api.Dtos;

public class UserShortDto
{
    public Guid Id { get; init; }
    public required string UniqueName { get; init; }
    public required string DisplayName { get; init; }
    public string? AvatarUrl { get; init; }
}