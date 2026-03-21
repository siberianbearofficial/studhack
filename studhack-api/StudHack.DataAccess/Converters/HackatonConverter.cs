using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class HackatonConverter
{
    public static Hackaton ToDomain(this HackatonDb db)
    {
        return new Hackaton(db.Id, db.MaxTeamSize, db.MinTeamSize);
    }
}
