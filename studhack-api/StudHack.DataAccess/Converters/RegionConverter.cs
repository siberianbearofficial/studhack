using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class RegionConverter
{
    public static Region ToDomain(this RegionDb db)
    {
        return new Region(db.Id, db.Name);
    }
}
