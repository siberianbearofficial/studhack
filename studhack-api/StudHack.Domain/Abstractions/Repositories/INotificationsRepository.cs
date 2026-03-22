using StudHack.Domain.Models;

namespace StudHack.Core.Abstractions.Repositories;

public interface INotificationsRepository
{
    Task<List<MessageToSend>> GetMessagesToSend(CancellationToken ct = default);

    Task MarkSent(List<MessageToSend> messages, CancellationToken ct = default);
    Task<List<SentMessage>> GetSentMessages(Guid userId, CancellationToken ct = default);
}

