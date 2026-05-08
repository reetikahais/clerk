namespace ClerkBackend.Models;

// Represents the claims Clerk puts inside the JWT payload.
//
// Standard Clerk JWT claims:
//   sub  → Clerk user ID  (e.g. "user_2abc...")
//   iss  → Issuer         (your Clerk Frontend API URL)
//   iat  → Issued-at      (Unix timestamp)
//   exp  → Expiration     (Unix timestamp, default 60 s)
//   sid  → Session ID
//   azp  → Authorized party (your frontend origin)
//
// Custom claims you add in the Clerk dashboard (JWT Templates) also appear here.

public record ClerkTokenClaims(
    string Sub,       // userId
    string Iss,       // issuer
    string Sid,       // sessionId
    string? Azp,      // authorized party / frontend origin
    long Iat,
    long Exp
);
