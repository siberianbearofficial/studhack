using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.Domain.Abstractions;

namespace StudHack.Api.Controllers;

[ApiController]
[Route("api/v1/teams")]
[Authorize]
public class TeamsController(ITeamService teamService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<TeamFullDto>>>> GetTeams(CancellationToken ct)
    {
        var authId = User.Identity?.IsAuthenticated == true ? User.GetUserId() : Guid.Empty;
        var teams = await teamService.GetTeamsFullAsync(authId, ct);
        return Ok(new ApiResponseDto<IEnumerable<TeamFullDto>>(teams.Select(TeamContractsOutputConverter.ToDto).ToList()));
    }

    [HttpGet("{teamId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<TeamFullDto>>> GetTeamById(Guid teamId, CancellationToken ct)
    {
        var authId = User.Identity?.IsAuthenticated == true ? User.GetUserId() : Guid.Empty;
        var team = await teamService.GetTeamFullByIdAsync(teamId, authId, ct);
        if (team is null)
            return NotFound("Team not found");

        return Ok(new ApiResponseDto<TeamFullDto>(team.ToDto()));
    }

    [HttpPost("upsert")]
    public async Task<ActionResult<ApiResponseDto<TeamFullDto>>> Upsert([FromBody] UpsertTeamRequest request,
        CancellationToken ct)
    {
        try
        {
            var team = await teamService.UpsertTeamAsync(User.GetUserId(), request.ToDomain(), ct);
            return Ok(new ApiResponseDto<TeamFullDto>(team.ToDto()));
        }
        catch (UnauthorizedAccessException e)
        {
            return StatusCode(StatusCodes.Status403Forbidden, e.Message);
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

    [HttpDelete("{teamId:guid}")]
    public async Task<ActionResult<ApiResponseDto<DeleteResultDto>>> Delete(Guid teamId, CancellationToken ct)
    {
        try
        {
            var deleted = await teamService.DeleteTeamAsync(teamId, User.GetUserId(), ct);
            if (!deleted)
                return NotFound("Team not found");

            return Ok(new ApiResponseDto<DeleteResultDto>(new DeleteResultDto
            {
                Id = teamId,
            }));
        }
        catch (UnauthorizedAccessException e)
        {
            return StatusCode(StatusCodes.Status403Forbidden, e.Message);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(e.Message);
        }
    }
}