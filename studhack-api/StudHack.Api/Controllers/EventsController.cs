using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.Domain.Abstractions;

namespace StudHack.Api.Controllers;

[ApiController]
[Route("api/v1/events")]
[Authorize]
public class EventsController(IEventService eventService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<EventFullDto>>>> GetEvents(CancellationToken ct)
    {
        var authId = User.Identity?.IsAuthenticated == true ? User.GetUserId() : Guid.Empty;
        var events = await eventService.GetEventsFullAsync(authId, ct);
        return Ok(new ApiResponseDto<IEnumerable<EventFullDto>>(events.Select(EventContractsConverter.ToDto).ToList()));
    }

    [HttpGet("{eventId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<EventFullDto>>> GetEventById(Guid eventId, CancellationToken ct)
    {
        var authId = User.Identity?.IsAuthenticated == true ? User.GetUserId() : Guid.Empty;
        var ev = await eventService.GetEventFullByIdAsync(eventId, authId, ct);
        if (ev is null)
            return NotFound("Event not found");

        return Ok(new ApiResponseDto<EventFullDto>(ev.ToDto()));
    }

    [HttpPost("upsert")]
    public async Task<ActionResult<ApiResponseDto<EventFullDto>>> Upsert([FromBody] UpsertEventRequest request,
        CancellationToken ct)
    {
        try
        {
            var ev = await eventService.UpsertEventAsync(User.GetUserId(), request.ToDomain(), ct);
            return Ok(new ApiResponseDto<EventFullDto>(ev.ToDto()));
        }
        catch (UnauthorizedAccessException e)
        {
            return Forbid(e.Message);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (InvalidOperationException e)
        {
            return Conflict(e.Message);
        }
    }

    [HttpPost("{eventId:guid}/subscription")]
    public async Task<ActionResult<ApiResponseDto<EventSubscriptionDto>>> SetSubscription(Guid eventId,
        [FromBody] SetEventSubscriptionRequest request, CancellationToken ct)
    {
        try
        {
            var subscription = await eventService.SetSubscriptionAsync(User.GetUserId(), eventId, request.Subscribed, ct);
            return Ok(new ApiResponseDto<EventSubscriptionDto>(new EventSubscriptionDto
            {
                IsSubscribed = subscription.IsSubscribed,
                SubscribedAt = subscription.SubscribedAt,
                SubscribersCount = subscription.SubscribersCount,
            }));
        }
        catch (UnauthorizedAccessException e)
        {
            return Forbid(e.Message);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
    }
}
