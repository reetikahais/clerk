using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClerkBackend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    // POST /api/auth/verify
    //
    // Called by the frontend after login to confirm the JWT is valid on the
    // backend side and to get back the decoded claims.
    //
    // Flow:
    //   1. React calls getToken() → receives JWT from Clerk
    //   2. React sends:  Authorization: Bearer <jwt>
    //   3. ASP.NET JwtBearer middleware validates signature via Clerk JWKS
    //   4. If valid → [Authorize] passes → we return claims to the client
    //
    [HttpPost("verify")]
    [Authorize]
    public IActionResult Verify()
    {
        var claims = ExtractClaims(User);
        return Ok(new
        {
            valid      = true,
            userId     = claims.UserId,
            sessionId  = claims.SessionId,
            issuer     = claims.Issuer,
            authorizedParty = claims.AuthorizedParty,
            issuedAt   = claims.IssuedAt,
            expiresAt  = claims.ExpiresAt,
            message    = "Clerk JWT is valid. Backend authentication successful."
        });
    }

    // GET /api/auth/me
    //
    // Returns the authenticated user's identity extracted from the JWT.
    // No database lookup — everything comes straight from the token claims.
    //
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var claims = ExtractClaims(User);
        return Ok(new
        {
            userId    = claims.UserId,
            sessionId = claims.SessionId,
            issuer    = claims.Issuer,
        });
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private static (string UserId, string SessionId, string Issuer,
                    string? AuthorizedParty, string IssuedAt, string ExpiresAt)
        ExtractClaims(ClaimsPrincipal user)
    {
        // Clerk maps the JWT "sub" claim to ClaimTypes.NameIdentifier
        var userId     = user.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? user.FindFirstValue("sub")
                      ?? "unknown";

        var sessionId  = user.FindFirstValue("sid") ?? "unknown";
        var issuer     = user.FindFirstValue("iss") ?? "unknown";
        var azp        = user.FindFirstValue("azp");

        // Convert Unix timestamps → readable strings
        var iat = user.FindFirstValue("iat");
        var exp = user.FindFirstValue("exp");

        string ToUtc(string? unix) => long.TryParse(unix, out var ts)
            ? DateTimeOffset.FromUnixTimeSeconds(ts).UtcDateTime.ToString("o")
            : "unknown";

        return (userId, sessionId, issuer, azp, ToUtc(iat), ToUtc(exp));
    }
}
