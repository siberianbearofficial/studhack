using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SentMessageConverter
{
    public static SentMessage ToDomain(this SentMessageDb db)
    {
        return new SentMessage(db.IdEventDate, db.IdSubscription);
    }
}
