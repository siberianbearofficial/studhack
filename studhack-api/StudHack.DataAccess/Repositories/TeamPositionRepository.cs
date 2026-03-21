using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class TeamPositionRepository : ITeamPositionRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<TeamPositionRepository> _logger;

    public TeamPositionRepository(StudHackDbContext context, ILogger<TeamPositionRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<TeamPosition?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var teamPositionDb = await _context.TeamPositions
                .Include(tp => tp.AdditionalPositionData)
                .ThenInclude(ap => ap.AdditionalPositionSkills)
                .ThenInclude(aps => aps.Skill)
                .Include(tp => tp.MandatoryPositionData)
                .ThenInclude(mp => mp.MandatoryPositionSkills)
                .ThenInclude(mps => mps.Skill)
                .AsNoTracking()
                .FirstOrDefaultAsync(tp => tp.Id == id, ct);

            return teamPositionDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve team position with id: {TeamPositionId}", id);
            throw new TeamPositionRepositoryException("Failed to retrieve team position", ex);
        }
    }

    public async Task<IEnumerable<TeamPosition>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var teamPositionsDb = await _context.TeamPositions
                .Include(tp => tp.AdditionalPositionData)
                .ThenInclude(ap => ap.AdditionalPositionSkills)
                .ThenInclude(aps => aps.Skill)
                .Include(tp => tp.MandatoryPositionData)
                .ThenInclude(mp => mp.MandatoryPositionSkills)
                .ThenInclude(mps => mps.Skill)
                .AsNoTracking()
                .ToListAsync(ct);

            return teamPositionsDb.Select(tp => tp.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve team positions");
            throw new TeamPositionRepositoryException("Failed to retrieve team positions", ex);
        }
    }

    public async Task<TeamPosition> AddAsync(TeamPosition teamPosition, CancellationToken ct = default)
    {
        try
        {
            await _context.TeamPositions.AddAsync(teamPosition.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return teamPosition;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add team position: {@TeamPosition}", teamPosition);
            throw new TeamPositionRepositoryException("Failed to add team position", ex);
        }
    }

    public async Task<TeamPosition> UpdateAsync(TeamPosition teamPosition, CancellationToken ct = default)
    {
        try
        {
            var teamPositionDb = await _context.TeamPositions.FirstOrDefaultAsync(tp => tp.Id == teamPosition.Id, ct);

            if (teamPositionDb is null)
            {
                throw new TeamPositionRepositoryException($"TeamPosition with id {teamPosition.Id} not found");
            }

            _context.Entry(teamPositionDb).CurrentValues.SetValues(teamPosition.ToDb());
            await _context.SaveChangesAsync(ct);
            return teamPosition;
        }
        catch (TeamPositionRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update team position: {@TeamPosition}", teamPosition);
            throw new TeamPositionRepositoryException("Failed to update team position", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var teamPositionDb = await _context.TeamPositions.FirstOrDefaultAsync(tp => tp.Id == id, ct);

            if (teamPositionDb is null)
            {
                return false;
            }

            _context.TeamPositions.Remove(teamPositionDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete team position with id: {TeamPositionId}", id);
            throw new TeamPositionRepositoryException("Failed to delete team position", ex);
        }
    }
}