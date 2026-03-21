using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class SentMessage
{
    internal SentMessage() { }

    public SentMessage(Guid idEventDate, Guid idSubscription)
    {
        IdEventDate = idEventDate;
        IdSubscription = idSubscription;
    }

    public Guid IdEventDate { get; }
    public Guid IdSubscription { get; }
}