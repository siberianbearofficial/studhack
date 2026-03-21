using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface ISubscriptionRepository
{
    Task<Subscription?> GetByIdAsync(Guid eventId, Guid userId, CancellationToken ct = default);
    Task<IEnumerable<Subscription>> GetAllAsync(CancellationToken ct = default);
    Task<Subscription> AddAsync(Subscription subscription, CancellationToken ct = default);
    Task<Subscription> UpdateAsync(Subscription subscription, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid eventId, Guid userId, CancellationToken ct = default);
}
