using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class CityRepository : ICityRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<CityRepository> _logger;

    public CityRepository(StudHackDbContext context, ILogger<CityRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<City?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        _logger.LogDebug("Retrieving city by id: {CityId}", id);

        try
        {
            var cityDb = await _context.Cities
                .Where(c => c.Id == id)
                .Include(e => e.Region)
                .AsNoTracking()
                .FirstOrDefaultAsync(ct);

            return cityDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve city with id: {CityId}", id);
            throw new CityRepositoryException("Failed to retrieve city", ex);
        }
    }

    public async Task<IEnumerable<City>> GetAllAsync(CancellationToken ct = default)
    {
        _logger.LogDebug("Retrieving all cities");

        try
        {
            var citiesDb = await _context.Cities
                .Include(e => e.Region)
                .AsNoTracking()
                .ToListAsync(ct);
            return citiesDb.Select(c => c.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve cities");
            throw new CityRepositoryException("Failed to retrieve cities", ex);
        }
    }

    public async Task<City> AddAsync(City city, CancellationToken ct = default)
    {
        _logger.LogDebug("Adding city: {@City}", city);

        try
        {
            var cityDb = city.ToDb();
            await _context.Cities.AddAsync(cityDb, ct);
            await _context.SaveChangesAsync(ct);
            return city;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add city: {@City}", city);
            throw new CityRepositoryException("Failed to add city", ex);
        }
    }

    public async Task<City> UpdateAsync(City city, CancellationToken ct = default)
    {
        _logger.LogDebug("Updating city: {@City}", city);

        try
        {
            var cityDb = await _context.Cities.FirstOrDefaultAsync(c => c.Id == city.Id, ct);

            if (cityDb is null)
            {
                throw new CityRepositoryException($"City with id {city.Id} not found");
            }

            _context.Entry(cityDb).CurrentValues.SetValues(city.ToDb());
            await _context.SaveChangesAsync(ct);
            return city;
        }
        catch (CityRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update city: {@City}", city);
            throw new CityRepositoryException("Failed to update city", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        _logger.LogDebug("Deleting city by id: {CityId}", id);

        try
        {
            var cityDb = await _context.Cities.FirstOrDefaultAsync(c => c.Id == id, ct);

            if (cityDb is null)
            {
                return false;
            }

            _context.Cities.Remove(cityDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete city with id: {CityId}", id);
            throw new CityRepositoryException("Failed to delete city", ex);
        }
    }
}