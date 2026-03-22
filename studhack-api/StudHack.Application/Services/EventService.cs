using StudHack.Domain;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.Application.Services;

public class EventService(
    IEventRepository eventRepository,
    ICityRepository cityRepository,
    IEventDateRepository eventDateRepository,
    IHackatonRepository hackatonRepository,
    IMandatoryPositionRepository mandatoryPositionRepository,
    ISpecializationRepository specializationRepository,
    ISkillRepository skillRepository,
    ISubscriptionRepository subscriptionRepository,
    IUserRepository userRepository,
    ITeamService teamService) : IEventService
{
    public async Task<IReadOnlyCollection<EventFullModel>> GetEventsFullAsync(Guid authId, CancellationToken ct = default)
    {
        var events = (await eventRepository.GetAllAsync(ct)).ToList();
        var cities = (await cityRepository.GetAllAsync(ct)).ToDictionary(x => x.Id, x => x);
        var stages = (await eventDateRepository.GetAllAsync(ct)).ToList();
        var hackathons = (await hackatonRepository.GetAllAsync(ct)).ToList();
        var mandatory = (await mandatoryPositionRepository.GetAllAsync(ct)).ToList();
        var specializations = (await specializationRepository.GetAllAsync(ct)).ToDictionary(x => x.Id, x => x);
        var subscriptions = (await subscriptionRepository.GetAllAsync(ct)).ToList();
        var teams = await teamService.GetTeamsFullAsync(authId, ct);

        var currentUser = authId != Guid.Empty
            ? await userRepository.GetUserByAuthAsync(authId, ct)
            : null;

        return events
            .Select(e => BuildEventFull(
                e,
                cities,
                stages,
                hackathons,
                mandatory,
                specializations,
                subscriptions,
                teams,
                currentUser?.Id))
            .ToList();
    }

    public async Task<EventFullModel?> GetEventFullByIdAsync(Guid eventId, Guid authId, CancellationToken ct = default)
    {
        var ev = await eventRepository.GetByIdAsync(eventId, ct);
        if (ev is null)
            return null;

        var cities = (await cityRepository.GetAllAsync(ct)).ToDictionary(x => x.Id, x => x);
        var stages = (await eventDateRepository.GetAllAsync(ct)).ToList();
        var hackathons = (await hackatonRepository.GetAllAsync(ct)).ToList();
        var mandatory = (await mandatoryPositionRepository.GetAllAsync(ct)).ToList();
        var specializations = (await specializationRepository.GetAllAsync(ct)).ToDictionary(x => x.Id, x => x);
        var subscriptions = (await subscriptionRepository.GetAllAsync(ct)).ToList();
        var teams = await teamService.GetTeamsFullAsync(authId, ct);

        var currentUser = authId != Guid.Empty
            ? await userRepository.GetUserByAuthAsync(authId, ct)
            : null;

        return BuildEventFull(
            ev,
            cities,
            stages,
            hackathons,
            mandatory,
            specializations,
            subscriptions,
            teams,
            currentUser?.Id);
    }

    public async Task<EventFullModel> UpsertEventAsync(Guid authId, UpsertEventModel request, CancellationToken ct = default)
    {
        _ = await userRepository.GetUserByAuthAsync(authId, ct)
            ?? throw new UnauthorizedAccessException("User is not registered");

        if (!request.Location.CityId.HasValue)
            throw new InvalidOperationException("CityId is required for event upsert");

        var eventId = request.Id.HasValue && request.Id.Value != Guid.Empty
            ? request.Id.Value
            : Guid.NewGuid();

        var existingEvent = request.Id.HasValue && request.Id.Value != Guid.Empty
            ? await eventRepository.GetByIdAsync(request.Id.Value, ct)
            : null;

        var toSave = new Event(
            eventId,
            request.Name,
            request.Description ?? string.Empty,
            request.Location.CityId.Value,
            request.Location.AddressText,
            request.Type,
            request.RegistrationLink,
            request.Location.Format,
            request.Location.Latitude ?? 0,
            request.Location.Longitude ?? 0,
            existingEvent?.CreatedAt ?? DateTime.UtcNow,
            DateTime.UtcNow);

        if (existingEvent is null)
            await eventRepository.AddAsync(toSave, ct);
        else
            await eventRepository.UpdateAsync(toSave, ct);

        await ReplaceStagesAsync(eventId, request, ct);
        await ReplaceHackathonAsync(eventId, request, ct);

        return await GetEventFullByIdAsync(eventId, authId, ct)
               ?? throw new KeyNotFoundException("Event not found");
    }

    public async Task<EventSubscriptionModel> SetSubscriptionAsync(Guid authId, Guid eventId, bool subscribed,
        CancellationToken ct = default)
    {
        var currentUser = await userRepository.GetUserByAuthAsync(authId, ct)
            ?? throw new UnauthorizedAccessException("User is not registered");

        _ = await eventRepository.GetByIdAsync(eventId, ct)
            ?? throw new KeyNotFoundException("Event not found");

        var existing = await subscriptionRepository.GetByIdAsync(eventId, currentUser.Id, ct);
        if (subscribed && existing is null)
        {
            await subscriptionRepository.AddAsync(new Subscription(Guid.NewGuid(), eventId, currentUser.Id, DateTime.UtcNow), ct);
        }

        if (!subscribed && existing is not null)
        {
            await subscriptionRepository.DeleteAsync(eventId, currentUser.Id, ct);
        }

        var allSubscriptions = await subscriptionRepository.GetAllAsync(ct);
        var actual = allSubscriptions.Where(x => x.EventId == eventId).ToList();
        var mine = actual.FirstOrDefault(x => x.UserId == currentUser.Id);

        return new EventSubscriptionModel
        {
            IsSubscribed = mine is not null,
            SubscribedAt = mine?.CreatedAt,
            SubscribersCount = actual.Count,
        };
    }

    private async Task ReplaceStagesAsync(Guid eventId, UpsertEventModel request, CancellationToken ct)
    {
        var existing = (await eventDateRepository.GetAllAsync(ct)).Where(x => x.EventId == eventId).ToList();
        var incomingIds = request.Stages
            .Where(x => x.Id.HasValue && x.Id.Value != Guid.Empty)
            .Select(x => x.Id!.Value)
            .ToHashSet();

        foreach (var stage in existing.Where(x => !incomingIds.Contains(x.Id)))
        {
            await eventDateRepository.DeleteAsync(stage.EventId, stage.StartsAt, ct);
        }

        foreach (var input in request.Stages)
        {
            var startsAt = input.StartsAt ?? request.StartsAt;
            var endsAt = input.EndsAt ?? request.EndsAt;
            var eventDate = new EventDate(
                input.Id.HasValue && input.Id.Value != Guid.Empty ? input.Id.Value : Guid.NewGuid(),
                eventId,
                startsAt,
                endsAt,
                input.Description);

            if (input.Id.HasValue && input.Id.Value != Guid.Empty)
            {
                var old = existing.FirstOrDefault(x => x.Id == input.Id.Value);
                if (old is not null && old.StartsAt != startsAt)
                {
                    await eventDateRepository.DeleteAsync(old.EventId, old.StartsAt, ct);
                    await eventDateRepository.AddAsync(eventDate, ct);
                }
                else if (old is not null)
                {
                    await eventDateRepository.UpdateAsync(eventDate, ct);
                }
                else
                {
                    await eventDateRepository.AddAsync(eventDate, ct);
                }
            }
            else
            {
                await eventDateRepository.AddAsync(eventDate, ct);
            }
        }
    }

    private async Task ReplaceHackathonAsync(Guid eventId, UpsertEventModel request, CancellationToken ct)
    {
        var existingHackathon = (await hackatonRepository.GetAllAsync(ct)).FirstOrDefault(x => x.EventId == eventId);

        if (request.Hackathon is null)
        {
            if (existingHackathon is not null)
            {
                var mandatory = (await mandatoryPositionRepository.GetAllAsync(ct))
                    .Where(x => x.HackatonId == existingHackathon.Id)
                    .ToList();

                foreach (var mandatoryPosition in mandatory)
                {
                    await mandatoryPositionRepository.DeleteAsync(mandatoryPosition.Id, ct);
                }

                await hackatonRepository.DeleteAsync(existingHackathon.Id, ct);
            }

            return;
        }

        var hackathon = new Hackaton(
            existingHackathon?.Id ?? eventId,
            eventId,
            request.Hackathon.MaxTeamSize,
            request.Hackathon.MinTeamSize);

        if (existingHackathon is null)
            await hackatonRepository.AddAsync(hackathon, ct);
        else
            await hackatonRepository.UpdateAsync(hackathon, ct);

        await ReplaceMandatoryPositionsAsync(hackathon.Id, request.Hackathon, ct);
    }

    private async Task ReplaceMandatoryPositionsAsync(Guid hackathonId, UpsertHackathonModel request,
        CancellationToken ct)
    {
        var existing = (await mandatoryPositionRepository.GetAllAsync(ct)).Where(x => x.HackatonId == hackathonId).ToList();
        var incomingIds = request.MandatoryPositions
            .Where(x => x.Id.HasValue && x.Id.Value != Guid.Empty)
            .Select(x => x.Id!.Value)
            .ToHashSet();

        foreach (var mandatoryPosition in existing.Where(x => !incomingIds.Contains(x.Id)))
        {
            await mandatoryPositionRepository.DeleteAsync(mandatoryPosition.Id, ct);
        }

        var allSkills = (await skillRepository.GetAllAsync(ct)).ToDictionary(x => x.Id, x => x);

        foreach (var input in request.MandatoryPositions)
        {
            var skillList = input.RequiredSkillIds
                .Where(allSkills.ContainsKey)
                .Select(x => allSkills[x])
                .ToList();

            var mandatoryPosition = new MandatoryPositionData(
                input.Id.HasValue && input.Id.Value != Guid.Empty ? input.Id.Value : Guid.NewGuid(),
                hackathonId,
                input.SpecializationId,
                skillList);

            var shouldUpdate = input.Id.HasValue && input.Id.Value != Guid.Empty && existing.Any(x => x.Id == input.Id.Value);
            if (shouldUpdate)
                await mandatoryPositionRepository.UpdateAsync(mandatoryPosition, ct);
            else
                await mandatoryPositionRepository.AddAsync(mandatoryPosition, ct);
        }
    }

    private EventFullModel BuildEventFull(
        Event ev,
        IReadOnlyDictionary<Guid, City> cities,
        IReadOnlyCollection<EventDate> allStages,
        IReadOnlyCollection<Hackaton> allHackathons,
        IReadOnlyCollection<MandatoryPositionData> allMandatory,
        IReadOnlyDictionary<Guid, Specialization> allSpecializations,
        IReadOnlyCollection<Subscription> allSubscriptions,
        IReadOnlyCollection<TeamFullModel> allTeams,
        Guid? currentUserId)
    {
        var stages = allStages
            .Where(x => x.EventId == ev.Id)
            .OrderBy(x => x.StartsAt)
            .ThenBy(x => x.EndsAt)
            .ToList();

        var hackathon = allHackathons.FirstOrDefault(x => x.EventId == ev.Id);
        var mandatory = hackathon is null
            ? []
            : allMandatory.Where(x => x.HackatonId == hackathon.Id).ToList();

        var mandatoryFull = mandatory
            .Where(x => allSpecializations.ContainsKey(x.SpecializationId))
            .Select(x => new EventMandatoryPositionFullModel
            {
                MandatoryPosition = x,
                Specialization = allSpecializations[x.SpecializationId],
            })
            .ToList();

        var subs = allSubscriptions.Where(x => x.EventId == ev.Id).ToList();
        var mine = currentUserId.HasValue ? subs.FirstOrDefault(x => x.UserId == currentUserId.Value) : null;

        var teams = allTeams.Where(x => x.Event?.Id == ev.Id).ToList();

        return new EventFullModel
        {
            Event = ev,
            City = cities.GetValueOrDefault(ev.CityId),
            Stages = stages,
            Hackathon = hackathon,
            MandatoryPositions = mandatoryFull,
            Subscription = new EventSubscriptionModel
            {
                IsSubscribed = mine is not null,
                SubscribedAt = mine?.CreatedAt,
                SubscribersCount = subs.Count,
            },
            Teams = teams,
        };
    }
}
