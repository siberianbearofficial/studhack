using StudHack.Domain.Models;

namespace StudHack.Core.Abstractions.Repositories;

public interface INotificationsRepository
{
    Task<List<MessageToSend>> GetMessagesToSend();

    Task MarkSent(List<MessageToSend> messages);
}

