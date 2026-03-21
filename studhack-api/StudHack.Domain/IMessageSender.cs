namespace StudHack.Domain;

public interface IMessageSender
{
    Task Send(string address, string subject, string message);
}
