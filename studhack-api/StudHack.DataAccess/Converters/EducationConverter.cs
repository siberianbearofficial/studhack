using Eventity.DataAccess.Models;
using Eventity.Domain.Models;
using StudHack.Domain.Enums;

namespace Eventity.DataAccess.Converters;

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