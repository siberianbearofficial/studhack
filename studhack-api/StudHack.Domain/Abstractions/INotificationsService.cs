using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions;

public interface INotificationsService
{
    Task<IReadOnlyCollection<SentMessage>> GetSentMessagesAsync(Guid userId, CancellationToken ct = default);
}
