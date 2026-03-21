using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface ITeamRequestRepository
{
    Task<TeamRequest?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<TeamRequest>> GetAllAsync(CancellationToken ct = default);
    Task<TeamRequest> AddAsync(TeamRequest teamRequest, CancellationToken ct = default);
    Task<TeamRequest> UpdateAsync(TeamRequest teamRequest, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
