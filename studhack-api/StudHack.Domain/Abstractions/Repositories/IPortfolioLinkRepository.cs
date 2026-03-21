using StudHack.Domain.Models;

namespace StudHack.Domain.Interfaces.Repositories;

public interface IPortfolioLinkRepository
{
    Task<PortfolioLink?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<PortfolioLink>> GetAllAsync(CancellationToken ct = default);
    Task<PortfolioLink> AddAsync(PortfolioLink portfolioLink, CancellationToken ct = default);
    Task<PortfolioLink> UpdateAsync(PortfolioLink portfolioLink, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
