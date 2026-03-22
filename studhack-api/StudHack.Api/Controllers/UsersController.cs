using StudHack.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.Domain.Abstractions;

namespace StudHack.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponseDto<UserInfoDto>>> GetUserInfo(CancellationToken ct)
    {
        var user = await userService.GetUserByAuthAsync(User.GetUserId(), ct);
        if (user != null)
            return Ok(new ApiResponseDto<UserInfoDto>(user.ToDto()));
        var authInfo = await userService.LoadUserInfoAsync(User.GetUserId(), ct);
        return Ok(new ApiResponseDto<UserInfoDto>(new UserInfoDto
        {
            UniqueName = authInfo?.UniqueName,
            DisplayName = authInfo?.DisplayName,
            Email = authInfo?.Email,
            AvatarUrl = authInfo?.AvatarUrl,
        }));
    }

    [HttpGet("{userId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<UserInfoDto>>> GetUserInfo(Guid userId, CancellationToken ct)
    {
        var user = await userService.GetUserByIdAsync(userId, ct);
        if (user == null)
            return NotFound("User not found");
        return Ok(new ApiResponseDto<UserInfoDto>(user.ToDto()));
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<IEnumerable<UserInfoDto>>>> GetUsers(Guid userId,
        CancellationToken ct)
    {
        var users = await userService.GetUsersAsync(ct);
        return Ok(new ApiResponseDto<IEnumerable<UserInfoDto>>(users.Select(UserConverter.ToDto)));
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponseDto<Guid>>> UpdateUserInfo([FromBody] UpdateUserInfoDto dto,
        CancellationToken ct)
    {
        var id = await userService.SaveUserInfoAsync(User.GetUserId(),
            new User
            {
                Id = Guid.Empty,
                UniqueName = dto.UniqueName,
                DisplayedName = dto.DisplayName,
                Email = dto.Email,
                AuthId = User.GetUserId(),
                AvatarUrl = dto.AvatarUrl,
                Available = dto.Available,
                Biography = dto.Biography,
                BirthDate = dto.BirthDate,
                City = dto.City?.ToDomain(),
                CityOfResidenceId = dto.City?.Id,
                PortfolioLinks = dto.PortfolioLinks.Select(PortfolioLinkConverter.ToDomain).ToList(),
                Skills = dto.Skills.Select(e => e.ToDomain()).ToList(),
                Specializations = dto.Specializations.Select(SpecializationConverter.ToDomain).ToList(),
                Educations = dto.Education.Select(EducationConverter.ToDomain).ToList(),
            }, ct);
        return Ok(new ApiResponseDto<Guid>(id));
    }
}