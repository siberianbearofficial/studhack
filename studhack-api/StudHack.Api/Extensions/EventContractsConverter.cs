using StudHack.Api.Dtos;
using StudHack.Api.Enums;
using StudHack.Domain;
using StudHack.Domain.Models;

namespace StudHack.Api.Extensions;

public static class EventContractsConverter
{
    public static UpsertEventModel ToDomain(this UpsertEventRequest dto)
    {
        return new UpsertEventModel
        {
            Id = NormalizeNullableGuid(dto.Id),
            Name = dto.Name,
            Type = dto.Type == EventTypeDto.Other ? EventType.Other : EventType.Hackaton,
            Description = dto.Description,
            RegistrationLink = dto.RegistrationLink,
            StartsAt = dto.StartsAt,
            EndsAt = dto.EndsAt,
            Location = new UpsertEventLocationModel
            {
                Format = dto.Location.Format == EventFormatDto.Online
                    ? EventFormat.Online
                    : EventFormat.Offline,
                CityId = NormalizeNullableGuid(dto.Location.CityId),
                AddressText = dto.Location.AddressText,
                VenueName = dto.Location.VenueName,
                Latitude = dto.Location.Latitude,
                Longitude = dto.Location.Longitude,
            },
            Stages = dto.Stages.Select(s => new UpsertEventStageModel
            {
                Id = NormalizeNullableGuid(s.Id),
                Code = s.Code,
                Title = s.Title,
                Description = s.Description,
                StartsAt = s.StartsAt,
                EndsAt = s.EndsAt,
                Order = s.Order,
            }).ToList(),
            Hackathon = dto.Hackathon is null
                ? null
                : new UpsertHackathonModel
                {
                    MinTeamSize = dto.Hackathon.MinTeamSize,
                    MaxTeamSize = dto.Hackathon.MaxTeamSize,
                    MandatoryPositions = dto.Hackathon.MandatoryPositions
                        .Select(m => new UpsertMandatoryPositionModel
                        {
                            Id = NormalizeNullableGuid(m.Id),
                            Title = m.Title,
                            SpecializationId = m.SpecializationId,
                            RequiredSkillIds = m.RequiredSkillIds.ToArray(),
                        })
                        .ToList(),
                },
        };
    }

    public static EventFullDto ToDto(this EventFullModel model)
    {
        var isOnline = model.Event.Format == EventFormat.Online;
        var stages = model.Stages
            .OrderBy(x => x.StartsAt)
            .ThenBy(x => x.EndsAt)
            .Select((x, index) => new EventStageDto
            {
                Id = x.Id,
                Code = $"stage_{index + 1}",
                Title = x.Description ?? $"Stage {index + 1}",
                Description = x.Description,
                StartsAt = x.StartsAt,
                EndsAt = x.EndsAt,
                Order = index + 1,
            })
            .ToList();

        var startsAt = stages.Count > 0 ? stages.Min(x => x.StartsAt) ?? model.Event.CreatedAt : model.Event.CreatedAt;
        var endsAt = stages.Count > 0 ? stages.Max(x => x.EndsAt) ?? model.Event.UpdatedAt : model.Event.UpdatedAt;

        return new EventFullDto
        {
            Id = model.Event.Id,
            Name = model.Event.Title,
            Type = model.Event.Type == EventType.Other ? EventTypeDto.Other : EventTypeDto.Hackathon,
            Description = model.Event.Description,
            RegistrationLink = model.Event.RegistrationLink,
            Location = new EventLocationDto
            {
                Format = isOnline ? EventFormatDto.Online : EventFormatDto.Offline,
                City = isOnline ? null : model.City?.ToDto(),
                AddressText = isOnline ? null : model.Event.Address,
                VenueName = null,
                Latitude = model.Event.Latitude,
                Longitude = model.Event.Longitude,
            },
            StartsAt = startsAt,
            EndsAt = endsAt,
            Stages = stages,
            Hackathon = model.Hackathon is null
                ? null
                : new HackathonDetailsDto
                {
                    EventId = model.Event.Id,
                    MinTeamSize = model.Hackathon.MinTeamSize,
                    MaxTeamSize = model.Hackathon.MaxTeamSize,
                    MandatoryPositions = model.MandatoryPositions
                        .Select(x => new MandatoryPositionDto
                        {
                            Id = x.MandatoryPosition.Id,
                            Title = x.Specialization.Name,
                            Specialization = x.Specialization.ToDto(),
                            RequiredSkills = x.MandatoryPosition.Skills.Select(SkillsConverter.ToDto).ToList(),
                        })
                        .ToList(),
                },
            Subscription = new EventSubscriptionDto
            {
                IsSubscribed = model.Subscription.IsSubscribed,
                SubscribedAt = model.Subscription.SubscribedAt,
                SubscribersCount = model.Subscription.SubscribersCount,
            },
            Teams = model.Teams.Select(TeamContractsOutputConverter.ToInEventDto).ToList(),
            CreatedAt = model.Event.CreatedAt,
            UpdatedAt = model.Event.UpdatedAt,
        };
    }

    private static Guid? NormalizeNullableGuid(Guid? id)
    {
        return id.HasValue && id.Value != Guid.Empty ? id : null;
    }
}
