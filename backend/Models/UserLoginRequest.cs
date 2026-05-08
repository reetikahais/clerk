namespace ClerkBackend.Models;

public record UserLoginRequest(
    string UserId,
    string Email,
    string? FirstName,
    string? LastName,
    string? ImageUrl,
    string? Role
);
