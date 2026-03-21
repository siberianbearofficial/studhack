using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class EducationRepository : IEducationRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<EducationRepository> _logger;

    public EducationRepository(StudHackDbContext context, ILogger<EducationRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Education?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var educationDb = await _context.Educations.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, ct);
            return educationDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve education with id: {EducationId}", id);
            throw new EducationRepositoryException("Failed to retrieve education", ex);
        }
    }

    public async Task<IEnumerable<Education>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var educationsDb = await _context.Educations.AsNoTracking().ToListAsync(ct);
            return educationsDb.Select(e => e.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve educations");
            throw new EducationRepositoryException("Failed to retrieve educations", ex);
        }
    }

    public async Task<Education> AddAsync(Education education, CancellationToken ct = default)
    {
        _logger.LogDebug("Adding education: {@Education}", education);

        try
        {
            await _context.Educations.AddAsync(education.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return education;
        }
        catch (EducationRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add education: {@Education}", education);
            throw new EducationRepositoryException("Failed to add education", ex);
        }
    }

    public async Task<Education> UpdateAsync(Education education, CancellationToken ct = default)
    {
        try
        {
            var educationDb = await _context.Educations.FirstOrDefaultAsync(e => e.Id == education.Id, ct);

            if (educationDb is null)
            {
                throw new EducationRepositoryException($"Education with id {education.Id} not found");
            }

            await _context.SaveChangesAsync(ct);
            return education;
        }
        catch (EducationRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update education: {@Education}", education);
            throw new EducationRepositoryException("Failed to update education", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var educationDb = await _context.Educations.FirstOrDefaultAsync(e => e.Id == id, ct);

            if (educationDb is null)
            {
                return false;
            }

            _context.Educations.Remove(educationDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete education with id: {EducationId}", id);
            throw new EducationRepositoryException("Failed to delete education", ex);
        }
    }
}