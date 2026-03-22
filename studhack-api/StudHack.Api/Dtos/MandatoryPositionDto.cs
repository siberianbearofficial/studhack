namespace StudHack.Api.Dtos;

public class MandatoryPositionDto
{
    public Guid Id { get; init; }
    public required string Title { get; init; }
    public required SpecializationDto Specialization { get; init; }
    public IEnumerable<SkillDto> RequiredSkills { get; init; } = [];
}
