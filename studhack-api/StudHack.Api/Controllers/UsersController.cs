using StudHack.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.Domain.Abstractions;

namespace StudHack.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserInfoDto>> GetUserInfo(CancellationToken ct)
    {
        var user = await userService.GetUserByAuthAsync(User.GetUserId(), ct);
        if (user != null)
            return Ok(user.ToDto());
        var authInfo = await userService.LoadUserInfoAsync(User.GetUserId(), ct);
        return Ok(new UserInfoDto
        {
            UniqueName = authInfo?.UniqueName,
            DisplayName = authInfo?.DisplayName,
            Email = authInfo?.Email,
            AvatarUrl = authInfo?.AvatarUrl,
        });
    }

    [HttpGet("{userId:guid}")]
    [Authorize]
    public async Task<ActionResult<UserInfoDto>> GetUserInfo(Guid userId, CancellationToken ct)
    {
        var user = await userService.GetUserByIdAsync(userId, ct);
        if (user == null)
            return NotFound("User not found");
        return Ok(user.ToDto());
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<UserInfoDto>>> GetUsers(Guid userId, CancellationToken ct)
    {
        var users = await userService.GetUsersAsync(ct);
        return Ok(users.Select(UserConverter.ToDto));
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<Guid>> UpdateUserInfo([FromBody] UpdateUserInfoDto dto, CancellationToken ct)
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
                Biography =  dto.Biography,
                BirthDate = dto.BirthDate,
                City = dto.City.ToDomain(),
                PortfolioLinks = dto.PortfolioLinks.Select(PortfolioLinkConverter.ToDomain).ToList(),
                Skills = dto.Skills.Select(SkillsConverter.ToDomain).ToList(),
                Specializations = dto.Specializations.Select(SpecializationConverter.ToDomain).ToList(),
                Educations = dto.Education.Select(EducationConverter.ToDomain).ToList(),
            }, ct);
        return Ok();
    }
}