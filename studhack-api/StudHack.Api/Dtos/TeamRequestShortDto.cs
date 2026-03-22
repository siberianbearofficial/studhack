using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class TeamRequestShortDto
{
    public Guid Id { get; init; }
    public TeamRequestTypeDto Type { get; init; }
    public TeamRequestStatusDto Status { get; init; }
    public string? Message { get; init; }
    public required UserShortDto User { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? ResolvedAt { get; init; }
}