using Microsoft.EntityFrameworkCore;
using StudHack.DataAccess.Context;
using StudHack.Domain.Models;
using StudHack.DataAccess.Models;
using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Repositories;

/*
 * public bool TryUpdate(Habit h)
    {
        var habit = _dbContext.Habits.Include(h => h.ActualTimings).Include(h => h.PrefFixedTimings)
            .FirstOrDefault(h => h.Id == h.Id);
        if (habit == null)
            return false;
        return true;
    }
 * */

public class NotificationsRepository(StudHackDbContext dbContext)
{
    private StudHackDbContext _dbContext { get; } = dbContext;

    public async Task<List<MessageToSend>> GetMessagesToSend()
    {
        var potentialMessages = await _dbContext.Subscriptions
            .Include(s => s.User)
            .Include(s => s.Event)
                .ThenInclude(e => e.EventDates)
            .Where(s => s.Event.EventDates.Any(ed =>
                ed.StartsAt > DateTime.Now && // Только будущие даты
                !_dbContext.SentMessages.Any(sm =>
                    sm.IdSubscription == s.Id &&
                    sm.IdEventDate == ed.Id))) // Не отправлено
            .ToListAsync();

        var messagesToSend = new List<MessageToSend>();

        foreach (var subscription in potentialMessages)
        {
            foreach (var eventDate in subscription.Event.EventDates
                .Where(ed => ed.StartsAt > DateTime.Now))
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
            _dbContext.SentMessages.Add(new SentMessageDb(message.EventDateId, message.SubscriptionId));
        await _dbContext.SaveChangesAsync();
    }
}
