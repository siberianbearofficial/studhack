using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class SentMessageDb
{
    internal SentMessageDb() { }

    public SentMessageDb(Guid idEventDate, Guid idSubscription, string message)
    {
        IdEventDate = idEventDate;
        IdSubscription = idSubscription;
        Message = message;
    }

    public Guid IdEventDate { get; set; }
    public Guid IdSubscription { get; set; }
    public string Message { get; set; }
    public virtual EventDateDb EventDate { get; set; }
    public virtual SubscriptionDb Subscription { get; set; }
}