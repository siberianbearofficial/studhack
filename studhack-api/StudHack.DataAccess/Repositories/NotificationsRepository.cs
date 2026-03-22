using Microsoft.EntityFrameworkCore;
using StudHack.Core.Abstractions.Repositories;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Models;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class NotificationsRepository(StudHackDbContext dbContext): INotificationsRepository
{
    private StudHackDbContext _dbContext { get; } = dbContext;

    public async Task<List<MessageToSend>> GetMessagesToSend()
    {
        // военные преступления
        var potentialMessages = await _dbContext.Subscriptions
            .Include(s => s.User)
            .Include(s => s.Event)
                .ThenInclude(e => e.EventDates.Where(ed =>
                    DateTime.UtcNow.AddDays(1) > ed.StartsAt && ed.StartsAt > DateTime.UtcNow))
                    .ThenInclude(ed => ed.SentMessages)
            .ToListAsync();

        foreach (var pm in potentialMessages)
        {
            pm.Event.EventDates = pm.Event.EventDates
                .Where(ed => !ed.SentMessages.Any(sm => sm.IdEventDate == ed.Id && sm.IdSubscription == pm.Id))
                .ToList();
        }

        var messagesToSend = new List<MessageToSend>();

        foreach (var subscription in potentialMessages)
        {
            foreach (var eventDate in subscription.Event.EventDates)
            {
                // Проверяем еще раз, не отправлено ли
                var alreadySent = await _dbContext.SentMessages
                    .AnyAsync(sm => sm.IdSubscription == subscription.Id &&
                                   sm.IdEventDate == eventDate.Id);
                if (!alreadySent)
                {
                    var message = string.Format("Привет, {0}!\n Напоминаем про " +
                        "дедлайн по событию {1}: {2} в {3}",
                        subscription.User.UniqueName,
                        subscription.Event.Title,
                        eventDate.Description,
                        eventDate.StartsAt);

                    if (subscription.User.Email != null)
                        messagesToSend.Add(new MessageToSend(
                            subscription.Id,
                            eventDate.Id,
                            message,
                            subscription.User.Email
                            ));
                }
            }
        }

        return messagesToSend;
    }

    public async Task MarkSent(List<MessageToSend> messages)
    {
        foreach (var message in messages)
            _dbContext.SentMessages.Add(new SentMessageDb(message.EventDateId, message.SubscriptionId, message.Message));
        await _dbContext.SaveChangesAsync();
    }
}
