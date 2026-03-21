using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions.Repositories;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Event>> GetAllAsync(CancellationToken ct = default);
    Task<Event> AddAsync(Event ev, CancellationToken ct = default);
    Task<Event> UpdateAsync(Event ev, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
