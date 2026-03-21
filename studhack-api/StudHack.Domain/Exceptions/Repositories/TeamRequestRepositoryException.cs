namespace StudHack.Domain.Exceptions.Repositories;

public class TeamRequestRepositoryException : Exception
{
    public TeamRequestRepositoryException(string message)
        : base(message)
    {
    }

    public TeamRequestRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}