using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class SkillRepository : ISkillRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<SkillRepository> _logger;

    public SkillRepository(StudHackDbContext context, ILogger<SkillRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Skill?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var skillDb = await _context.Skills.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, ct);
            return skillDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve skill with id: {SkillId}", id);
            throw new SkillRepositoryException("Failed to retrieve skill", ex);
        }
    }

    public async Task<IEnumerable<Skill>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var skillsDb = await _context.Skills.AsNoTracking().ToListAsync(ct);
            return skillsDb.Select(s => s.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve skills");
            throw new SkillRepositoryException("Failed to retrieve skills", ex);
        }
    }

    public async Task<Skill> AddAsync(Skill skill, CancellationToken ct = default)
    {
        try
        {
            await _context.Skills.AddAsync(skill.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return skill;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add skill: {@Skill}", skill);
            throw new SkillRepositoryException("Failed to add skill", ex);
        }
    }

    public async Task<Skill> UpdateAsync(Skill skill, CancellationToken ct = default)
    {
        try
        {
            var skillDb = await _context.Skills.FirstOrDefaultAsync(s => s.Id == skill.Id, ct);

            if (skillDb is null)
            {
                throw new SkillRepositoryException($"Skill with id {skill.Id} not found");
            }

            _context.Entry(skillDb).CurrentValues.SetValues(skill.ToDb());
            await _context.SaveChangesAsync(ct);
            return skill;
        }
        catch (SkillRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update skill: {@Skill}", skill);
            throw new SkillRepositoryException("Failed to update skill", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var skillDb = await _context.Skills.FirstOrDefaultAsync(s => s.Id == id, ct);

            if (skillDb is null)
            {
                return false;
            }

            _context.Skills.Remove(skillDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete skill with id: {SkillId}", id);
            throw new SkillRepositoryException("Failed to delete skill", ex);
        }
    }
}