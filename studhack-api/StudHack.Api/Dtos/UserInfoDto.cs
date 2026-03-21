namespace StudHack.Api.Dtos;

public class UserInfoDto
{
    public Guid? Id { get; init; }
    public string? UniqueName { get; init; }
    public string? DisplayName { get; init; }
    public DateTime? BirthDate { get; init; }
    public bool Available { get; init; }
    public CityDto? CityOfResidence { get; init; }
    public string? AvatarUrl { get; init; }
    public string? Email { get; init; }
    public string? Biography { get; init; }
    public IEnumerable<SkillDto> Skills { get; init; } = [];
    public IEnumerable<SpecializationDto> Specializations { get; init; } = [];
    public IEnumerable<PortfolioLinkDto> PortfolioLinks { get; init; } = [];
    public IEnumerable<EducationDto> Education { get; init; } = [];
    public DateTime? CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}