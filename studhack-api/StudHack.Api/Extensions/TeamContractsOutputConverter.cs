using StudHack.Api.Dtos;
using StudHack.Api.Enums;
using StudHack.Domain;
using StudHack.Domain.Models;

namespace StudHack.Api.Extensions;

public static class TeamContractsOutputConverter
{
    public static TeamFullDto ToDto(this TeamFullModel model)
    {
        var mandatoryPositions = model.Positions.Where(x => x.Position.Type == TeamPositionType.Mandatory).ToList();
        var mandatoryFilled = mandatoryPositions.Count(x => x.Position.UserId.HasValue || x.Position.FilledByExternal);

        return new TeamFullDto
        {
            Id = model.Team.Id,
            Event = model.ToEventShortDto(),
            Name = model.Team.Name,
            Description = model.Team.Description,
            Creator = model.Creator.ToUserShortDto(),
            Captain = model.Captain?.ToUserShortDto(),
            MemberCount = model.Members.Select(x => x.User.Id).Distinct().Count(),
            OpenPositionsCount = model.Positions.Count(x => !x.Position.UserId.HasValue && !x.Position.FilledByExternal),
            MandatoryCoverage = new MandatoryCoverageDto
            {
                Total = mandatoryPositions.Count,
                Filled = mandatoryFilled,
                AllFilled = mandatoryPositions.Count == mandatoryFilled,
            },
            Members = model.Members.Select(ToDto).ToList(),
            Positions = model.Positions.Select(ToDto).ToList(),
            CreatedAt = model.Team.CreatedAt,
            UpdatedAt = model.Team.UpdatedAt ?? model.Team.CreatedAt,
        };
    }

    public static TeamRequestsFeedDto ToDto(this TeamRequestFeedModel model)
    {
        return new TeamRequestsFeedDto
        {
            Inbox = model.Inbox.Select(ToDto).ToList(),
            Outbox = model.Outbox.Select(ToDto).ToList(),
            ManagedTeams = model.ManagedTeams.Select(ToDto).ToList(),
        };
    }

    public static TeamInEventDto ToInEventDto(this TeamFullModel model)
    {
        var mandatoryPositions = model.Positions.Where(x => x.Position.Type == TeamPositionType.Mandatory).ToList();
        var mandatoryFilled = mandatoryPositions.Count(x => x.Position.UserId.HasValue || x.Position.FilledByExternal);

        return new TeamInEventDto
        {
            Id = model.Team.Id,
            Name = model.Team.Name,
            Description = model.Team.Description,
            Creator = model.Creator.ToUserShortDto(),
            Captain = model.Captain?.ToUserShortDto(),
            MemberCount = model.Members.Select(x => x.User.Id).Distinct().Count(),
            OpenPositionsCount = model.Positions.Count(x => !x.Position.UserId.HasValue && !x.Position.FilledByExternal),
            MandatoryCoverage = new MandatoryCoverageDto
            {
                Total = mandatoryPositions.Count,
                Filled = mandatoryFilled,
                AllFilled = mandatoryPositions.Count == mandatoryFilled,
            },
            Members = model.Members.Select(ToDto).ToList(),
            Positions = model.Positions.Select(ToDto).ToList(),
            CreatedAt = model.Team.CreatedAt,
            UpdatedAt = model.Team.UpdatedAt ?? model.Team.CreatedAt,
        };
    }

    public static TeamRequestDto ToDto(this TeamRequestFullModel model)
    {
        return new TeamRequestDto
        {
            Id = model.TeamRequest.Id,
            Type = (TeamRequestTypeDto)model.TeamRequest.Type,
            Status = (TeamRequestStatusDto)model.TeamRequest.Status,
            Message = model.TeamRequest.Message,
            User = model.User.ToUserShortDto(),
            Team = ToShortDto(model.Team),
            TeamPosition = new TeamPositionSummaryDto
            {
                Id = model.TeamPosition.Id,
                Title = model.PositionSpecialization?.Name ?? "Position",
                Specialization = (model.PositionSpecialization ?? new Specialization(Guid.Empty, "Unknown")).ToDto(),
                IsMandatory = model.TeamPosition.Type == TeamPositionType.Mandatory,
            },
            CreatedAt = model.TeamRequest.CreatedAt,
            ResolvedAt = model.TeamRequest.ResolvedAt,
        };
    }

    public static TeamRequestShortDto ToShortDto(this TeamRequestFullModel model)
    {
        return new TeamRequestShortDto
        {
            Id = model.TeamRequest.Id,
            Type = (TeamRequestTypeDto)model.TeamRequest.Type,
            Status = (TeamRequestStatusDto)model.TeamRequest.Status,
            Message = model.TeamRequest.Message,
            User = model.User.ToUserShortDto(),
            CreatedAt = model.TeamRequest.CreatedAt,
            ResolvedAt = model.TeamRequest.ResolvedAt,
        };
    }

    public static TeamShortDto ToShortDto(this Team team)
    {
        return new TeamShortDto
        {
            Id = team.Id,
            EventId = team.HackatonId,
            Name = team.Name,
            Description = team.Description,
            Captain = null,
            MemberCount = team.TeamPositions.Count(x => x.UserId.HasValue),
            OpenPositionsCount = team.TeamPositions.Count(x => !x.UserId.HasValue && !x.FilledByExternal),
        };
    }

    private static EventShortDto ToEventShortDto(this TeamFullModel model)
    {
        var eventModel = model.Event;
        var startsAt = model.EventStartsAt ?? eventModel?.CreatedAt ?? model.Team.CreatedAt;
        var endsAt = model.EventEndsAt ?? eventModel?.UpdatedAt ?? model.Team.UpdatedAt ?? model.Team.CreatedAt;

        return new EventShortDto
        {
            Id = eventModel?.Id ?? model.Team.HackatonId,
            Name = eventModel?.Title ?? "Event",
            Type = eventModel?.Type == EventType.Other ? EventTypeDto.Other : EventTypeDto.Hackathon,
            StartsAt = startsAt,
            EndsAt = endsAt,
            Format = eventModel?.Format == EventFormat.Online ? EventFormatDto.Online : EventFormatDto.Offline,
            City = model.EventCity?.ToDto(),
        };
    }

    private static TeamMemberDto ToDto(TeamMemberFullModel model)
    {
        return new TeamMemberDto
        {
            PositionId = model.Position.Id,
            Title = ResolvePositionTitle(model.Position, null),
            IsCaptain = false,
            IsMandatoryRole = model.Position.Type == TeamPositionType.Mandatory,
            User = model.User.ToUserShortDto(),
        };
    }

    private static TeamPositionDto ToDto(TeamPositionFullModel model)
    {
        var specialization = model.Specialization ?? new Specialization(Guid.Empty, "Unknown");

        return new TeamPositionDto
        {
            Id = model.Position.Id,
            Title = ResolvePositionTitle(model.Position, model.Specialization),
            Description = null,
            Specialization = specialization.ToDto(),
            RequiredSkills = model.RequiredSkills.Select(SkillsConverter.ToDto).ToList(),
            MandatoryPositionId = model.Position.MandPositionData?.Id,
            IsMandatory = model.Position.Type == TeamPositionType.Mandatory,
            FilledByExternal = model.Position.FilledByExternal,
            User = model.User?.ToUserShortDto(),
            Requests = model.Requests.Select(ToShortDto).ToList(),
        };
    }

    private static UserShortDto ToUserShortDto(this User? user)
    {
        if (user is null)
        {
            return new UserShortDto
            {
                Id = Guid.Empty,
                UniqueName = "unknown",
                DisplayName = "Unknown user",
                AvatarUrl = null,
            };
        }

        return new UserShortDto
        {
            Id = user.Id,
            UniqueName = user.UniqueName,
            DisplayName = user.DisplayedName,
            AvatarUrl = user.AvatarUrl,
        };
    }

    private static string ResolvePositionTitle(TeamPosition position, Specialization? specialization)
    {
        if (specialization is not null)
            return specialization.Name;

        if (position.Type == TeamPositionType.Mandatory)
            return "Mandatory position";

        return "Position";
    }
}