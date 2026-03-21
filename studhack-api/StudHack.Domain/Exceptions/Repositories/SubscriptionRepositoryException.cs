namespace StudHack.Domain.Exceptions.Repositories;

public class SubscriptionRepositoryException : Exception
{
    public SubscriptionRepositoryException(string message)
        : base(message)
    {
    }

    public SubscriptionRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}