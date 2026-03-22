using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class CreateTeamRequestRequest
{
    public Guid TeamPositionId { get; init; }
    public TeamRequestTypeDto Type { get; init; }
    public Guid? InvitedUserId { get; init; }
    public string? Message { get; init; }
}