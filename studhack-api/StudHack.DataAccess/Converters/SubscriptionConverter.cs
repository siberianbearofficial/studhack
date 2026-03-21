using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SubscriptionConverter
{
    public static SubscriptionDb ToDb(this Subscription domain)
    {
        return new SubscriptionDb(domain.Id, domain.EventId, domain.UserId)
        {
            CreatedAt = domain.CreatedAt
        };
    }

    public static Subscription ToDomain(this SubscriptionDb db)
    {
        return new Subscription(db.Id, db.EventId, db.UserId, db.CreatedAt);
    }
}
