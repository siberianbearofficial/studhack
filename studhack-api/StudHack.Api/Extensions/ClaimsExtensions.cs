using System.Security.Claims;

namespace StudHack.Api.Extensions;

public static class ClaimsExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        return Guid.Parse(principal.FindFirst("UserId")?.Value ??
                          throw new Exception("'UserId' claim was not found"));
    }
}