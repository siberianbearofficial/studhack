using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class EventDateRepository : IEventDateRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<EventDateRepository> _logger;

    public EventDateRepository(StudHackDbContext context, ILogger<EventDateRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<EventDate?> GetByIdAsync(Guid eventId, DateTime startsAt, CancellationToken ct = default)
    {
        _logger.LogDebug("Retrieving event date by key: {EventId} {StartsAt}", eventId, startsAt);

        try
        {
            var eventDateDb = await _context.EventDates
                .AsNoTracking()
                .FirstOrDefaultAsync(ed => ed.EventId == eventId && ed.StartsAt == startsAt, ct);

            return eventDateDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve event date");
            throw new EventDateRepositoryException("Failed to retrieve event date", ex);
        }
    }

    public async Task<IEnumerable<EventDate>> GetAllAsync(CancellationToken ct = default)
    {
        _logger.LogDebug("Retrieving all event dates");

        try
        {
            var eventDatesDb = await _context.EventDates.AsNoTracking().ToListAsync(ct);
            return eventDatesDb.Select(ed => ed.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve event dates");
            throw new EventDateRepositoryException("Failed to retrieve event dates", ex);
        }
    }

    public async Task<EventDate> AddAsync(EventDate eventDate, CancellationToken ct = default)
    {
        _logger.LogDebug("Adding event date: {@EventDate}", eventDate);

        try
        {
            await _context.EventDates.AddAsync(eventDate.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return eventDate;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add event date: {@EventDate}", eventDate);
            throw new EventDateRepositoryException("Failed to add event date", ex);
        }
    }

    public async Task<EventDate> UpdateAsync(EventDate eventDate, CancellationToken ct = default)
    {
        _logger.LogDebug("Updating event date: {@EventDate}", eventDate);

        try
        {
            var eventDateDb = await _context.EventDates
                .FirstOrDefaultAsync(ed => ed.EventId == eventDate.EventId && ed.StartsAt == eventDate.StartsAt, ct);

            if (eventDateDb is null)
            {
                throw new EventDateRepositoryException(
                    $"EventDate with EventId {eventDate.EventId} and StartsAt {eventDate.StartsAt} not found");
            }

            _context.Entry(eventDateDb).CurrentValues.SetValues(eventDate.ToDb());
            await _context.SaveChangesAsync(ct);
            return eventDate;
        }
        catch (EventDateRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update event date: {@EventDate}", eventDate);
            throw new EventDateRepositoryException("Failed to update event date", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid eventId, DateTime startsAt, CancellationToken ct = default)
    {
        _logger.LogDebug("Deleting event date by key: {EventId} {StartsAt}", eventId, startsAt);

        try
        {
            var eventDateDb = await _context.EventDates
                .FirstOrDefaultAsync(ed => ed.EventId == eventId && ed.StartsAt == startsAt, ct);

            if (eventDateDb is null)
            {
                return false;
            }

            _context.EventDates.Remove(eventDateDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete event date");
            throw new EventDateRepositoryException("Failed to delete event date", ex);
        }
    }
}