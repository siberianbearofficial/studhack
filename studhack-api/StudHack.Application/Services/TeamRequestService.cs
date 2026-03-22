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

        EnsurePositionIsOpen(teamPosition);

        var isCaptain = team.CaptainId == currentUser.Id;
        var targetUserId = request.Type switch
        {
            TeamRequestType.Application => currentUser.Id,
            TeamRequestType.Invitation => ResolveInvitationTargetUserId(request, isCaptain),
            _ => throw new InvalidOperationException("Unsupported request type")
        };

        if (
            request.Type == TeamRequestType.Invitation
            && await userRepository.GetUserByIdAsync(targetUserId, ct) == null
        )
            throw new KeyNotFoundException("Invited user not found");

        if (team.TeamPositions.Any(position => position.UserId == targetUserId))
            throw new InvalidOperationException("User is already a member of this team");

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

        if (teamRequest.Status != TeamRequestStatus.Pending)
            throw new InvalidOperationException("Team request is already resolved");

        if (!CanResolveRequest(teamRequest, team, currentUser.Id, status))
            throw new UnauthorizedAccessException("You cannot resolve this request");

        var resolvedAt = DateTime.UtcNow;
        var positionForResponse = teamPosition;
        if (status == TeamRequestStatus.Approved)
        {
            EnsurePositionIsOpen(teamPosition);

            var updatedPosition = new TeamPosition(
                teamPosition.Id,
                teamPosition.TeamId,
                teamPosition.FilledByExternal,
                teamPosition.Type,
                teamRequest.UserId,
                teamPosition.AddPositionData,
                teamPosition.MandPositionData);

            await teamPositionRepository.UpdateAsync(updatedPosition, ct);
            positionForResponse = updatedPosition;
        }

        var updatedRequest = new TeamRequest(
            teamRequest.Id,
            teamRequest.TeamPositionId,
            teamRequest.UserId,
            teamRequest.Type,
            status,
            teamRequest.Message,
            teamRequest.CreatedAt,
            resolvedAt);

        var saved = await teamRequestRepository.UpdateAsync(updatedRequest, ct);

        if (status == TeamRequestStatus.Approved)
            await RejectSiblingRequestsAsync(teamRequest, resolvedAt, ct);

        var positionMap = new Dictionary<Guid, TeamPosition> { [teamPosition.Id] = positionForResponse };
        var teamMap = new Dictionary<Guid, Team> { [team.Id] = team };
        return await BuildDetailsAsync(saved, positionMap, teamMap, ct);
    }

    private async Task RejectSiblingRequestsAsync(TeamRequest approvedRequest, DateTime resolvedAt, CancellationToken ct)
    {
        var siblingRequests = (await teamRequestRepository.GetAllAsync(ct))
            .Where(request => request.Id != approvedRequest.Id &&
                              request.TeamPositionId == approvedRequest.TeamPositionId &&
                              request.Status == TeamRequestStatus.Pending)
            .ToList();

        foreach (var siblingRequest in siblingRequests)
        {
            await teamRequestRepository.UpdateAsync(new TeamRequest(
                siblingRequest.Id,
                siblingRequest.TeamPositionId,
                siblingRequest.UserId,
                siblingRequest.Type,
                TeamRequestStatus.Rejected,
                siblingRequest.Message,
                siblingRequest.CreatedAt,
                resolvedAt), ct);
        }
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

    private static Guid ResolveInvitationTargetUserId(CreateTeamRequestModel request, bool isCaptain)
    {
        if (!isCaptain)
            throw new UnauthorizedAccessException("Only captain can invite users to this team");

        return request.InvitedUserId
            ?? throw new InvalidOperationException("InvitedUserId is required for invitation");
    }

    private static bool CanResolveRequest(TeamRequest request, Team team, Guid currentUserId, TeamRequestStatus status)
    {
        return request.Type switch
        {
            TeamRequestType.Application => (status == TeamRequestStatus.Cancelled ? request.UserId : team.CaptainId) == currentUserId,
            TeamRequestType.Invitation => (status == TeamRequestStatus.Cancelled ? team.CaptainId : request.UserId) == currentUserId,
            _ => throw new InvalidOperationException("Resolve denied. Unknown team request type")
        };
    }

    private static void EnsurePositionIsOpen(TeamPosition teamPosition)
    {
        if (teamPosition.UserId.HasValue || teamPosition.FilledByExternal)
            throw new InvalidOperationException("Position is already filled");
    }
}
