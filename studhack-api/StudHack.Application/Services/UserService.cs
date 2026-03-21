using Avalux.Auth.ApiClient;
using Eventity.Domain.Models;
using StudHack.Domain.Abstractions;

namespace StudHack.Application.Services;

public class UserService(IUserRepository userRepository, IAuthClient authClient) : IUserService
{
    public async Task<User?> GetUserByIdAsync(Guid userId, CancellationToken ct = default)
    {
        return await userRepository.GetUserByIdAsync(userId, ct);
    }

    public async Task<User?> GetUserByAuthAsync(Guid authId, CancellationToken ct = default)
    {
        return await userRepository.GetUserByAuthAsync(authId, ct);
    }

    public async Task<UserAuthInfo> LoadUserInfoAsync(Guid authId, CancellationToken ct = default)
    {
        var user = await authClient.GetUserAsync(authId, ct);
        return FromAuthApi(user);
    }

    public async Task<ICollection<User>> GetUsersAsync(CancellationToken ct = default)
    {
        var users = await userRepository.GetUsersAsync(ct);
        return users;
    }

    public async Task<Guid> SaveUserInfoAsync(Guid authId, User userInfo, CancellationToken ct = default)
    {
        return await userRepository.SaveUserInfoAsync(authId, userInfo, ct);
    }

    private static UserAuthInfo FromAuthApi(Avalux.Auth.ApiClient.Models.UserInfo userInfo)
    {
        var account = userInfo.Accounts.First();
        return new UserAuthInfo
        {
            UniqueName = account.Login,
            Email = account.Email,
            DisplayName = account.Name,
            AvatarUrl = account.AvatarUrl,
        };
    }
}