namespace StudHack.Api.Dtos;

public class UpdateUserInfoDto
{
    public required string UniqueName { get; init; }
    public required string DisplayName { get; init; }
    public DateTime? BirthDate { get; init; }
    public bool Available { get; init; }
    public required CityDto City { get; init; }
    public string? AvatarUrl { get; init; }
    public required string Email { get; init; }
    public string? Biography { get; init; }
    public SkillDto[] Skills { get; init; } = [];
    public SpecializationDto[] Specializations { get; init; } = [];
    public string[] PortfolioLinks { get; init; } = [];
    public EducationDto[] Education { get; init; } = [];
}