namespace StudHack.Domain.Exceptions.Repositories;

public class AdditionalPositionDataRepositoryException : Exception
{
    public AdditionalPositionDataRepositoryException(string message)
        : base(message)
    {
    }

    public AdditionalPositionDataRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}