using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.Domain.Abstractions;

namespace StudHack.Api.Controllers;



[ApiController]
[Route("api/v1/notifications")]
public class NotificationsController(INotificationsService notificationsService, IUserService userService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ApiResponseDto<SentMessagesDto>>> GetSentMessages(CancellationToken ct)
    {
        var user = await userService.GetUserByAuthAsync(User.GetUserId(), ct);
        if (user != null)
            return Ok(new ApiResponseDto<IEnumerable<SentMessageDto>>([]));
        var messages = await notificationsService.GetSentMessagesAsync(user.Id);
        return Ok(new ApiResponseDto<IEnumerable<SentMessageDto>>(messages
            .Select(SentMessageConverter.ToDto)
            .ToList()));
    }
}
