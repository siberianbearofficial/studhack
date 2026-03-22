using StudHack.Core.Abstractions.Repositories;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Models;

namespace StudHack.Application.Services;

public class NotificationsService(INotificationsRepository notificationsRepository): INotificationsService
{
    public async Task<IReadOnlyCollection<SentMessage>> GetSentMessagesAsync(Guid userId, CancellationToken ct = default)
    {
        return await notificationsRepository.GetSentMessages(userId, ct);
    }
}
