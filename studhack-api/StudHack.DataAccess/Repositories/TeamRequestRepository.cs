using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class TeamRequestRepository : ITeamRequestRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<TeamRequestRepository> _logger;

    public TeamRequestRepository(StudHackDbContext context, ILogger<TeamRequestRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<TeamRequest?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var teamRequestDb = await _context.TeamRequests.AsNoTracking().FirstOrDefaultAsync(tr => tr.Id == id, ct);
            return teamRequestDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve team request with id: {TeamRequestId}", id);
            throw new TeamRequestRepositoryException("Failed to retrieve team request", ex);
        }
    }

    public async Task<IEnumerable<TeamRequest>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var teamRequestsDb = await _context.TeamRequests.AsNoTracking().ToListAsync(ct);
            return teamRequestsDb.Select(tr => tr.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve team requests");
            throw new TeamRequestRepositoryException("Failed to retrieve team requests", ex);
        }
    }

    public async Task<TeamRequest> AddAsync(TeamRequest teamRequest, CancellationToken ct = default)
    {
        try
        {
            await _context.TeamRequests.AddAsync(teamRequest.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return teamRequest;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add team request: {@TeamRequest}", teamRequest);
            throw new TeamRequestRepositoryException("Failed to add team request", ex);
        }
    }

    public async Task<TeamRequest> UpdateAsync(TeamRequest teamRequest, CancellationToken ct = default)
    {
        try
        {
            var teamRequestDb = await _context.TeamRequests.FirstOrDefaultAsync(tr => tr.Id == teamRequest.Id, ct);

            if (teamRequestDb is null)
            {
                throw new TeamRequestRepositoryException($"TeamRequest with id {teamRequest.Id} not found");
            }

            _context.Entry(teamRequestDb).CurrentValues.SetValues(teamRequest.ToDb());
            await _context.SaveChangesAsync(ct);
            return teamRequest;
        }
        catch (TeamRequestRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update team request: {@TeamRequest}", teamRequest);
            throw new TeamRequestRepositoryException("Failed to update team request", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var teamRequestDb = await _context.TeamRequests.FirstOrDefaultAsync(tr => tr.Id == id, ct);

            if (teamRequestDb is null)
            {
                return false;
            }

            _context.TeamRequests.Remove(teamRequestDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete team request with id: {TeamRequestId}", id);
            throw new TeamRequestRepositoryException("Failed to delete team request", ex);
        }
    }
}