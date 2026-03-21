using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class UniversityConverter
{
    public static UniversityDb ToDb(this University domain)
    {
        return new UniversityDb(domain.Id, domain.Name, domain.CityId);
    }

    public static University ToDomain(this UniversityDb db)
    {
        return new University(db.Id, db.Name, db.CityId);
    }
}
