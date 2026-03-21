namespace StudHack.Domain.Exceptions.Repositories;

public class EducationRepositoryException : Exception
{
    public EducationRepositoryException(string message)
        : base(message)
    {
    }

    public EducationRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}