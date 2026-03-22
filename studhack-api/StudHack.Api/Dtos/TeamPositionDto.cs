namespace StudHack.Api.Dtos;

public class TeamPositionDto
{
    public Guid Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public required SpecializationDto Specialization { get; init; }
    public IEnumerable<SkillDto> RequiredSkills { get; init; } = [];
    public Guid? MandatoryPositionId { get; init; }
    public bool IsMandatory { get; init; }
    public bool FilledByExternal { get; init; }
    public UserShortDto? User { get; init; }
    public IEnumerable<TeamRequestShortDto> Requests { get; init; } = [];
}