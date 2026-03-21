using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class UniversityConverter
{
    public static University ToDomain(this UniversityDb db)
    {
        return new University(db.Id, db.Name, db.CityId);
    }
}
