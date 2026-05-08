using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
        policy.SetIsOriginAllowed(origin =>
                  new Uri(origin).Host == "localhost")   // allow any localhost port
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── Clerk JWT Authentication ──────────────────────────────────────────────────
//
// How it works:
//  1. React calls Clerk's getToken() → Clerk issues a signed RS256 JWT
//  2. React sends the JWT in Authorization: Bearer <token>
//  3. This middleware fetches Clerk's public JWKS once (cached), verifies the
//     signature, issuer, and expiry — no secret key needed on the backend.
//  4. On success, HttpContext.User is populated with the token's claims.
//
var clerkAuthority = builder.Configuration["Clerk:Authority"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Clerk's OIDC discovery endpoint serves the JWKS automatically.
        options.Authority = clerkAuthority;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = clerkAuthority,

            // Clerk does not set a specific audience by default.
            // Set to false unless you configure Audiences in the Clerk dashboard.
            ValidateAudience = false,

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
        };

        // Optional: log token validation errors during development
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                var logger = ctx.HttpContext.RequestServices
                    .GetRequiredService<ILogger<Program>>();
                logger.LogWarning("Clerk JWT validation failed: {Error}", ctx.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
