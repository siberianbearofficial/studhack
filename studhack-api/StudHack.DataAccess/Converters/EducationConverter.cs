using StudHack.DataAccess.Models;
using StudHack.Domain.Models;
using StudHack.Domain.Enums;

namespace StudHack.DataAccess.Converters;

public static class EducationConverter
{
    public static Education ToDomain(this EducationDb db)
    {
        return new Education
        {
            Id = db.Id,
            UniversityId = db.UniversityId,
            Degree = (EducationDegree)db.Degree,
            Faculty = db.Faculty,
            YearStart = db.YearStart,
            YearEnd = db.YearEnd
        };
    }
}