using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class HackatonRepository : IHackatonRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<HackatonRepository> _logger;

    public HackatonRepository(StudHackDbContext context, ILogger<HackatonRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Hackaton?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var hackatonDb = await _context.Hackatons.AsNoTracking().FirstOrDefaultAsync(h => h.Id == id, ct);
            return hackatonDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve hackaton with id: {HackatonId}", id);
            throw new HackatonRepositoryException("Failed to retrieve hackaton", ex);
        }
    }

    public async Task<IEnumerable<Hackaton>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var hackatonsDb = await _context.Hackatons.AsNoTracking().ToListAsync(ct);
            return hackatonsDb.Select(h => h.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve hackatons");
            throw new HackatonRepositoryException("Failed to retrieve hackatons", ex);
        }
    }

    public async Task<Hackaton> AddAsync(Hackaton hackaton, CancellationToken ct = default)
    {
        try
        {
            var eventExists = await _context.Events.AnyAsync(e => e.Id == hackaton.Id, ct);
            if (!eventExists)
            {
                throw new HackatonRepositoryException(
                    $"Cannot add hackaton: event with id {hackaton.Id} was not found. " +
                    "This repository expects EventId to match Hackaton Id.");
            }

            await _context.Hackatons.AddAsync(hackaton.ToDb(hackaton.Id), ct);
            await _context.SaveChangesAsync(ct);
            return hackaton;
        }
        catch (HackatonRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add hackaton: {@Hackaton}", hackaton);
            throw new HackatonRepositoryException("Failed to add hackaton", ex);
        }
    }

    public async Task<Hackaton> UpdateAsync(Hackaton hackaton, CancellationToken ct = default)
    {
        try
        {
            var hackatonDb = await _context.Hackatons.FirstOrDefaultAsync(h => h.Id == hackaton.Id, ct);

            if (hackatonDb is null)
            {
                throw new HackatonRepositoryException($"Hackaton with id {hackaton.Id} not found");
            }

            hackatonDb.MaxTeamSize = hackaton.MaxTeamSize;
            hackatonDb.MinTeamSize = hackaton.MinTeamSize;
            await _context.SaveChangesAsync(ct);
            return hackaton;
        }
        catch (HackatonRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update hackaton: {@Hackaton}", hackaton);
            throw new HackatonRepositoryException("Failed to update hackaton", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var hackatonDb = await _context.Hackatons.FirstOrDefaultAsync(h => h.Id == id, ct);

            if (hackatonDb is null)
            {
                return false;
            }

            _context.Hackatons.Remove(hackatonDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete hackaton with id: {HackatonId}", id);
            throw new HackatonRepositoryException("Failed to delete hackaton", ex);
        }
    }
}