using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions;

public interface ITeamRequestService
{
    Task<TeamRequestFeedModel> GetFeedAsync(Guid authId, CancellationToken ct = default);
    Task<TeamRequestFullModel> CreateAsync(Guid authId, CreateTeamRequestModel request, CancellationToken ct = default);
    Task<TeamRequestFullModel> ResolveAsync(Guid requestId, Guid authId, TeamRequestStatus status,
        CancellationToken ct = default);
}