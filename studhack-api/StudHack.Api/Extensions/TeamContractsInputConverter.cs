using StudHack.Api.Dtos;
using StudHack.Domain;
using StudHack.Domain.Models;

namespace StudHack.Api.Extensions;

public static class TeamContractsInputConverter
{
    public static UpsertTeamModel ToDomain(this UpsertTeamRequest dto)
    {
        return new UpsertTeamModel
        {
            Id = NormalizeNullableGuid(dto.Id),
            HackatonId = dto.HackatonId,
            Name = dto.Name,
            Description = dto.Description,
            CaptainUserId = NormalizeNullableGuid(dto.CaptainUserId),
            Positions = dto.Positions.Select(p => new UpsertTeamPositionModel
            {
                Id = NormalizeNullableGuid(p.Id),
                Title = p.Title,
                Description = p.Description,
                MandatoryPositionId = NormalizeNullableGuid(p.MandatoryPositionId),
                SpecializationId = NormalizeNullableGuid(p.SpecializationId),
                RequiredSkillIds = p.RequiredSkillIds?.ToArray() ?? [],
                FilledByExternal = p.FilledByExternal ?? false,
                UserId = NormalizeNullableGuid(p.UserId),
            }).ToList(),
        };
    }

    public static CreateTeamRequestModel ToDomain(this CreateTeamRequestRequest dto)
    {
        return new CreateTeamRequestModel
        {
            TeamPositionId = dto.TeamPositionId,
            Type = (TeamRequestType)dto.Type,
            InvitedUserId = dto.InvitedUserId,
            Message = dto.Message,
        };
    }

    public static TeamRequestStatus ToDomain(this ResolveTeamRequestRequest dto)
    {
        return (TeamRequestStatus)dto.Status;
    }

    private static Guid? NormalizeNullableGuid(Guid? id)
    {
        return id.HasValue && id.Value != Guid.Empty ? id : null;
    }
}