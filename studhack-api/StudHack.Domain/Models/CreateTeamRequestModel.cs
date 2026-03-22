namespace StudHack.Domain.Models;

public class CreateTeamRequestModel
{
    public Guid TeamPositionId { get; init; }
    public TeamRequestType Type { get; init; }
    public Guid? InvitedUserId { get; init; }
    public string? Message { get; init; }
}