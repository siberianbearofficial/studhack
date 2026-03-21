using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface ISkillRepository
{
    Task<Skill?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Skill>> GetAllAsync(CancellationToken ct = default);
    Task<Skill> AddAsync(Skill skill, CancellationToken ct = default);
    Task<Skill> UpdateAsync(Skill skill, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
