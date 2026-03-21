namespace StudHack.Api.Dtos;

public class DictionariesDto
{
    public IEnumerable<CityDto> Cities { get; init; } = [];
    public IEnumerable<RegionDto> Regions { get; init; } = [];
    public IEnumerable<SkillDto> Skills { get; init; } = [];
    public IEnumerable<SpecializationDto> Specializations { get; init; } = [];
    public IEnumerable<UniversityDto> Universities { get; init; } = [];
}