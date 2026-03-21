using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class PortfolioLinkConverter
{
    public static PortfolioLinkDb ToDb(this PortfolioLink domain)
    {
        return new PortfolioLinkDb(domain.Id, domain.Link, domain.Description);
    }

    public static PortfolioLink ToDomain(this PortfolioLinkDb db)
    {
        return new PortfolioLink(db.Id, db.Link, db.Description);
    }
}
