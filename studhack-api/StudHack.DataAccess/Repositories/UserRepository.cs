using Microsoft.EntityFrameworkCore;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.DataAccess.Models;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class UserRepository(StudHackDbContext dbContext) : IUserRepository
{
    public async Task<User?> GetUserByIdAsync(Guid userId, CancellationToken ct = default)
    {
        var db = await dbContext.Users
            .Where(e => e.Id == userId)
            .Include(e => e.UserSkills).ThenInclude(s => s.Skill)
            .Include(e => e.UserSpecializations).ThenInclude(s => s.Specialization)
            .Include(e => e.Educations)
            .Include(e => e.PortfolioLinks)
            .FirstOrDefaultAsync(ct);
        return db?.ToDomain();
    }

    public async Task<User?> GetUserByAuthAsync(Guid authId, CancellationToken ct = default)
    {
        var db = await dbContext.Users
            .Where(e => e.AuthId == authId)
            .Include(e => e.UserSkills).ThenInclude(s => s.Skill)
            .Include(e => e.UserSpecializations).ThenInclude(s => s.Specialization)
            .Include(e => e.Educations)
            .Include(e => e.PortfolioLinks)
            .FirstOrDefaultAsync(ct);
        return db?.ToDomain();
    }

    public async Task<ICollection<User>> GetUsersAsync(CancellationToken ct = default)
    {
        var db = await dbContext.Users
            .Include(e => e.UserSkills).ThenInclude(s => s.Skill)
            .Include(e => e.UserSpecializations).ThenInclude(s => s.Specialization)
            .Include(e => e.Educations)
            .Include(e => e.PortfolioLinks)
            .ToListAsync(ct);
        return db.Select(UserConverter.ToDomain).ToList();
    }

    public async Task<Guid> SaveUserAsync(Guid authId, User user, CancellationToken ct = default)
    {
        var existing = await dbContext.Users
            .Where(e => e.AuthId == authId)
            .Include(e => e.UserSkills).ThenInclude(s => s.Skill)
            .Include(e => e.UserSpecializations).ThenInclude(s => s.Specialization)
            .Include(e => e.Educations)
            .Include(e => e.PortfolioLinks)
            .FirstOrDefaultAsync(ct);

        var id = existing?.Id ?? Guid.NewGuid();
        if (existing == null)
        {
            existing = new UserDb
            {
                Id = id,
                AuthId = authId,
                Available = user.Available,
                UniqueName = user.UniqueName,
                DisplayedName = user.DisplayedName,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl,
                BirthDate = user.BirthDate?.ToUniversalTime(),
                Biography = user.Biography,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            await dbContext.Users.AddAsync(existing, ct);
        }
        else
            await dbContext.Users.ExecuteUpdateAsync(e => e
                .SetProperty(x => x.Available, user.Available)
                .SetProperty(x => x.UniqueName, user.UniqueName)
                .SetProperty(x => x.DisplayedName, user.DisplayedName)
                .SetProperty(x => x.BirthDate, user.BirthDate == null ? null : user.BirthDate.Value.ToUniversalTime())
                .SetProperty(x => x.Email, user.Email)
                .SetProperty(x => x.Biography, user.Biography)
                .SetProperty(x => x.UpdatedAt, DateTime.UtcNow), ct);

        await UpdatePortfolioLinks(existing, user.PortfolioLinks, ct);
        await UpdateEducations(existing, user.Educations, ct);
        await UpdateSkills(existing, user.Skills, ct);
        await UpdateSpecializations(existing, user.Specializations, ct);

        await dbContext.SaveChangesAsync(ct);
        return id;
    }

    private async Task UpdatePortfolioLinks(UserDb user, IEnumerable<PortfolioLink> links, CancellationToken ct)
    {
        var deleted = user.PortfolioLinks
            .Where(e => links.All(link => link.Id != e.Id))
            .Select(e => e.Id);
        await dbContext.PortfolioLinks
            .Where(e => deleted.Contains(e.Id))
            .ExecuteDeleteAsync(ct);

        var added = links
            .Where(e => user.PortfolioLinks.All(link => link.Id != e.Id))
            .Select(e => new PortfolioLinkDb
            {
                Id = e.Id,
                UserId = user.Id,
                Description = e.Description,
                Link = e.Link,
            });
        await dbContext.PortfolioLinks.AddRangeAsync(added, ct);
    }

    private async Task UpdateEducations(UserDb user, IEnumerable<Education> educations, CancellationToken ct)
    {
        var deleted = user.Educations
            .Where(e => educations.All(link => link.Id != e.Id))
            .Select(e => e.Id);
        await dbContext.Educations
            .Where(e => deleted.Contains(e.Id))
            .ExecuteDeleteAsync(ct);

        var added = educations
            .Where(e => user.Educations.All(link => link.Id != e.Id))
            .Select(e => new EducationDb
            {
                Id = e.Id,
                UserId = user.Id,
                UniversityId = e.UniversityId,
                Degree = (EducationDegreeDb)e.Degree,
                Faculty = e.Faculty,
                YearStart = e.YearStart,
                YearEnd = e.YearEnd,
            });
        await dbContext.Educations.AddRangeAsync(added, ct);
    }

    private async Task UpdateSkills(UserDb user, IEnumerable<UserSkill> skills, CancellationToken ct)
    {
        var deleted = user.UserSkills
            .Where(e => skills.All(skill => skill.Id != e.SkillId))
            .Select(e => e.SkillId)
            .ToList();
        await dbContext.UserSkills
            .Where(e => deleted.Contains(e.SkillId))
            .ExecuteDeleteAsync(ct);

        var added = skills
            .Where(e => user.UserSkills.All(skill => skill.SkillId != e.Id))
            .Select(e => new UserSkillDb
            {
                UserId = user.Id,
                SkillId = e.Id
            });
        await dbContext.UserSkills.AddRangeAsync(added, ct);
    }

    private async Task UpdateSpecializations(UserDb user, IEnumerable<Specialization> skills, CancellationToken ct)
    {
        var deleted = user.UserSpecializations
            .Where(e => skills.All(specialization => specialization.Id != e.SpecializationId))
            .Select(e => e.SpecializationId)
            .ToList();
        await dbContext.UserSpecializations
            .Where(e => deleted.Contains(e.SpecializationId))
            .ExecuteDeleteAsync(ct);

        var added = skills
            .Where(e => user.UserSpecializations.All(specialization => specialization.SpecializationId != e.Id))
            .Select(e => new UserSpecializationDb
            {
                UserId = user.Id,
                SpecializationId = e.Id
            });
        await dbContext.UserSpecializations.AddRangeAsync(added, ct);
    }
}