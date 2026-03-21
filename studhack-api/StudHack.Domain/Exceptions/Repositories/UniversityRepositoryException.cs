namespace StudHack.Domain.Exceptions.Repositories;

public class UniversityRepositoryException : Exception
{
    public UniversityRepositoryException(string message)
        : base(message)
    {
    }

    public UniversityRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}