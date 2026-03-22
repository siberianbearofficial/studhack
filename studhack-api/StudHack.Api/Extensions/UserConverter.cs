using StudHack.Domain.Models;
using StudHack.Api.Dtos;

namespace StudHack.Api.Extensions;

public static class UserConverter
{
    public static UserInfoDto ToDto(this User user)
    {
        return new UserInfoDto
        {
            Id = user.Id,
            UniqueName = user.UniqueName,
            DisplayName = user.DisplayedName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Available = user.Available,
            Biography = user.Biography,
            BirthDate = user.BirthDate,
            CityOfResidence = user.City?.ToDto(),
            PortfolioLinks = user.PortfolioLinks.Select(PortfolioLinkConverter.ToDto).ToList(),
            Skills = user.Skills.Select(SkillsConverter.ToDto).ToList(),
            Specializations = user.Specializations.Select(SpecializationConverter.ToDto).ToList(),
            Education = user.Educations.Select(EducationConverter.ToDto).ToList(),
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
        };
    }

    public static MyProfileDto ToMyProfileDto(this User user)
    {
        var dto = user.ToDto();
        return new MyProfileDto
        {
            Id = dto.Id,
            UniqueName = dto.UniqueName,
            DisplayName = dto.DisplayName,
            BirthDate = dto.BirthDate,
            Available = dto.Available,
            CityOfResidence = dto.CityOfResidence,
            AvatarUrl = dto.AvatarUrl,
            Email = dto.Email,
            Biography = dto.Biography,
            Skills = dto.Skills,
            Specializations = dto.Specializations,
            PortfolioLinks = dto.PortfolioLinks,
            Education = dto.Education,
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt,
        };
    }
}