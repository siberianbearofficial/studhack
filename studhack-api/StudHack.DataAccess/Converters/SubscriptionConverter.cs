using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SubscriptionConverter
{
    public static SubscriptionDb ToDb(this Subscription domain)
    {
        return new SubscriptionDb(domain.EventId, domain.UserId)
        {
            CreatedAt = domain.CreatedAt
        };
    }

    public static Subscription ToDomain(this SubscriptionDb db)
    {
        return new Subscription(db.EventId, db.UserId, db.CreatedAt);
    }
}
