using StudHack.Domain.Models;
using StudHack.Api.Dtos;
using StudHack.Api.Enums;
using StudHack.Domain.Enums;

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
            Degree = (EducationDegreeDto)education.Degree,
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
            Degree = (EducationDegree)dto.Degree,
            YearStart = dto.YearStart,
            YearEnd = dto.YearEnd,
        };
    }
}