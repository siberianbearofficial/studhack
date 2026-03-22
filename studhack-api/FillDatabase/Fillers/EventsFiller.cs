using System.Reflection;
using System.Text.Json;
using FillDatabase.Models;
using Microsoft.Extensions.Logging;
using StudHack.Domain;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace FillDatabase.Fillers;

public class EventsFiller(
    ICityRepository cityRepository,
    IEventRepository eventRepository,
    IEventDateRepository eventDateRepository,
    IHackatonRepository hackatonRepository,
    IMandatoryPositionRepository mandatoryPositionRepository,
    ISpecializationRepository specializationRepository,
    ISkillRepository skillRepository,
    ILogger<EventsFiller> logger) : IFiller
{
    private const string EventsResourceName = "FillDatabase.Data.events.json";
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public async Task FillAsync()
    {
        var seeds = await LoadEventsAsync();
        if (seeds.Length == 0)
        {
            logger.LogWarning("No events found in seed resource {ResourceName}", EventsResourceName);
            return;
        }

        var citiesByName = (await cityRepository.GetAllAsync())
            .GroupBy(city => NormalizeKey(city.Name))
            .ToDictionary(group => group.Key, group => group.First());

        var eventsByName = (await eventRepository.GetAllAsync())
            .GroupBy(ev => NormalizeKey(ev.Title))
            .ToDictionary(group => group.Key, group => group.First());

        var stagesByEventId = (await eventDateRepository.GetAllAsync())
            .GroupBy(stage => stage.EventId)
            .ToDictionary(group => group.Key, group => group.ToList());

        var hackathonsByEventId = (await hackatonRepository.GetAllAsync())
            .GroupBy(hackathon => hackathon.EventId)
            .ToDictionary(group => group.Key, group => group.First());

        var mandatoryByHackathonId = (await mandatoryPositionRepository.GetAllAsync())
            .GroupBy(position => position.HackatonId)
            .ToDictionary(group => group.Key, group => group.ToList());

        var specializationsByName = (await specializationRepository.GetAllAsync())
            .GroupBy(specialization => NormalizeKey(specialization.Name))
            .ToDictionary(group => group.Key, group => group.First());

        var skillsByName = (await skillRepository.GetAllAsync())
            .GroupBy(skill => NormalizeKey(skill.Name))
            .ToDictionary(group => group.Key, group => group.First());

        foreach (var seed in seeds)
        {
            var eventModel = await EnsureEventAsync(seed, citiesByName, eventsByName);
            await EnsureStagesAsync(seed, eventModel, stagesByEventId);
            await EnsureHackathonAsync(
                seed,
                eventModel,
                hackathonsByEventId,
                mandatoryByHackathonId,
                specializationsByName,
                skillsByName);
        }
    }

    private async Task<EventSeedModel[]> LoadEventsAsync()
    {
        await using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(EventsResourceName);
        if (stream is null)
            throw new FileNotFoundException($"Embedded resource {EventsResourceName} was not found.");

        return await JsonSerializer.DeserializeAsync<EventSeedModel[]>(stream, JsonOptions) ?? [];
    }

    private async Task<Event> EnsureEventAsync(
        EventSeedModel seed,
        IReadOnlyDictionary<string, City> citiesByName,
        IDictionary<string, Event> eventsByName)
    {
        var normalizedName = NormalizeKey(seed.Name);
        if (eventsByName.TryGetValue(normalizedName, out var existing))
        {
            logger.LogInformation("Event '{EventName}' already exists, ensuring nested data only", seed.Name);
            return existing;
        }

        var city = ResolveCity(seed, citiesByName);
        var eventModel = new Event(
            Guid.NewGuid(),
            seed.Name,
            seed.Description ?? string.Empty,
            city.Id,
            seed.Location.AddressText,
            ParseEventType(seed.Type),
            seed.RegistrationLink,
            ParseEventFormat(seed.Location.Format),
            seed.Location.Latitude ?? 0,
            seed.Location.Longitude ?? 0,
            ToUtc(seed.CreatedAt),
            ToUtc(seed.UpdatedAt));

        await eventRepository.AddAsync(eventModel);
        eventsByName[normalizedName] = eventModel;

        logger.LogInformation("Seeded event '{EventName}'", seed.Name);
        return eventModel;
    }

    private async Task EnsureStagesAsync(
        EventSeedModel seed,
        Event eventModel,
        IDictionary<Guid, List<EventDate>> stagesByEventId)
    {
        var existingStages = stagesByEventId.TryGetValue(eventModel.Id, out var stages)
            ? stages
            : [];
        var existingStageKeys = existingStages
            .Select(GetStageKey)
            .ToHashSet(StringComparer.Ordinal);

        foreach (var stageSeed in seed.Stages)
        {
            var candidate = new EventDate(
                Guid.NewGuid(),
                eventModel.Id,
                ToUtc(stageSeed.StartsAt),
                ToUtc(stageSeed.EndsAt),
                stageSeed.Title);

            if (existingStageKeys.Contains(GetStageKey(candidate)))
                continue;

            await eventDateRepository.AddAsync(candidate);
            existingStages.Add(candidate);
            existingStageKeys.Add(GetStageKey(candidate));
        }

        stagesByEventId[eventModel.Id] = existingStages;
    }

    private async Task EnsureHackathonAsync(
        EventSeedModel seed,
        Event eventModel,
        IDictionary<Guid, Hackaton> hackathonsByEventId,
        IDictionary<Guid, List<MandatoryPositionData>> mandatoryByHackathonId,
        IReadOnlyDictionary<string, Specialization> specializationsByName,
        IReadOnlyDictionary<string, Skill> skillsByName)
    {
        if (seed.Hackathon is null)
            return;

        if (!hackathonsByEventId.TryGetValue(eventModel.Id, out var hackathon))
        {
            hackathon = new Hackaton(
                eventModel.Id,
                eventModel.Id,
                seed.Hackathon.MaxTeamSize,
                seed.Hackathon.MinTeamSize);

            await hackatonRepository.AddAsync(hackathon);
            hackathonsByEventId[eventModel.Id] = hackathon;
        }
        else if (hackathon.MinTeamSize != seed.Hackathon.MinTeamSize ||
                 hackathon.MaxTeamSize != seed.Hackathon.MaxTeamSize)
        {
            hackathon = new Hackaton(
                hackathon.Id,
                eventModel.Id,
                seed.Hackathon.MaxTeamSize,
                seed.Hackathon.MinTeamSize);

            await hackatonRepository.UpdateAsync(hackathon);
            hackathonsByEventId[eventModel.Id] = hackathon;
        }

        var existingMandatory = mandatoryByHackathonId.TryGetValue(hackathon.Id, out var mandatory)
            ? mandatory
            : [];

        foreach (var positionSeed in seed.Hackathon.MandatoryPositions)
        {
            var specialization = ResolveSpecialization(positionSeed.SpecializationName, specializationsByName, seed.Name);
            var requiredSkills = ResolveSkills(positionSeed.RequiredSkillNames, skillsByName, seed.Name).ToArray();

            var current = existingMandatory.FirstOrDefault(position => position.SpecializationId == specialization.Id);
            if (current is null)
            {
                var mandatoryPosition = new MandatoryPositionData(
                    Guid.NewGuid(),
                    hackathon.Id,
                    specialization.Id,
                    requiredSkills);

                await mandatoryPositionRepository.AddAsync(mandatoryPosition);
                existingMandatory.Add(mandatoryPosition);
                continue;
            }

            if (HaveSameSkills(current.Skills, requiredSkills))
                continue;

            var updatedPosition = new MandatoryPositionData(
                current.Id,
                hackathon.Id,
                specialization.Id,
                requiredSkills);

            await mandatoryPositionRepository.UpdateAsync(updatedPosition);
            existingMandatory.Remove(current);
            existingMandatory.Add(updatedPosition);
        }

        mandatoryByHackathonId[hackathon.Id] = existingMandatory;
    }

    private City ResolveCity(EventSeedModel seed, IReadOnlyDictionary<string, City> citiesByName)
    {
        foreach (var cityName in seed.Location.CityNames)
        {
            var normalizedName = NormalizeKey(cityName);
            if (citiesByName.TryGetValue(normalizedName, out var city))
                return city;
        }

        throw new InvalidOperationException(
            $"Unable to resolve city for event '{seed.Name}'. Expected one of: {string.Join(", ", seed.Location.CityNames)}.");
    }

    private Specialization ResolveSpecialization(
        string specializationName,
        IReadOnlyDictionary<string, Specialization> specializationsByName,
        string eventName)
    {
        var normalizedName = NormalizeKey(specializationName);
        if (specializationsByName.TryGetValue(normalizedName, out var specialization))
            return specialization;

        throw new InvalidOperationException(
            $"Unable to resolve specialization '{specializationName}' for event '{eventName}'.");
    }

    private IEnumerable<Skill> ResolveSkills(
        IEnumerable<string> skillNames,
        IReadOnlyDictionary<string, Skill> skillsByName,
        string eventName)
    {
        foreach (var skillName in skillNames)
        {
            var normalizedName = NormalizeKey(skillName);
            if (!skillsByName.TryGetValue(normalizedName, out var skill))
            {
                throw new InvalidOperationException(
                    $"Unable to resolve skill '{skillName}' for event '{eventName}'.");
            }

            yield return skill;
        }
    }

    private static bool HaveSameSkills(IEnumerable<Skill> left, IEnumerable<Skill> right)
    {
        var leftIds = left.Select(skill => skill.Id).OrderBy(id => id).ToArray();
        var rightIds = right.Select(skill => skill.Id).OrderBy(id => id).ToArray();
        return leftIds.SequenceEqual(rightIds);
    }

    private static EventType ParseEventType(string value)
    {
        return value.Trim().ToLowerInvariant() switch
        {
            "hackathon" => EventType.Hackaton,
            "other" => EventType.Other,
            _ => throw new InvalidOperationException($"Unsupported event type '{value}'."),
        };
    }

    private static EventFormat ParseEventFormat(string value)
    {
        return value.Trim().ToLowerInvariant() switch
        {
            "online" => EventFormat.Online,
            "offline" => EventFormat.Offline,
            _ => throw new InvalidOperationException($"Unsupported event format '{value}'."),
        };
    }

    private static string NormalizeKey(string value)
    {
        return value.Trim().ToLowerInvariant();
    }

    private static string GetStageKey(EventDate stage)
    {
        return $"{stage.EventId:N}|{stage.StartsAt:O}|{stage.EndsAt:O}|{NormalizeKey(stage.Description ?? string.Empty)}";
    }

    private static DateTime ToUtc(DateTime value)
    {
        return value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc),
        };
    }
}
