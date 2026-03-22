using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class SentMessageConverter
{
    public static SentMessages ToDomain(this SentMessageDb db)
    {
        return new SentMessages(db.IdEventDate, db.IdSubscription, db.Message);
    }
}
