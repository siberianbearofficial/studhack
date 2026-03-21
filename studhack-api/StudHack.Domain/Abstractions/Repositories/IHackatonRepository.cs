using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions.Repositories;

public interface IHackatonRepository
{
    Task<Hackaton?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Hackaton>> GetAllAsync(CancellationToken ct = default);
    Task<Hackaton> AddAsync(Hackaton hackaton, CancellationToken ct = default);
    Task<Hackaton> UpdateAsync(Hackaton hackaton, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
