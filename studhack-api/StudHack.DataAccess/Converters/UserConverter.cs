using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Converters;

public static class UserConverter
{
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
            Skills = db.UserSkills.Select(e => e.Skill.ToDomain()).ToList(),
            Specializations = db.UserSpecializations.Select(e => e.Specialization.ToDomain()).ToList(),
            Educations = db.Educations.Select(EducationConverter.ToDomain).ToList(),
        };
    }
}
