using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.Domain.Abstractions;

namespace StudHack.Api.Controllers;

[ApiController]
[Route("api/v1/team-requests")]
[Authorize]
public class TeamRequestsController(ITeamRequestService teamRequestService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponseDto<TeamRequestsFeedDto>>> GetFeed(CancellationToken ct)
    {
        var feed = await teamRequestService.GetFeedAsync(User.GetUserId(), ct);
        return Ok(new ApiResponseDto<TeamRequestsFeedDto>(feed.ToDto()));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponseDto<TeamRequestDto>>> Create([FromBody] CreateTeamRequestRequest request,
        CancellationToken ct)
    {
        try
        {
            var created = await teamRequestService.CreateAsync(User.GetUserId(), request.ToDomain(), ct);
            return Ok(new ApiResponseDto<TeamRequestDto>(created.ToDto()));
        }
        catch (UnauthorizedAccessException e)
        {
            return Error(StatusCodes.Status403Forbidden, e.Message);
        }
        catch (KeyNotFoundException e)
        {
            return Error(StatusCodes.Status404NotFound, e.Message);
        }
        catch (InvalidOperationException e)
        {
            return Error(StatusCodes.Status409Conflict, e.Message);
        }
    }

    [HttpPost("{requestId:guid}/resolve")]
    public async Task<ActionResult<ApiResponseDto<TeamRequestDto>>> Resolve(Guid requestId,
        [FromBody] ResolveTeamRequestRequest request, CancellationToken ct)
    {
        try
        {
            var resolved = await teamRequestService.ResolveAsync(requestId, User.GetUserId(), request.ToDomain(), ct);
            return Ok(new ApiResponseDto<TeamRequestDto>(resolved.ToDto()));
        }
        catch (UnauthorizedAccessException e)
        {
            return Error(StatusCodes.Status403Forbidden, e.Message);
        }
        catch (KeyNotFoundException e)
        {
            return Error(StatusCodes.Status404NotFound, e.Message);
        }
        catch (InvalidOperationException e)
        {
            return Error(StatusCodes.Status409Conflict, e.Message);
        }
    }

    private ObjectResult Error(int statusCode, string message)
    {
        return StatusCode(statusCode, new { message });
    }
}
