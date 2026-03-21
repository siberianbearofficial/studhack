using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface IRegionRepository
{
    Task<Region?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Region>> GetAllAsync(CancellationToken ct = default);
    Task<Region> AddAsync(Region region, CancellationToken ct = default);
    Task<Region> UpdateAsync(Region region, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
