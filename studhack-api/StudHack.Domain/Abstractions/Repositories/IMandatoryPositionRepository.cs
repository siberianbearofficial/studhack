using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions.Repositories;

public interface IMandatoryPositionRepository
{
    Task<MandatoryPositionData?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<MandatoryPositionData>> GetAllAsync(CancellationToken ct = default);
    Task<MandatoryPositionData> AddAsync(MandatoryPositionData mandatoryPositionData, CancellationToken ct = default);
    Task<MandatoryPositionData> UpdateAsync(MandatoryPositionData mandatoryPositionData, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
