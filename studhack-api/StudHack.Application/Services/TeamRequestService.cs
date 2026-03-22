using StudHack.Domain;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.Application.Services;

public class TeamRequestService(
    ITeamRequestRepository teamRequestRepository,
    ITeamPositionRepository teamPositionRepository,
    ITeamRepository teamRepository,
    IUserRepository userRepository,
    ISpecializationRepository specializationRepository) : ITeamRequestService
{
    public async Task<TeamRequestFeedModel> GetFeedAsync(Guid authId, CancellationToken ct = default)
    {
        var currentUser = await userRepository.GetUserByAuthAsync(authId, ct)
            ?? throw new UnauthorizedAccessException("User is not registered");
        Console.WriteLine(currentUser.Id);

        var requests = (await teamRequestRepository.GetAllAsync(ct)).ToList();
        var allPositions = (await teamPositionRepository.GetAllAsync(ct)).ToDictionary(x => x.Id, x => x);
        var allTeams = (await teamRepository.GetAllAsync(ct)).ToDictionary(x => x.Id, x => x);

        var managedTeamIds = allTeams.Values
            .Where(x => x.CreatorId == currentUser.Id || x.CaptainId == currentUser.Id)
            .Select(x => x.Id)
            .ToHashSet();

        var inbox = new List<TeamRequestFullModel>();
        var outbox = new List<TeamRequestFullModel>();
        var managed = new List<TeamRequestFullModel>();

        foreach (var request in requests)
        {
            var details = await BuildDetailsAsync(request, allPositions, allTeams, ct);

            if (request.Type == TeamRequestType.Invitation && request.UserId == currentUser.Id)
                inbox.Add(details);

            if (request.Type == TeamRequestType.Application && request.UserId == currentUser.Id)
                outbox.Add(details);

            if (managedTeamIds.Contains(details.Team.Id))
                managed.Add(details);
        }

        return new TeamRequestFeedModel
        {
            Inbox = inbox,
            Outbox = outbox,
            ManagedTeams = managed,
        };
    }

    public async Task<TeamRequestFullModel> CreateAsync(Guid authId, CreateTeamRequestModel request,
        CancellationToken ct = default)
    {
        var currentUser = await userRepository.GetUserByAuthAsync(authId, ct)
            ?? throw new UnauthorizedAccessException("User is not registered");

        var teamPosition = await teamPositionRepository.GetByIdAsync(request.TeamPositionId, ct)
            ?? throw new KeyNotFoundException("Team position not found");

        var team = await teamRepository.GetByIdAsync(teamPosition.TeamId, ct)
            ?? throw new KeyNotFoundException("Team not found");

        var targetUserId = request.Type switch
        {
            TeamRequestType.Application => currentUser.Id,
            TeamRequestType.Invitation => request.InvitedUserId
                ?? throw new InvalidOperationException("InvitedUserId is required for invitation"),
            _ => throw new InvalidOperationException("Unsupported request type")
        };

        var allRequests = await teamRequestRepository.GetAllAsync(ct);
        var hasPending = allRequests.Any(x => x.TeamPositionId == request.TeamPositionId &&
                                              x.UserId == targetUserId &&
                                              x.Status == TeamRequestStatus.Pending);
        if (hasPending)
            throw new InvalidOperationException("A pending request already exists for this user and position");

        var created = new TeamRequest(
            Guid.NewGuid(),
            request.TeamPositionId,
            targetUserId,
            request.Type,
            TeamRequestStatus.Pending,
            request.Message,
            DateTime.UtcNow,
            null);

        var saved = await teamRequestRepository.AddAsync(created, ct);

        var requestMap = new Dictionary<Guid, TeamPosition> { [teamPosition.Id] = teamPosition };
        var teamMap = new Dictionary<Guid, Team> { [team.Id] = team };
        return await BuildDetailsAsync(saved, requestMap, teamMap, ct);
    }

    public async Task<TeamRequestFullModel> ResolveAsync(Guid requestId, Guid authId, TeamRequestStatus status,
        CancellationToken ct = default)
    {
        var currentUser = await userRepository.GetUserByAuthAsync(authId, ct)
            ?? throw new UnauthorizedAccessException("User is not registered");

        var teamRequest = await teamRequestRepository.GetByIdAsync(requestId, ct)
            ?? throw new KeyNotFoundException("Team request not found");

        var teamPosition = await teamPositionRepository.GetByIdAsync(teamRequest.TeamPositionId, ct)
            ?? throw new KeyNotFoundException("Team position not found");

        var team = await teamRepository.GetByIdAsync(teamPosition.TeamId, ct)
            ?? throw new KeyNotFoundException("Team not found");

        var isManager = team.CreatorId == currentUser.Id || team.CaptainId == currentUser.Id;
        var isOwner = teamRequest.UserId == currentUser.Id;

        if (!isManager && !(status == TeamRequestStatus.Cancelled && isOwner))
            throw new UnauthorizedAccessException("You cannot resolve this request");

        if (status == TeamRequestStatus.Approved)
        {
            if (teamPosition.UserId.HasValue)
                throw new InvalidOperationException("Position is already filled");

            var updatedPosition = new TeamPosition(
                teamPosition.Id,
                teamPosition.TeamId,
                teamPosition.FilledByExternal,
                teamPosition.Type,
                teamRequest.UserId,
                teamPosition.AddPositionData,
                teamPosition.MandPositionData);

            await teamPositionRepository.UpdateAsync(updatedPosition, ct);
        }

        var updatedRequest = new TeamRequest(
            teamRequest.Id,
            teamRequest.TeamPositionId,
            teamRequest.UserId,
            teamRequest.Type,
            status,
            teamRequest.Message,
            teamRequest.CreatedAt,
            DateTime.UtcNow);

        var saved = await teamRequestRepository.UpdateAsync(updatedRequest, ct);
        var positionMap = new Dictionary<Guid, TeamPosition> { [teamPosition.Id] = teamPosition };
        var teamMap = new Dictionary<Guid, Team> { [team.Id] = team };
        return await BuildDetailsAsync(saved, positionMap, teamMap, ct);
    }

    private async Task<TeamRequestFullModel> BuildDetailsAsync(TeamRequest request,
        IReadOnlyDictionary<Guid, TeamPosition> positionMap,
        IReadOnlyDictionary<Guid, Team> teamMap,
        CancellationToken ct)
    {
        var position = positionMap.TryGetValue(request.TeamPositionId, out var p)
            ? p
            : await teamPositionRepository.GetByIdAsync(request.TeamPositionId, ct)
              ?? throw new KeyNotFoundException("Team position not found");

        var team = teamMap.TryGetValue(position.TeamId, out var t)
            ? t
            : await teamRepository.GetByIdAsync(position.TeamId, ct)
              ?? throw new KeyNotFoundException("Team not found");

        var user = await userRepository.GetUserByIdAsync(request.UserId, ct)
            ?? throw new KeyNotFoundException("User not found");

        Guid? specializationId = position.Type == TeamPositionType.Mandatory
            ? position.MandPositionData?.SpecializationId
            : position.AddPositionData?.SpecializationId;

        Specialization? specialization = null;
        if (specializationId.HasValue)
            specialization = await specializationRepository.GetByIdAsync(specializationId.Value, ct);

        return new TeamRequestFullModel
        {
            TeamRequest = request,
            User = user,
            Team = team,
            TeamPosition = position,
            PositionSpecialization = specialization,
        };
    }
}