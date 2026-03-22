using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions;

public interface ITeamService
{
    Task<IReadOnlyCollection<TeamFullModel>> GetTeamsFullAsync(Guid authId, CancellationToken ct = default);
    Task<TeamFullModel?> GetTeamFullByIdAsync(Guid teamId, Guid authId, CancellationToken ct = default);
    Task<TeamFullModel> UpsertTeamAsync(Guid authId, UpsertTeamModel request, CancellationToken ct = default);
    Task<bool> DeleteTeamAsync(Guid teamId, Guid authId, CancellationToken ct = default);
}