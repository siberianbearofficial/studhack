using Eventity.DataAccess.Models;
using Eventity.Domain.Models;
using StudHack.DataAccess;
using StudHack.Domain;

namespace Eventity.DataAccess.Converters;

public static class EducationConverter
{
    public static Education ToDomain(this EducationDb db)
    {
        return new Education(
            db.Id,
            db.UserId,
            db.University.ToDomain(),
            (EducationDegree)db.Degree,
            db.Faculty,
            db.YearStart,
            db.YearEnd);
    }
}
