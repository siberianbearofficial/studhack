namespace StudHack.Api.Dtos;

public class TeamMemberDto
{
    public Guid PositionId { get; init; }
    public required string Title { get; init; }
    public bool IsCaptain { get; init; }
    public bool IsMandatoryRole { get; init; }
    public required UserShortDto User { get; init; }
}