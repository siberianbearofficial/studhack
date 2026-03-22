using StudHack.Domain;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.Application.Services;

public class TeamService(
    ITeamRepository teamRepository,
    ITeamPositionRepository teamPositionRepository,
    ITeamRequestRepository teamRequestRepository,
    IUserRepository userRepository,
    IHackatonRepository hackatonRepository,
    IEventRepository eventRepository,
    IEventDateRepository eventDateRepository,
    ICityRepository cityRepository,
    ISpecializationRepository specializationRepository,
    ISkillRepository skillRepository,
    IAdditionalPositionDataRepository additionalPositionDataRepository,
    IMandatoryPositionRepository mandatoryPositionRepository) : ITeamService
{
    public async Task<IReadOnlyCollection<TeamFullModel>> GetTeamsFullAsync(Guid authId, CancellationToken ct = default)
    {
        _ = authId;
        var teams = await teamRepository.GetAllAsync(ct);
        var result = new List<TeamFullModel>();

        foreach (var team in teams)
        {
            result.Add(await BuildTeamFullAsync(team, ct));
        }

        return result;
    }

    public async Task<TeamFullModel?> GetTeamFullByIdAsync(Guid teamId, Guid authId, CancellationToken ct = default)
    {
        _ = authId;
        var team = await teamRepository.GetByIdAsync(teamId, ct);
        if (team is null)
            return null;

        return await BuildTeamFullAsync(team, ct);
    }

    public async Task<TeamFullModel> UpsertTeamAsync(Guid authId, UpsertTeamModel request, CancellationToken ct = default)
    {
        var currentUser = await userRepository.GetUserByAuthAsync(authId, ct)
            ?? throw new UnauthorizedAccessException("User is not registered");

        var hackatonId = await ResolveHackatonIdAsync(request.EventId, ct);
        var captainId = request.CaptainUserId ?? currentUser.Id;

        if (request.Id.HasValue)
        {
            var existingTeam = await teamRepository.GetByIdAsync(request.Id.Value, ct)
                ?? throw new KeyNotFoundException("Team not found");

            EnsureManageAccess(existingTeam, currentUser.Id);

            var updated = new Team(
                existingTeam.Id,
                existingTeam.HackatonId,
                captainId,
                existingTeam.CreatorId,
                request.Name,
                request.Description,
                existingTeam.CreatedAt,
                DateTime.UtcNow,
                []);

            await teamRepository.UpdateAsync(updated, ct);
            await ReplaceTeamPositionsAsync(updated.Id, request.Positions, ct);

            return await BuildTeamFullAsync(updated, ct);
        }

        var createdTeam = new Team(
            Guid.NewGuid(),
            hackatonId,
            captainId,
            currentUser.Id,
            request.Name,
            request.Description,
            DateTime.UtcNow,
            DateTime.UtcNow,
            []);

        await teamRepository.AddAsync(createdTeam, ct);
        await ReplaceTeamPositionsAsync(createdTeam.Id, request.Positions, ct);

        return await BuildTeamFullAsync(createdTeam, ct);
    }

    public async Task<bool> DeleteTeamAsync(Guid teamId, Guid authId, CancellationToken ct = default)
    {
        var currentUser = await userRepository.GetUserByAuthAsync(authId, ct)
            ?? throw new UnauthorizedAccessException("User is not registered");

        var team = await teamRepository.GetByIdAsync(teamId, ct)
            ?? throw new KeyNotFoundException("Team not found");

        EnsureManageAccess(team, currentUser.Id);

        var positions = (await teamPositionRepository.GetAllAsync(ct)).Where(x => x.TeamId == teamId).ToList();
        foreach (var position in positions)
        {
            await teamPositionRepository.DeleteAsync(position.Id, ct);
        }

        return await teamRepository.DeleteAsync(teamId, ct);
    }

    private static void EnsureManageAccess(Team team, Guid userId)
    {
        if (team.CreatorId != userId && team.CaptainId != userId)
            throw new UnauthorizedAccessException("Only creator or captain can manage this team");
    }

    private async Task<Guid> ResolveHackatonIdAsync(Guid eventId, CancellationToken ct)
    {
        var bySameId = await hackatonRepository.GetByIdAsync(eventId, ct);
        if (bySameId is not null)
            return bySameId.Id;

        var all = await hackatonRepository.GetAllAsync(ct);
        var byEvent = all.FirstOrDefault(x => x.EventId == eventId);
        if (byEvent is not null)
            return byEvent.Id;

        throw new KeyNotFoundException("Hackaton for event was not found");
    }

    private async Task ReplaceTeamPositionsAsync(Guid teamId, IReadOnlyCollection<UpsertTeamPositionModel> inputs,
        CancellationToken ct)
    {
        var existing = (await teamPositionRepository.GetAllAsync(ct)).Where(x => x.TeamId == teamId).ToList();
        var incomingIds = inputs.Where(x => x.Id.HasValue).Select(x => x.Id!.Value).ToHashSet();

        foreach (var existingPosition in existing.Where(x => !incomingIds.Contains(x.Id)))
        {
            await teamPositionRepository.DeleteAsync(existingPosition.Id, ct);
        }

        foreach (var input in inputs)
        {
            var existingPosition = input.Id.HasValue ? existing.FirstOrDefault(x => x.Id == input.Id.Value) : null;

            MandatoryPositionData? mandatoryPosition = null;
            AdditionalPositionData? additionalPosition = null;
            TeamPositionType type;

            if (input.MandatoryPositionId.HasValue)
            {
                mandatoryPosition = await mandatoryPositionRepository.GetByIdAsync(input.MandatoryPositionId.Value, ct)
                    ?? throw new KeyNotFoundException("Mandatory position was not found");
                type = TeamPositionType.Mandatory;
            }
            else
            {
                if (!input.SpecializationId.HasValue)
                    throw new InvalidOperationException("SpecializationId is required for additional positions");

                var allSkills = await skillRepository.GetAllAsync(ct);
                var skills = allSkills.Where(s => input.RequiredSkillIds.Contains(s.Id)).ToList();

                var additionalId = existingPosition?.AddPositionData?.Id ?? Guid.NewGuid();
                additionalPosition = new AdditionalPositionData(additionalId, input.SpecializationId.Value, skills);

                if (existingPosition?.AddPositionData is null)
                    await additionalPositionDataRepository.AddAsync(additionalPosition, ct);
                else
                    await additionalPositionDataRepository.UpdateAsync(additionalPosition, ct);

                type = TeamPositionType.Additional;
            }

            var position = new TeamPosition(
                input.Id ?? Guid.NewGuid(),
                teamId,
                input.FilledByExternal,
                type,
                input.UserId,
                additionalPosition,
                mandatoryPosition);

            if (existingPosition is null)
                await teamPositionRepository.AddAsync(position, ct);
            else
                await teamPositionRepository.UpdateAsync(position, ct);
        }
    }

    private async Task<TeamFullModel> BuildTeamFullAsync(Team team, CancellationToken ct)
    {
        var positions = (await teamPositionRepository.GetAllAsync(ct)).Where(x => x.TeamId == team.Id).ToList();
        var requests = await teamRequestRepository.GetAllAsync(ct);
        var requestByPosition = requests
            .Where(x => positions.Any(p => p.Id == x.TeamPositionId))
            .GroupBy(x => x.TeamPositionId)
            .ToDictionary(x => x.Key, x => x.ToList());

        var userIds = new HashSet<Guid> { team.CreatorId, team.CaptainId };
        foreach (var p in positions.Where(x => x.UserId.HasValue))
        {
            userIds.Add(p.UserId!.Value);
        }

        foreach (var r in requests.Where(x => positions.Any(p => p.Id == x.TeamPositionId)))
        {
            userIds.Add(r.UserId);
        }

        var users = await userRepository.GetUsersAsync(ct);
        var userMap = users.Where(x => userIds.Contains(x.Id)).ToDictionary(x => x.Id, x => x);

        var specializations = await specializationRepository.GetAllAsync(ct);
        var specializationMap = specializations.ToDictionary(x => x.Id, x => x);

        var positionModels = new List<TeamPositionFullModel>();
        foreach (var position in positions)
        {
            var specializationId = position.Type == TeamPositionType.Mandatory
                ? position.MandPositionData?.SpecializationId
                : position.AddPositionData?.SpecializationId;

            var specialization = specializationId.HasValue && specializationMap.TryGetValue(specializationId.Value, out var s)
                ? s
                : null;

            var positionRequests = new List<TeamRequestFullModel>();
            if (requestByPosition.TryGetValue(position.Id, out var requestsForPosition))
            {
                foreach (var request in requestsForPosition)
                {
                    if (!userMap.TryGetValue(request.UserId, out var requestUser))
                        continue;

                    positionRequests.Add(new TeamRequestFullModel
                    {
                        TeamRequest = request,
                        User = requestUser,
                        Team = team,
                        TeamPosition = position,
                        PositionSpecialization = specialization,
                    });
                }
            }

            var requiredSkills = position.Type == TeamPositionType.Mandatory
                ? position.MandPositionData?.Skills ?? []
                : position.AddPositionData?.Skills ?? [];

            positionModels.Add(new TeamPositionFullModel
            {
                Position = position,
                Specialization = specialization,
                RequiredSkills = requiredSkills.ToList(),
                User = position.UserId.HasValue && userMap.TryGetValue(position.UserId.Value, out var assignedUser)
                    ? assignedUser
                    : null,
                Requests = positionRequests,
            });
        }

        var members = positionModels
            .Where(x => x.User is not null)
            .Select(x => new TeamMemberFullModel
            {
                Position = x.Position,
                User = x.User!,
            })
            .ToList();

        Event? eventModel = null;
        City? eventCity = null;
        DateTime? eventStartsAt = null;
        DateTime? eventEndsAt = null;
        var hackaton = await hackatonRepository.GetByIdAsync(team.HackatonId, ct);
        if (hackaton is not null)
        {
            eventModel = await eventRepository.GetByIdAsync(hackaton.EventId, ct);
            if (eventModel is not null)
            {
                eventCity = await cityRepository.GetByIdAsync(eventModel.CityId, ct);
                var eventDates = (await eventDateRepository.GetAllAsync(ct))
                    .Where(x => x.EventId == eventModel.Id)
                    .ToList();

                if (eventDates.Count > 0)
                {
                    eventStartsAt = eventDates.Min(x => x.StartsAt);
                    eventEndsAt = eventDates.Max(x => x.EndsAt);
                }
            }
        }

        return new TeamFullModel
        {
            Team = team,
            Event = eventModel,
            EventCity = eventCity,
            EventStartsAt = eventStartsAt,
            EventEndsAt = eventEndsAt,
            Creator = userMap.GetValueOrDefault(team.CreatorId),
            Captain = userMap.GetValueOrDefault(team.CaptainId),
            Positions = positionModels,
            Members = members,
        };
    }
}