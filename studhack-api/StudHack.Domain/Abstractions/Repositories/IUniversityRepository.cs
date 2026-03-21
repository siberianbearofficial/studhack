using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface IUniversityRepository
{
    Task<University?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<University>> GetAllAsync(CancellationToken ct = default);
    Task<University> AddAsync(University university, CancellationToken ct = default);
    Task<University> UpdateAsync(University university, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
