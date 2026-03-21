namespace StudHack.Domain.Exceptions.Repositories;

public class EventRepositoryException : Exception
{
    public EventRepositoryException(string message)
        : base(message)
    {
    }

    public EventRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}