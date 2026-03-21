using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SubscriptionConverter
{
    public static Subscription ToDomain(this SubscriptionDb db)
    {
        return new Subscription(db.EventId, db.UserId, db.CreatedAt);
    }
}
