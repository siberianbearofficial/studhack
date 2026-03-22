using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions;

public interface IEventService
{
    Task<IReadOnlyCollection<EventFullModel>> GetEventsFullAsync(Guid authId, CancellationToken ct = default);
    Task<EventFullModel?> GetEventFullByIdAsync(Guid eventId, Guid authId, CancellationToken ct = default);
    Task<EventFullModel> UpsertEventAsync(Guid authId, UpsertEventModel request, CancellationToken ct = default);
    Task<EventSubscriptionModel> SetSubscriptionAsync(Guid authId, Guid eventId, bool subscribed,
        CancellationToken ct = default);
}