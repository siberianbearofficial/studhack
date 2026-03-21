using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class CityConverter
{
    public static CityDb ToDb(this City domain)
    {
        return new CityDb(domain.Id, domain.Name, domain.Region.Id);
    }

    public static City ToDomain(this CityDb db)
    {
        return new City(db.Id, db.Name, db.Region.ToDomain());
    }
}
