using StudHack.Domain.Models;
using StudHack.Api.Dtos;

namespace StudHack.Api.Extensions;

public static class EducationConverter
{
    public static EducationDto ToDto(this Education education)
    {
        return new EducationDto
        {
            Id = education.Id,
            UniversityId = education.UniversityId,
            Faculty = education.Faculty,
            YearStart = education.YearStart,
            YearEnd = education.YearEnd,
        };
    }

    public static Education ToDomain(this EducationDto dto)
    {
        return new Education
        {
            Id = dto.Id,
            UniversityId = dto.UniversityId,
            Faculty = dto.Faculty,
            YearStart = dto.YearStart,
            YearEnd = dto.YearEnd,
        };
    }
}