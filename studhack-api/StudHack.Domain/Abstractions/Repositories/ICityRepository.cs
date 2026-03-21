using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions.Repositories;

public interface ICityRepository
{
    Task<City?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<City>> GetAllAsync(CancellationToken ct = default);
    Task<City> AddAsync(City city, CancellationToken ct = default);
    Task<City> UpdateAsync(City city, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}