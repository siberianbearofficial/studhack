namespace StudHack.Domain.Exceptions.Repositories;

public class SpecializationRepositoryException : Exception
{
    public SpecializationRepositoryException(string message)
        : base(message)
    {
    }

    public SpecializationRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}