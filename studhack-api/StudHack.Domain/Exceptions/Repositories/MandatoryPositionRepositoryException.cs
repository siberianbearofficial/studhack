namespace StudHack.Domain.Exceptions.Repositories;

public class MandatoryPositionRepositoryException : Exception
{
    public MandatoryPositionRepositoryException(string message)
        : base(message)
    {
    }

    public MandatoryPositionRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}