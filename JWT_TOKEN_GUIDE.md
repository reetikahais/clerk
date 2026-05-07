# 🔐 JWT Token Guide - Clerk & Backend Integration

## 🤔 What is a JWT Token?

A **JWT (JSON Web Token)** is like a signed passport/credential that proves:
- ✅ User is authenticated (Clerk verified them)
- ✅ User's identity (who they are)
- ✅ User's permissions (their role)
- ✅ Expiration time (when it expires)

It's safe to send to backend because it's **digitally signed by Clerk**.

---

## 📍 Where JWT Token Comes From

```
1. User signs in on frontend
   ↓
2. Clerk verifies password
   ↓
3. Clerk creates JWT token
   ↓
4. Token stored in browser (secure)
   ↓
5. Frontend can send to backend
   ↓
6. Backend verifies with Clerk
   ↓
7. Backend grants access
```

---

## 🎯 How to Get JWT Token in React

### Method 1: Using `useAuth()` Hook (Recommended)

```javascript
import { useAuth } from '@clerk/clerk-react'

export default function MyComponent() {
  const { getToken } = useAuth()
  
  // Get token when needed
  const handleGetToken = async () => {
    const token = await getToken()
    console.log('🔑 JWT Token:', token)
    console.log('📤 Send this to backend:', token)
  }
  
  return (
    <button onClick={handleGetToken}>
      Get JWT Token
    </button>
  )
}
```

### Method 2: Inside API Call

```javascript
const { getToken } = useAuth()
const token = await getToken()

fetch('https://your-api.com/api/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
.then(res => res.json())
.then(data => console.log('Response:', data))
```

### Method 3: Inside useEffect

```javascript
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'

export default function UserData() {
  const { getToken } = useAuth()
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getToken()
      
      console.log('🔑 JWT Token obtained:', token)
      console.log('⏰ Token will expire at:', token.split('.')[1]) // Payload
      
      // Send to backend
      await fetch('https://your-api.com/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
    }
    
    fetchUserData()
  }, [getToken])
  
  return <div>User data loaded</div>
}
```

---

## ⏰ When is JWT Token Available?

| Time | Token Available? | Details |
|------|-----------------|---------|
| **Before sign-in** | ❌ No | User not authenticated yet |
| **During sign-in** | ⏳ Loading | Clerk processing credentials |
| **After sign-in** | ✅ YES | User authenticated, token ready |
| **Token expires** | ❌ No | Need to get new token (auto-refreshed) |

### Check If User is Authenticated First

```javascript
import { useAuth, useUser } from '@clerk/clerk-react'

export default function MyComponent() {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const { getToken } = useAuth()
  
  if (!isLoaded) {
    return <div>Loading authentication...</div>
  }
  
  if (!userId) {
    return <div>Please sign in first</div>
  }
  
  // Now safe to get token
  const token = await getToken()
  return <div>User authenticated: {user.email}</div>
}
```

---

## 📤 Send JWT Token to .NET Backend

### Frontend: Get and Send Token

```javascript
import { useAuth } from '@clerk/clerk-react'

async function sendToBackend() {
  const { getToken } = useAuth()
  
  try {
    const token = await getToken()
    
    const response = await fetch('https://your-api.com/api/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  ← Token goes here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      })
    })
    
    const data = await response.json()
    console.log('✅ Backend verified:', data)
    return data
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

### Backend (.NET): Verify Token

```csharp
using ClerkDotNet;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IClerkClient _clerkClient;
    
    public AuthController(IClerkClient clerkClient)
    {
        _clerkClient = clerkClient;
    }
    
    [HttpPost("verify")]
    public async Task<IActionResult> VerifyToken()
    {
        try
        {
            // Get token from header
            var authHeader = Request.Headers["Authorization"].ToString();
            var token = authHeader.Replace("Bearer ", "");
            
            // 🔐 Verify with Clerk
            var claimsValidation = await _clerkClient.Tokens.VerifyTokenAsync(token);
            
            if (claimsValidation == null)
            {
                return Unauthorized(new { error = "Invalid token" });
            }
            
            // ✅ Token is valid
            var userId = claimsValidation.Claims["sub"]?.ToString();
            
            return Ok(new 
            { 
                message = "Token verified",
                userId = userId,
                tokenExpiry = claimsValidation.Claims["exp"]
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
```

---

## 🔍 What's Inside a JWT Token?

A JWT token has 3 parts (separated by dots):

```
eyJhbGciOiJSUzI1NiIsImFsZ...
.
eyJpc3MiOiJodHRwczovL2Nlc2h...
.
SflKxwRJSMeKKF2QT4fwpMeJf36Po...

Part 1: Header (Algorithm used)
Part 2: Payload (Claims/Data)
Part 3: Signature (Proof it's real)
```

### Decode to See Contents

```javascript
function decodeJWT(token) {
  const parts = token.split('.')
  const payload = JSON.parse(atob(parts[1]))
  return payload
}

// Result will show:
{
  iss: "https://clerk.domain.com",
  sub: "user_abc123...",                    // User ID
  aud: ["your-app"],
  iat: 1609459200,                          // Issued at
  exp: 1609462800,                          // Expires at
  auth_time: 1609459200,
  email: "user@example.com",
  email_verified: true,
  name: "John Doe"
}
```

---

## 📝 Add JWT Token to App.jsx

I'll create a complete example for you:

```javascript
import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'

function AppContent() {
  const { isLoaded, userId, getToken } = useAuth()
  const { user } = useUser()

  // Get token and send to backend when user signs in
  useEffect(() => {
    const handleUserAuthenticated = async () => {
      if (!user) return
      
      try {
        // 🔑 Get JWT token from Clerk
        const token = await getToken()
        
        console.log('🔐 JWT TOKEN OBTAINED:', token)
        console.log('👤 User ID:', user.id)
        console.log('📧 Email:', user.primaryEmailAddress?.emailAddress)
        
        // 📤 Send to backend
        const response = await fetch(
          'https://your-api.com/api/auth/verify-token',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
            })
          }
        )
        
        const backendResponse = await response.json()
        console.log('✅ Backend Response:', backendResponse)
        
      } catch (error) {
        console.error('❌ Error getting/sending token:', error)
      }
    }
    
    handleUserAuthenticated()
  }, [user, getToken])

  // ... rest of component
}
```

---

## 🎯 Step-by-Step: Get & Verify Token

### Step 1: Frontend Gets Token

```javascript
// In your React component
const { getToken } = useAuth()
const token = await getToken()
// Result: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI...
```

### Step 2: Frontend Sends to Backend

```javascript
fetch('https://your-api.com/api/auth/verify', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Step 3: Backend Receives Header

```csharp
var authHeader = Request.Headers["Authorization"];
// Value: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 4: Backend Extracts Token

```csharp
var token = authHeader.ToString().Replace("Bearer ", "");
// Now token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 5: Backend Verifies with Clerk

```csharp
var verification = await _clerkClient.Tokens.VerifyTokenAsync(token);
// ✅ If valid, verification contains user info
// ❌ If invalid, throws exception
```

### Step 6: Backend Grants Access

```csharp
if (verification != null)
{
  // Token is valid - user is authenticated
  var userId = verification.Claims["sub"].ToString()
  // Create session, return auth cookie, etc.
}
```

---

## 💡 Token Expiration & Refresh

### Tokens Expire

Clerk tokens expire after **1 hour** by default.

### Auto-Refresh

Clerk automatically refreshes tokens:

```javascript
const { getToken } = useAuth()

// Clerk handles refresh automatically
const token = await getToken() // Fresh token always
```

### Check Expiration Time

```javascript
import { useAuth } from '@clerk/clerk-react'

function CheckTokenExpiry() {
  const { getToken } = useAuth()
  
  const handleCheckExpiry = async () => {
    const token = await getToken()
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    const expiryTime = new Date(payload.exp * 1000)
    const now = new Date()
    const timeLeft = Math.round((expiryTime - now) / 1000 / 60) // minutes
    
    console.log(`⏰ Token expires in ${timeLeft} minutes`)
  }
  
  return <button onClick={handleCheckExpiry}>Check Token</button>
}
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Send token in `Authorization: Bearer <token>` header
- Verify token on backend with Clerk
- Use HTTPS/TLS for all API calls
- Store token in secure browser storage (Clerk does this)
- Check token validity before using

### ❌ DON'T:
- Don't hardcode tokens
- Don't log tokens to public logs
- Don't send token in URL query params
- Don't store in localStorage unencrypted
- Don't trust frontend validation only

---

## 📋 Complete Example: Frontend to Backend

### Frontend (React)

```javascript
import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export default function UserProfile() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isSignedIn) return
      
      setLoading(true)
      
      try {
        // 🔑 Step 1: Get JWT token
        const token = await getToken()
        console.log('Got JWT token:', token.substring(0, 20) + '...')
        
        // 📤 Step 2: Send to backend with token
        const response = await fetch(
          'https://your-dotnet-api.com/api/profile',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        )
        
        // 📩 Step 3: Handle response
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          console.log('✅ User data from backend:', data)
        } else {
          console.error('❌ Backend error:', response.status)
        }
      } catch (error) {
        console.error('❌ Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [isSignedIn, getToken])

  return (
    <div>
      {loading && <p>Loading...</p>}
      {userData && <p>Welcome, {userData.name}!</p>}
    </div>
  )
}
```

### Backend (.NET)

```csharp
[ApiController]
[Route("api")]
public class ProfileController : ControllerBase
{
    private readonly IClerkClient _clerk;
    private readonly UserService _userService;
    
    public ProfileController(IClerkClient clerk, UserService userService)
    {
        _clerk = clerk;
        _userService = userService;
    }
    
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            // 🔑 Step 1: Extract token from header
            var token = Request.Headers["Authorization"]
                .ToString()
                .Replace("Bearer ", "");
            
            // 🔐 Step 2: Verify token with Clerk
            var verification = await _clerk.Tokens.VerifyTokenAsync(token);
            
            if (verification == null)
                return Unauthorized();
            
            // 📍 Step 3: Get user ID from token
            var userId = verification.Claims["sub"].ToString();
            
            // 📊 Step 4: Get user from database
            var user = await _userService.GetUserByClerkIdAsync(userId);
            
            // 📤 Step 5: Return user data
            return Ok(new
            {
                name = user.FirstName + " " + user.LastName,
                email = user.Email,
                role = user.Role,
                profileUrl = user.ImageUrl
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
```

---

## 🧪 Testing JWT Token Flow

1. **Open Browser DevTools (F12)**
2. **Go to Console tab**
3. **Sign in to your app**
4. **Run this in console:**
   ```javascript
   const { getToken } = useAuth()
   const token = await getToken()
   console.log(token)
   ```
5. **Copy the token**
6. **Test in Postman:**
   - Paste token in Authorization header
   - Send to your backend endpoint
   - Verify backend receives & verifies it

---

## 🎯 Checklist

- [ ] Import `useAuth` in your component
- [ ] Call `getToken()` when user is authenticated
- [ ] Send token in `Authorization: Bearer <token>` header
- [ ] Backend receives and verifies token
- [ ] Backend responds with user data
- [ ] Frontend handles response

---

## 📚 Key Files for Reference

- **Frontend JWT usage:** Use `useAuth()` from `@clerk/clerk-react`
- **Backend verification:** Use Clerk SDK for .NET
- **Token format:** JWT (3 parts separated by dots)
- **Default expiry:** 1 hour (auto-refreshed)

---

## 🚀 You're Ready!

**JWT tokens are:**
- ✅ Automatically created by Clerk
- ✅ Available via `getToken()` hook
- ✅ Safe to send to backend
- ✅ Can be verified by backend

**Next step:** Add the token to your backend API calls!

