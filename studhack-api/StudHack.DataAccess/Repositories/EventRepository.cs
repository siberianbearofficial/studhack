using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class EventRepository : IEventRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<EventRepository> _logger;
    
    public EventRepository(StudHackDbContext context, ILogger<EventRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    public async Task<Event?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        _logger.LogDebug("Retrieving event by Id: {EventId}", id);

        try
        {
            var eventDb = await _context.Events.FirstOrDefaultAsync(e => e.Id == id);

            if (eventDb is null)
            {
                _logger.LogWarning("Event not found: {EventId}", id);
                return null;
            }

            _logger.LogInformation("Event retrieved: {EventId}", id);
            return eventDb.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve event with Id: {EventId}", id);
            throw new EventRepositoryException("Failed to retrieve event", ex);
        }
    }

    public async Task<IEnumerable<Event>> GetAllAsync(CancellationToken ct = default)
    {
        _logger.LogDebug("Retrieving all events");

        try
        {
            var eventsDb = await _context.Events.ToListAsync();
            _logger.LogInformation("Retrieved {Count} events", eventsDb.Count);

            return eventsDb.Select(e => e.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve events");
            throw new EventRepositoryException("Failed to retrieve events", ex);
        }
    }

    public async Task<Event> AddAsync(Event ev, CancellationToken ct = default)
    {
        _logger.LogDebug("Attempting to add new event: {@Event}", ev);

        try
        {
            var eventDb = ev.ToDb();
            await _context.Events.AddAsync(eventDb);
            var isSave = await _context.SaveChangesAsync() > 0;

            if (isSave)
                _logger.LogInformation("Event added successfully: {EventId}", eventDb.Id);
            else
                _logger.LogWarning("No changes saved while adding event: {EventId}", eventDb.Id);

            return ev;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add event: {@Event}", ev);
            throw new EventRepositoryException("Failed to create event", ex);
        }
    }

    public async Task<Event> UpdateAsync(Event ev, CancellationToken ct = default)
    {
        _logger.LogDebug("Updating event: {@Event}", ev);

        try
        {
            var eventDb = await _context.Events.FirstOrDefaultAsync(e => e.Id == ev.Id);

            if (eventDb is null)
            {
                _logger.LogWarning("Event not found for update: {EventId}", ev.Id);
                throw new EventRepositoryException($"Event with Id {ev.Id} not found");
            }

            eventDb.Title = ev.Title;
            eventDb.Address = ev.Address;
            eventDb.Description = ev.Description;
            eventDb.CityId = eventDb.CityId;
            eventDb.Type = eventDb.Type;
            eventDb.RegistrationLink = eventDb.RegistrationLink;
            eventDb.Format = eventDb.Format;
            eventDb.Latitude = eventDb.Latitude;
            eventDb.Longitude = eventDb.Longitude;

            _context.Events.Update(eventDb);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Event updated successfully: {EventId}", ev.Id);
            return ev;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update event: {@Event}", ev);
            throw new EventRepositoryException("Failed to update event", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        _logger.LogDebug("Removing event with Id: {EventId}", id);

        try
        {
            var eventDb = await _context.Events.FirstOrDefaultAsync(e => e.Id == id);

            if (eventDb is null)
            {
                _logger.LogWarning("Event not found for removal: {EventId}", id);
                throw new EventRepositoryException($"Event with Id {id} not found");
            }

            _context.Events.Remove(eventDb);
            var isSave = await _context.SaveChangesAsync() > 0;

            if (isSave)
            {
                _logger.LogInformation("Event removed: {EventId}", id);
                return true;
            }

            _logger.LogWarning("No changes saved while removing event: {EventId}", id);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to remove event with Id: {EventId}", id);
            throw new EventRepositoryException("Failed to remove event", ex);
        }
    }
}
