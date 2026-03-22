namespace StudHack.Api.Dtos;

public class HackathonDetailsDto
{
    public Guid EventId { get; init; }
    public int MinTeamSize { get; init; }
    public int MaxTeamSize { get; init; }
    public IEnumerable<MandatoryPositionDto> MandatoryPositions { get; init; } = [];
}
