using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class SubscriptionConverter
{
    public static Subscription ToDomain(this SubscriptionDb db)
    {
        return new Subscription(db.EventId, db.UserId, db.CreatedAt);
    }
}
