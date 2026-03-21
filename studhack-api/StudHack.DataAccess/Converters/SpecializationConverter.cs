using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SpecializationConverter
{
    public static Specialization ToDomain(this SpecializationDb db)
    {
        return new Specialization(db.Id, db.Name);
    }
}
