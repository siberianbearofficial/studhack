using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Converters;
using StudHack.Domain.Exceptions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace StudHack.DataAccess.Repositories;

public class PortfolioLinkRepository : IPortfolioLinkRepository
{
    private readonly StudHackDbContext _context;
    private readonly ILogger<PortfolioLinkRepository> _logger;

    public PortfolioLinkRepository(StudHackDbContext context, ILogger<PortfolioLinkRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PortfolioLink?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var portfolioLinkDb = await _context.PortfolioLinks
                .AsNoTracking()
                .FirstOrDefaultAsync(pl => pl.Id == id, ct);

            return portfolioLinkDb?.ToDomain();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve portfolio link with id: {PortfolioLinkId}", id);
            throw new PortfolioLinkRepositoryException("Failed to retrieve portfolio link", ex);
        }
    }

    public async Task<IEnumerable<PortfolioLink>> GetAllAsync(CancellationToken ct = default)
    {
        try
        {
            var portfolioLinksDb = await _context.PortfolioLinks.AsNoTracking().ToListAsync(ct);
            return portfolioLinksDb.Select(pl => pl.ToDomain());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve portfolio links");
            throw new PortfolioLinkRepositoryException("Failed to retrieve portfolio links", ex);
        }
    }

    public async Task<PortfolioLink> AddAsync(PortfolioLink portfolioLink, CancellationToken ct = default)
    {
        try
        {
            await _context.PortfolioLinks.AddAsync(portfolioLink.ToDb(), ct);
            await _context.SaveChangesAsync(ct);
            return portfolioLink;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to add portfolio link: {@PortfolioLink}", portfolioLink);
            throw new PortfolioLinkRepositoryException("Failed to add portfolio link", ex);
        }
    }

    public async Task<PortfolioLink> UpdateAsync(PortfolioLink portfolioLink, CancellationToken ct = default)
    {
        try
        {
            var portfolioLinkDb = await _context.PortfolioLinks.FirstOrDefaultAsync(pl => pl.Id == portfolioLink.Id, ct);

            if (portfolioLinkDb is null)
            {
                throw new PortfolioLinkRepositoryException($"PortfolioLink with id {portfolioLink.Id} not found");
            }

            _context.Entry(portfolioLinkDb).CurrentValues.SetValues(portfolioLink.ToDb());
            await _context.SaveChangesAsync(ct);
            return portfolioLink;
        }
        catch (PortfolioLinkRepositoryException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update portfolio link: {@PortfolioLink}", portfolioLink);
            throw new PortfolioLinkRepositoryException("Failed to update portfolio link", ex);
        }
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        try
        {
            var portfolioLinkDb = await _context.PortfolioLinks.FirstOrDefaultAsync(pl => pl.Id == id, ct);

            if (portfolioLinkDb is null)
            {
                return false;
            }

            _context.PortfolioLinks.Remove(portfolioLinkDb);
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete portfolio link with id: {PortfolioLinkId}", id);
            throw new PortfolioLinkRepositoryException("Failed to delete portfolio link", ex);
        }
    }
}