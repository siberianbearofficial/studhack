using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class PortfolioLinkConverter
{
    public static PortfolioLink ToDomain(this PortfolioLinkDb db)
    {
        return new PortfolioLink(db.Id, db.UserId, db.Link, db.Description);
    }
}
