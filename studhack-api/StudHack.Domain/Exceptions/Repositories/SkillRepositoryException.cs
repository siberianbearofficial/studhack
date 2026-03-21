namespace StudHack.Domain.Exceptions.Repositories;

public class SkillRepositoryException : Exception
{
    public SkillRepositoryException(string message)
        : base(message)
    {
    }

    public SkillRepositoryException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}