using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class RegionConverter
{
    public static Region ToDomain(this RegionDb db)
    {
        return new Region(db.Id, db.Name);
    }
}
