using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class HackatonConverter
{
    public static Hackaton ToDomain(this HackatonDb db)
    {
        return new Hackaton(db.Id, db.MaxTeamSize, db.MinTeamSize);
    }
}
