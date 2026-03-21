using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class PortfolioLinkConverter
{
    public static PortfolioLink ToDomain(this PortfolioLinkDb db)
    {
        return new PortfolioLink(db.Id, db.Link, db.Description);
    }

    public static PortfolioLinkDb ToDb(this PortfolioLink db, Guid userId)
    {
        return new PortfolioLinkDb(db.Id, userId, db.Link, db.Description);
    }
}