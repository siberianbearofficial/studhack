namespace StudHack.Domain.Exceptions.Repositories;

public class CityRepositoryException : Exception
{
    public CityRepositoryException(string message)
        : base(message)
    {
    }

    public CityRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}