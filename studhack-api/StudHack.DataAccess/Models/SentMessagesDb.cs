using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class SentMessageDb
{
    internal SentMessageDb() { }

    public SentMessageDb(Guid idEventDate, Guid idSubscription)
    {
        IdEventDate = idEventDate;
        IdSubscription = idSubscription;
    }

    public Guid IdEventDate { get; set; }
    public Guid IdSubscription { get; set; }
    public virtual EventDateDb EventDate { get; set; }
    public virtual SubscriptionDb Subscription { get; set; }
}