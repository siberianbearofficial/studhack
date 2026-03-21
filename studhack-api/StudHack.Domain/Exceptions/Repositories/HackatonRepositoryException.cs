namespace StudHack.Domain.Exceptions.Repositories;

public class HackatonRepositoryException : Exception
{
    public HackatonRepositoryException(string message)
        : base(message)
    {
    }

    public HackatonRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}