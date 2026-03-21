using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions.Repositories;

public interface IEducationRepository
{
    Task<Education?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Education>> GetAllAsync(CancellationToken ct = default); 
    Task<Education> AddAsync(Education education, CancellationToken ct = default);
    Task<Education> UpdateAsync(Education education, CancellationToken ct = default); 
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}

