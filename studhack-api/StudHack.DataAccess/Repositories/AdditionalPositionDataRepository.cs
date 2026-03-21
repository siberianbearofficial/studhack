using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.DataAccess.Models;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class AdditionalPositionDataRepository : IAdditionalPositionDataRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<AdditionalPositionDataRepository> _logger;

    public AdditionalPositionDataRepository(StudHackDbContext context, ILogger<AdditionalPositionDataRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<AdditionalPositionData?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var additionalPositionDataDb = await _context.AdditionalPositionDataItems
                .Include(ap => ap.AdditionalPositionSkills)
                .ThenInclude(aps => aps.Skill)
                .AsNoTracking()
                .FirstOrDefaultAsync(ap => ap.Id == id, ct);

            return additionalPositionDataDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve additional position data with id: {AdditionalPositionDataId}", id);
            throw new AdditionalPositionDataRepositoryException("Failed to retrieve additional position data", ex);
        }
    }

    public async Task<ICollection<AdditionalPositionData>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var additionalPositionDataDb = await _context.AdditionalPositionDataItems
                .Include(ap => ap.AdditionalPositionSkills)
                .ThenInclude(aps => aps.Skill)
                .AsNoTracking()
                .ToListAsync(ct);

            return additionalPositionDataDb.Select(ap => ap.ToDomain()).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve additional position data items");
            throw new AdditionalPositionDataRepositoryException("Failed to retrieve additional position data items", ex);
        }
    }

    public async Task<AdditionalPositionData> AddAsync(AdditionalPositionData additionalPositionData, CancellationToken ct = default)
    {
        try
        {
            await _context.AdditionalPositionDataItems.AddAsync(additionalPositionData.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return additionalPositionData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add additional position data: {@AdditionalPositionData}", additionalPositionData);
            throw new AdditionalPositionDataRepositoryException("Failed to add additional position data", ex);
        }
    }

    public async Task<AdditionalPositionData> UpdateAsync(AdditionalPositionData additionalPositionData, CancellationToken ct = default)
    {
        try
        {
            var additionalPositionDataDb = await _context.AdditionalPositionDataItems
                .Include(ap => ap.AdditionalPositionSkills)
                .FirstOrDefaultAsync(ap => ap.Id == additionalPositionData.Id, ct);

            if (additionalPositionDataDb is null)
            {
                throw new AdditionalPositionDataRepositoryException(
                    $"AdditionalPositionData with id {additionalPositionData.Id} not found");
            }

            additionalPositionDataDb.SpecializationId = additionalPositionData.SpecializationId;

            var newSkillIds = additionalPositionData.Skills.Select(s => s.Id).Distinct().ToHashSet();
            var currentSkillIds = additionalPositionDataDb.AdditionalPositionSkills.Select(s => s.SkillId).ToHashSet();

            var toDelete = additionalPositionDataDb.AdditionalPositionSkills
                .Where(s => !newSkillIds.Contains(s.SkillId))
                .ToList();
            _context.AdditionalPositionSkills.RemoveRange(toDelete);

            var toAdd = newSkillIds
                .Where(skillId => !currentSkillIds.Contains(skillId))
                .Select(skillId => new AdditionalPositionSkillDb(additionalPositionData.Id, skillId));

            await _context.AdditionalPositionSkills.AddRangeAsync(toAdd, ct);
            await _context.SaveChangesAsync(ct);
            return additionalPositionData;
        }
        catch (AdditionalPositionDataRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update additional position data: {@AdditionalPositionData}", additionalPositionData);
            throw new AdditionalPositionDataRepositoryException("Failed to update additional position data", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var additionalPositionDataDb = await _context.AdditionalPositionDataItems
                .FirstOrDefaultAsync(ap => ap.Id == id, ct);

            if (additionalPositionDataDb is null)
            {
                return false;
            }

            _context.AdditionalPositionDataItems.Remove(additionalPositionDataDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete additional position data with id: {AdditionalPositionDataId}", id);
            throw new AdditionalPositionDataRepositoryException("Failed to delete additional position data", ex);
        }
    }
}