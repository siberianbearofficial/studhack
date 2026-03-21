using System.Linq;
using Eventity.DataAccess.Models;
using Eventity.Domain.Models;

namespace Eventity.DataAccess.Converters;

public static class UserConverter
{
    public static User ToDomain(this UserDb db)
    {
        return new User(
            db.Id,
            db.UniqueName,
            db.DisplayedName,
            db.BirthDate,
            db.Available,
            db.CityOfResidenceId,
            db.MainSpecializationId,
            db.AuthId,
            db.AvatarUrl,
            db.Email,
            db.Biography,
            db.CreatedAt,
            db.UpdatedAt,
            db.CityOfResidence?.ToDomain(),
            db.UserSkills.Select(x => x.Skill.ToDomain()).ToList(),
            db.UserSpecializations.Select(x => x.Specialization.ToDomain()).ToList(),
            db.PortfolioLinks.Select(x => x.ToDomain()).ToList(),
            db.Educations.Select(x => x.ToDomain()).ToList());
    }
}
