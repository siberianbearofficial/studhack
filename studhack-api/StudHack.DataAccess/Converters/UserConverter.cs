using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class UserConverter
{
    public static UserDb ToDb(this User domain)
    {
        var db = new UserDb(
            domain.Id,
            domain.UniqueName,
            domain.DisplayedName,
            domain.BirthDate,
            domain.Available,
            domain.CityOfResidenceId,
            domain.AuthId)
        {
            AvatarUrl = domain.AvatarUrl,
            Email = domain.Email,
            Biography = domain.Biography,
            CreatedAt = domain.CreatedAt,
            UpdatedAt = domain.UpdatedAt
        };

        foreach (var skill in domain.Skills)
        {
            db.UserSkills.Add(new UserSkillDb(domain.Id, skill.Id, ExperienceLevelDb.Junior));
        }

        foreach (var specialization in domain.Specializations)
        {
            db.UserSpecializations.Add(new UserSpecializationDb(domain.Id, specialization.Id));
        }

        foreach (var portfolioLink in domain.PortfolioLinks)
        {
            db.PortfolioLinks.Add(portfolioLink.ToDb());
        }

        foreach (var education in domain.Educations)
        {
            db.Educations.Add(education.ToDb(domain.Id));
        }

        return db;
    }

    public static User ToDomain(this UserDb db)
    {
        return new User
        {
            Id = db.Id,
            AuthId = db.AuthId,
            Available = db.Available,
            UniqueName =  db.UniqueName,
            DisplayedName = db.DisplayedName,
            Email = db.Email,
            AvatarUrl =  db.AvatarUrl,
            BirthDate = db.BirthDate,
            Biography =  db.Biography,
            City =  db.CityOfResidence?.ToDomain(),
            PortfolioLinks = db.PortfolioLinks.Select(PortfolioLinkConverter.ToDomain).ToList(),
            Skills = db.UserSkills.Select(e => e.ToDomain()).ToList(),
            Specializations = db.UserSpecializations.Select(e => e.Specialization.ToDomain()).ToList(),
            Educations = db.Educations.Select(EducationConverter.ToDomain).ToList(),
            CreatedAt = db.CreatedAt,
            UpdatedAt = db.UpdatedAt,
        };
    }
}
