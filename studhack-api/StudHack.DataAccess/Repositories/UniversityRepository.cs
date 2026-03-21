using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class UniversityRepository : IUniversityRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<UniversityRepository> _logger;

    public UniversityRepository(StudHackDbContext context, ILogger<UniversityRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<University?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var universityDb = await _context.Universities.AsNoTracking()
                .Where(e => e.Id == id)
                .Include(e => e.City).ThenInclude(e => e.Region)
                .FirstOrDefaultAsync(ct);
            return universityDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve university with id: {UniversityId}", id);
            throw new UniversityRepositoryException("Failed to retrieve university", ex);
        }
    }

    public async Task<IEnumerable<University>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var universitiesDb = await _context.Universities
                .Include(e => e.City).ThenInclude(e => e.Region)
                .AsNoTracking()
                .ToListAsync(ct);
            return universitiesDb.Select(u => u.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve universities");
            throw new UniversityRepositoryException("Failed to retrieve universities", ex);
        }
    }

    public async Task<University> AddAsync(University university, CancellationToken ct = default)
    {
        try
        {
            await _context.Universities.AddAsync(university.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return university;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add university: {@University}", university);
            throw new UniversityRepositoryException("Failed to add university", ex);
        }
    }

    public async Task<University> UpdateAsync(University university, CancellationToken ct = default)
    {
        try
        {
            var universityDb = await _context.Universities.FirstOrDefaultAsync(u => u.Id == university.Id, ct);

            if (universityDb is null)
            {
                throw new UniversityRepositoryException($"University with id {university.Id} not found");
            }

            _context.Entry(universityDb).CurrentValues.SetValues(university.ToDb());
            await _context.SaveChangesAsync(ct);
            return university;
        }
        catch (UniversityRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update university: {@University}", university);
            throw new UniversityRepositoryException("Failed to update university", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var universityDb = await _context.Universities.FirstOrDefaultAsync(u => u.Id == id, ct);

            if (universityDb is null)
            {
                return false;
            }

            _context.Universities.Remove(universityDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete university with id: {UniversityId}", id);
            throw new UniversityRepositoryException("Failed to delete university", ex);
        }
    }
}