using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface ISpecializationRepository
{
    Task<Specialization?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Specialization>> GetAllAsync(CancellationToken ct = default);
    Task<Specialization> AddAsync(Specialization specialization, CancellationToken ct = default);
    Task<Specialization> UpdateAsync(Specialization specialization, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
