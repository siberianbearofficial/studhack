using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class SpecializationRepository : ISpecializationRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<SpecializationRepository> _logger;

    public SpecializationRepository(StudHackDbContext context, ILogger<SpecializationRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Specialization?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var specializationDb = await _context.Specializations
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id, ct);

            return specializationDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve specialization with id: {SpecializationId}", id);
            throw new SpecializationRepositoryException("Failed to retrieve specialization", ex);
        }
    }

    public async Task<IEnumerable<Specialization>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var specializationsDb = await _context.Specializations.AsNoTracking().ToListAsync(ct);
            return specializationsDb.Select(s => s.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve specializations");
            throw new SpecializationRepositoryException("Failed to retrieve specializations", ex);
        }
    }

    public async Task<Specialization> AddAsync(Specialization specialization, CancellationToken ct = default)
    {
        try
        {
            await _context.Specializations.AddAsync(specialization.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return specialization;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add specialization: {@Specialization}", specialization);
            throw new SpecializationRepositoryException("Failed to add specialization", ex);
        }
    }

    public async Task<Specialization> UpdateAsync(Specialization specialization, CancellationToken ct = default)
    {
        try
        {
            var specializationDb = await _context.Specializations
                .FirstOrDefaultAsync(s => s.Id == specialization.Id, ct);

            if (specializationDb is null)
            {
                throw new SpecializationRepositoryException($"Specialization with id {specialization.Id} not found");
            }

            _context.Entry(specializationDb).CurrentValues.SetValues(specialization.ToDb());
            await _context.SaveChangesAsync(ct);
            return specialization;
        }
        catch (SpecializationRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update specialization: {@Specialization}", specialization);
            throw new SpecializationRepositoryException("Failed to update specialization", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var specializationDb = await _context.Specializations.FirstOrDefaultAsync(s => s.Id == id, ct);

            if (specializationDb is null)
            {
                return false;
            }

            _context.Specializations.Remove(specializationDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete specialization with id: {SpecializationId}", id);
            throw new SpecializationRepositoryException("Failed to delete specialization", ex);
        }
    }
}