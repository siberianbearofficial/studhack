using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.DataAccess.Models;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class MandatoryPositionRepository : IMandatoryPositionRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<MandatoryPositionRepository> _logger;

    public MandatoryPositionRepository(StudHackDbContext context, ILogger<MandatoryPositionRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<MandatoryPositionData?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var mandatoryPositionDb = await _context.MandatoryPositions
                .Include(mp => mp.MandatoryPositionSkills)
                .ThenInclude(mps => mps.Skill)
                .AsNoTracking()
                .FirstOrDefaultAsync(mp => mp.Id == id, ct);

            return mandatoryPositionDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve mandatory position with id: {MandatoryPositionId}", id);
            throw new MandatoryPositionRepositoryException("Failed to retrieve mandatory position", ex);
        }
    }

    public async Task<IEnumerable<MandatoryPositionData>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var mandatoryPositionsDb = await _context.MandatoryPositions
                .Include(mp => mp.MandatoryPositionSkills)
                .ThenInclude(mps => mps.Skill)
                .AsNoTracking()
                .ToListAsync(ct);

            return mandatoryPositionsDb.Select(mp => mp.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve mandatory positions");
            throw new MandatoryPositionRepositoryException("Failed to retrieve mandatory positions", ex);
        }
    }

    public async Task<MandatoryPositionData> AddAsync(MandatoryPositionData mandatoryPositionData, CancellationToken ct = default)
    {
        try
        {
            await _context.MandatoryPositions.AddAsync(mandatoryPositionData.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return mandatoryPositionData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add mandatory position: {@MandatoryPosition}", mandatoryPositionData);
            throw new MandatoryPositionRepositoryException("Failed to add mandatory position", ex);
        }
    }

    public async Task<MandatoryPositionData> UpdateAsync(MandatoryPositionData mandatoryPositionData, CancellationToken ct = default)
    {
        try
        {
            var mandatoryPositionDb = await _context.MandatoryPositions
                .Include(mp => mp.MandatoryPositionSkills)
                .FirstOrDefaultAsync(mp => mp.Id == mandatoryPositionData.Id, ct);

            if (mandatoryPositionDb is null)
            {
                throw new MandatoryPositionRepositoryException(
                    $"MandatoryPosition with id {mandatoryPositionData.Id} not found");
            }

            mandatoryPositionDb.HackatonId = mandatoryPositionData.HackatonId;
            mandatoryPositionDb.SpecializationId = mandatoryPositionData.SpecializationId;

            var newSkillIds = mandatoryPositionData.Skills.Select(s => s.Id).Distinct().ToHashSet();
            var currentSkillIds = mandatoryPositionDb.MandatoryPositionSkills.Select(s => s.SkillId).ToHashSet();

            var toDelete = mandatoryPositionDb.MandatoryPositionSkills
                .Where(s => !newSkillIds.Contains(s.SkillId))
                .ToList();
            _context.MandatoryPositionSkills.RemoveRange(toDelete);

            var toAdd = newSkillIds
                .Where(skillId => !currentSkillIds.Contains(skillId))
                .Select(skillId => new MandatoryPositionSkillDb(mandatoryPositionData.Id, skillId));

            await _context.MandatoryPositionSkills.AddRangeAsync(toAdd, ct);
            await _context.SaveChangesAsync(ct);
            return mandatoryPositionData;
        }
        catch (MandatoryPositionRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update mandatory position: {@MandatoryPosition}", mandatoryPositionData);
            throw new MandatoryPositionRepositoryException("Failed to update mandatory position", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var mandatoryPositionDb = await _context.MandatoryPositions.FirstOrDefaultAsync(mp => mp.Id == id, ct);

            if (mandatoryPositionDb is null)
            {
                return false;
            }

            _context.MandatoryPositions.Remove(mandatoryPositionDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete mandatory position with id: {MandatoryPositionId}", id);
            throw new MandatoryPositionRepositoryException("Failed to delete mandatory position", ex);
        }
    }
}