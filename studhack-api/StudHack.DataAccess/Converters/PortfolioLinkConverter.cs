using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class PortfolioLinkConverter
{
    public static PortfolioLink ToDomain(this PortfolioLinkDb db)
    {
        return new PortfolioLink(db.Id, db.Link, db.Description);
    }
}
