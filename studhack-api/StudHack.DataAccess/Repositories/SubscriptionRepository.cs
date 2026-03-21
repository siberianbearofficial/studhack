using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<SubscriptionRepository> _logger;

    public SubscriptionRepository(StudHackDbContext context, ILogger<SubscriptionRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Subscription?> GetByIdAsync(Guid eventId, Guid userId, CancellationToken ct = default)
    {
        try
        {
            var subscriptionDb = await _context.Subscriptions
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.EventId == eventId && s.UserId == userId, ct);

            return subscriptionDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve subscription by key: {EventId} {UserId}", eventId, userId);
            throw new SubscriptionRepositoryException("Failed to retrieve subscription", ex);
        }
    }

    public async Task<IEnumerable<Subscription>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var subscriptionsDb = await _context.Subscriptions.AsNoTracking().ToListAsync(ct);
            return subscriptionsDb.Select(s => s.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve subscriptions");
            throw new SubscriptionRepositoryException("Failed to retrieve subscriptions", ex);
        }
    }

    public async Task<Subscription> AddAsync(Subscription subscription, CancellationToken ct = default)
    {
        try
        {
            await _context.Subscriptions.AddAsync(subscription.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return subscription;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add subscription: {@Subscription}", subscription);
            throw new SubscriptionRepositoryException("Failed to add subscription", ex);
        }
    }

    public async Task<Subscription> UpdateAsync(Subscription subscription, CancellationToken ct = default)
    {
        try
        {
            var subscriptionDb = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.EventId == subscription.EventId && s.UserId == subscription.UserId, ct);

            if (subscriptionDb is null)
            {
                throw new SubscriptionRepositoryException(
                    $"Subscription with EventId {subscription.EventId} and UserId {subscription.UserId} not found");
            }

            _context.Entry(subscriptionDb).CurrentValues.SetValues(subscription.ToDb());
            await _context.SaveChangesAsync(ct);
            return subscription;
        }
        catch (SubscriptionRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update subscription: {@Subscription}", subscription);
            throw new SubscriptionRepositoryException("Failed to update subscription", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid eventId, Guid userId, CancellationToken ct = default)
    {
        try
        {
            var subscriptionDb = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.EventId == eventId && s.UserId == userId, ct);

            if (subscriptionDb is null)
            {
                return false;
            }

            _context.Subscriptions.Remove(subscriptionDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete subscription by key: {EventId} {UserId}", eventId, userId);
            throw new SubscriptionRepositoryException("Failed to delete subscription", ex);
        }
    }
}