using ClerkBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClerkBackend.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;

    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }

    // POST /api/users/login
    //
    // Called right after the user signs in on the frontend.
    // The JWT is validated by the [Authorize] middleware before this method
    // runs — so by the time we reach this code, the token is guaranteed valid.
    //
    // Use this endpoint to:
    //   • Upsert the user into your own database on first login
    //   • Sync Clerk profile fields (name, email, avatar) to local DB
    //   • Return any app-specific data (e.g. subscription tier, preferences)
    //
    [HttpPost("login")]
    [Authorize]
    public IActionResult Login([FromBody] UserLoginRequest request)
    {
        // The JWT "sub" claim is the authoritative Clerk user ID.
        // We cross-check it against the body payload to prevent spoofing.
        var tokenUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? User.FindFirstValue("sub");

        if (tokenUserId != request.UserId)
        {
            _logger.LogWarning(
                "UserId mismatch: token={TokenId}, body={BodyId}",
                tokenUserId, request.UserId);
            return Unauthorized(new { error = "UserId in body does not match JWT sub claim." });
        }

        _logger.LogInformation(
            "User logged in → id={UserId} email={Email} role={Role}",
            request.UserId, request.Email, request.Role ?? "none");

        // ── TODO: replace with real DB upsert ─────────────────────────────
        // Example (EF Core):
        //   var user = await _db.Users.FirstOrDefaultAsync(u => u.ClerkId == request.UserId);
        //   if (user is null) { user = new User { ClerkId = request.UserId }; _db.Users.Add(user); }
        //   user.Email     = request.Email;
        //   user.FirstName = request.FirstName;
        //   user.Role      = request.Role;
        //   await _db.SaveChangesAsync();
        // ─────────────────────────────────────────────────────────────────

        return Ok(new
        {
            success   = true,
            userId    = request.UserId,
            email     = request.Email,
            firstName = request.FirstName,
            role      = request.Role ?? "none",
            message   = "Login recorded. User synced to backend."
        });
    }

    // GET /api/users/profile
    //
    // Returns the authenticated user's profile (from token claims here;
    // swap for a real DB lookup once you have persistence).
    //
    [HttpGet("profile")]
    [Authorize]
    public IActionResult Profile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? User.FindFirstValue("sub")
                  ?? "unknown";

        return Ok(new
        {
            userId,
            message = $"Profile for {userId} — replace with DB lookup."
        });
    }
}
