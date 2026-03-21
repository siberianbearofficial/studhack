using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class SpecializationConverter
{
    public static Specialization ToDomain(this SpecializationDb db)
    {
        return new Specialization(db.Id, db.Name);
    }
}
