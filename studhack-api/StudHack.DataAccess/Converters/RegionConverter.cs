using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class RegionConverter
{
    public static RegionDb ToDb(this Region domain)
    {
        return new RegionDb(domain.Id, domain.Name);
    }

    public static Region ToDomain(this RegionDb db)
    {
        return new Region(db.Id, db.Name);
    }
}
