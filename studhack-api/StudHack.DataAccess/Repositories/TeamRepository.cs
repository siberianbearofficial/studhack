using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class TeamRepository : ITeamRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<TeamRepository> _logger;

    public TeamRepository(StudHackDbContext context, ILogger<TeamRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Team?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var teamDb = await _context.Teams
                .Include(t => t.TeamPositions)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id, ct);

            return teamDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve team with id: {TeamId}", id);
            throw new TeamRepositoryException("Failed to retrieve team", ex);
        }
    }

    public async Task<IEnumerable<Team>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var teamsDb = await _context.Teams
                .Include(t => t.TeamPositions)
                .AsNoTracking()
                .ToListAsync(ct);

            return teamsDb.Select(t => t.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve teams");
            throw new TeamRepositoryException("Failed to retrieve teams", ex);
        }
    }

    public async Task<Team> AddAsync(Team team, CancellationToken ct = default)
    {
        try
        {
            await _context.Teams.AddAsync(team.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return team;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add team: {@Team}", team);
            throw new TeamRepositoryException("Failed to add team", ex);
        }
    }

    public async Task<Team> UpdateAsync(Team team, CancellationToken ct = default)
    {
        try
        {
            var teamDb = await _context.Teams.FirstOrDefaultAsync(t => t.Id == team.Id, ct);

            if (teamDb is null)
            {
                throw new TeamRepositoryException($"Team with id {team.Id} not found");
            }

            _context.Entry(teamDb).CurrentValues.SetValues(team.ToDb());
            await _context.SaveChangesAsync(ct);
            return team;
        }
        catch (TeamRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update team: {@Team}", team);
            throw new TeamRepositoryException("Failed to update team", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var teamDb = await _context.Teams.FirstOrDefaultAsync(t => t.Id == id, ct);

            if (teamDb is null)
            {
                return false;
            }

            _context.Teams.Remove(teamDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete team with id: {TeamId}", id);
            throw new TeamRepositoryException("Failed to delete team", ex);
        }
    }
}