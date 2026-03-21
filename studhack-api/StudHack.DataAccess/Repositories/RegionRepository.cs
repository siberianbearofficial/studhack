using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class RegionRepository : IRegionRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<RegionRepository> _logger;

    public RegionRepository(StudHackDbContext context, ILogger<RegionRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Region?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var regionDb = await _context.Regions.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id, ct);
            return regionDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve region with id: {RegionId}", id);
            throw new RegionRepositoryException("Failed to retrieve region", ex);
        }
    }

    public async Task<IEnumerable<Region>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var regionsDb = await _context.Regions.AsNoTracking().ToListAsync(ct);
            return regionsDb.Select(r => r.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve regions");
            throw new RegionRepositoryException("Failed to retrieve regions", ex);
        }
    }

    public async Task<Region> AddAsync(Region region, CancellationToken ct = default)
    {
        try
        {
            await _context.Regions.AddAsync(region.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return region;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add region: {@Region}", region);
            throw new RegionRepositoryException("Failed to add region", ex);
        }
    }

    public async Task<Region> UpdateAsync(Region region, CancellationToken ct = default)
    {
        try
        {
            var regionDb = await _context.Regions.FirstOrDefaultAsync(r => r.Id == region.Id, ct);

            if (regionDb is null)
            {
                throw new RegionRepositoryException($"Region with id {region.Id} not found");
            }

            _context.Entry(regionDb).CurrentValues.SetValues(region.ToDb());
            await _context.SaveChangesAsync(ct);
            return region;
        }
        catch (RegionRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update region: {@Region}", region);
            throw new RegionRepositoryException("Failed to update region", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var regionDb = await _context.Regions.FirstOrDefaultAsync(r => r.Id == id, ct);

            if (regionDb is null)
            {
                return false;
            }

            _context.Regions.Remove(regionDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete region with id: {RegionId}", id);
            throw new RegionRepositoryException("Failed to delete region", ex);
        }
    }
}