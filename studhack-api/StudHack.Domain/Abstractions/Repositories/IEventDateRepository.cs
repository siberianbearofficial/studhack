using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions.Repositories;

public interface IEventDateRepository
{
    Task<EventDate?> GetByIdAsync(Guid eventId, DateTime startsAt, CancellationToken ct = default);
    Task<IEnumerable<EventDate>> GetAllAsync(CancellationToken ct = default);
    Task<EventDate> AddAsync(EventDate eventDate, CancellationToken ct = default);
    Task<EventDate> UpdateAsync(EventDate eventDate, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid eventId, DateTime startsAt, CancellationToken ct = default);
}
