namespace StudHack.Api.Dtos;

public class TeamPositionSummaryDto
{
    public Guid Id { get; init; }
    public required string Title { get; init; }
    public required SpecializationDto Specialization { get; init; }
    public bool IsMandatory { get; init; }
}