using StudHack.Domain.Models;

namespace StudHack.Domain.Abstractions.Repositories;

public interface IAdditionalPositionDataRepository
{
    Task<AdditionalPositionData?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ICollection<AdditionalPositionData>> GetAllAsync(CancellationToken ct = default);
    Task<AdditionalPositionData> AddAsync(AdditionalPositionData additionalPositionData, CancellationToken ct = default);
    Task<AdditionalPositionData> UpdateAsync(AdditionalPositionData additionalPositionData, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}