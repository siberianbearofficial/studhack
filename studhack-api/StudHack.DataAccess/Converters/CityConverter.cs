using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class CityConverter
{
    public static City ToDomain(this CityDb db)
    {
        return new City(db.Id, db.Name, db.RegionId);
    }
}
