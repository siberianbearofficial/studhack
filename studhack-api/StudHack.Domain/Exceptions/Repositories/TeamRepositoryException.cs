namespace StudHack.Domain.Exceptions.Repositories;

public class TeamRepositoryException : Exception
{
    public TeamRepositoryException(string message)
        : base(message)
    {
    }

    public TeamRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}