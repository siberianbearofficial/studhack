using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface ITeamPositionRepository
{
    Task<TeamPosition?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<TeamPosition>> GetAllAsync(CancellationToken ct = default);
    Task<TeamPosition> AddAsync(TeamPosition teamPosition, CancellationToken ct = default);
    Task<TeamPosition> UpdateAsync(TeamPosition teamPosition, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
