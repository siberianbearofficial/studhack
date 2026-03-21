using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface ITeamRepository
{
    Task<Team?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Team>> GetAllAsync(CancellationToken ct = default);
    Task<Team> AddAsync(Team team, CancellationToken ct = default);
    Task<Team> UpdateAsync(Team team, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
