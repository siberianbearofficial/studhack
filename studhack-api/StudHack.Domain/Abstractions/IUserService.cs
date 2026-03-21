using Eventity.Domain.Models;

namespace StudHack.Domain.Abstractions;

public interface IUserService
{
    public Task<User?> GetUserByIdAsync(Guid userId, CancellationToken ct = default);
    public Task<User?> GetUserByAuthAsync(Guid authId, CancellationToken ct = default);
    public Task<UserAuthInfo?> LoadUserInfoAsync(Guid authId, CancellationToken ct = default);
    public Task<ICollection<User>> GetUsersAsync(CancellationToken ct = default);
    public Task<Guid> SaveUserInfoAsync(Guid authId, User user, CancellationToken ct = default);
}