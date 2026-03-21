namespace StudHack.Domain.Exceptions.Repositories;

public class PortfolioLinkRepositoryException : Exception
{
    public PortfolioLinkRepositoryException(string message)
        : base(message)
    {
    }

    public PortfolioLinkRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}