namespace StudHack.Domain.Models;

public class SentMessage
{
    internal SentMessage() { }

    public SentMessage(Guid idEventDate, Guid idSubscription, string message)
    {
        IdEventDate = idEventDate;
        IdSubscription = idSubscription;
        Message = message;
    }

    public Guid IdEventDate { get; }
    public Guid IdSubscription { get; }
    public string Message { get; }
}