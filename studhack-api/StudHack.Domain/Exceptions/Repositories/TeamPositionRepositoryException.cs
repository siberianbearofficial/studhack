namespace StudHack.Domain.Exceptions.Repositories;

public class TeamPositionRepositoryException : Exception
{
    public TeamPositionRepositoryException(string message)
        : base(message)
    {
    }

    public TeamPositionRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}