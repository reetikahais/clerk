using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClerkBackend.Controllers;

[ApiController]
[Route("api/protected")]
[Authorize]                         // every endpoint here requires a valid Clerk JWT
public class ProtectedController : ControllerBase
{
    // GET /api/protected/dashboard
    //
    // Example of a protected resource. Any authenticated user can access this.
    //
    [HttpGet("dashboard")]
    public IActionResult Dashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? User.FindFirstValue("sub");

        return Ok(new
        {
            message   = "Welcome to the protected dashboard!",
            userId,
            timestamp = DateTime.UtcNow
        });
    }

    // GET /api/protected/admin
    //
    // Role-based example.
    // In production, check the role from your own DB or a Clerk JWT template
    // that embeds publicMetadata.role as a custom claim.
    //
    [HttpGet("admin")]
    public IActionResult AdminOnly([FromQuery] string? role)
    {
        // If you add "role" to your Clerk JWT Template, read it like:
        //   var role = User.FindFirstValue("role");
        // For now we accept it as a query param so you can test immediately.

        if (role != "admin")
            return Forbid();

        return Ok(new
        {
            message = "Admin area. You have elevated access.",
            userId  = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue("sub")
        });
    }
}
