namespace StudHack.Domain.Exceptions.Repositories;

public class EventDateRepositoryException : Exception
{
    public EventDateRepositoryException(string message)
        : base(message)
    {
    }

    public EventDateRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}