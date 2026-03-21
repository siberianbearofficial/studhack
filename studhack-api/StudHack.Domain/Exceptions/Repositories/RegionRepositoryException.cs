namespace StudHack.Domain.Exceptions.Repositories;

public class RegionRepositoryException : Exception
{
    public RegionRepositoryException(string message)
        : base(message)
    {
    }

    public RegionRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}