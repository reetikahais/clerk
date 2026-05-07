# 🔐 JWT Token - Quick Summary

## 🎯 Quick Answer to Your Questions

### Q: Where is the JWT token?
**A:** Stored securely in your browser after you sign in. It's created and managed by Clerk.

### Q: How do I get it?
**A:** Use the `useAuth()` hook in React:
```javascript
const { getToken } = useAuth()
const token = await getToken()
```

### Q: When is it available?
**A:** Only after user signs in. Check with:
```javascript
const { isSignedIn } = useAuth()
if (isSignedIn) {
  // Now you can get token
  const token = await getToken()
}
```

---

## 📍 Where to Find JWT Token in Your App

### 1️⃣ In Browser Storage
- **Not directly visible** - Clerk stores it securely
- Browser DevTools won't show it in localStorage/sessionStorage
- Clerk manages it automatically

### 2️⃣ Get It in Your Code
```javascript
import { useAuth } from '@clerk/clerk-react'

function MyComponent() {
  const { getToken } = useAuth()
  
  const handleClick = async () => {
    const token = await getToken()
    console.log(token) // Full JWT token will appear here
  }
}
```

### 3️⃣ Test It in Your App
- **Sign in to**: http://localhost:5176
- **Click**: "🔑 JWT Token" button (in navigation for admin users)
- **Click**: "Get JWT Token"
- See the token in browser console (F12 → Console tab)

---

## 🔄 JWT Token Flow

```
┌─────────────┐
│ User signs  │
│ in with     │
│ Clerk       │
└──────┬──────┘
       │
       ↓
┌─────────────────┐
│ Clerk creates   │
│ JWT token       │
│ (electronically │
│  signed proof)  │
└──────┬──────────┘
       │
       ↓
┌──────────────────────┐
│ Token stored in      │
│ browser securely     │
│ (you can't see it)   │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────────┐
│ In your code:            │
│ const token =            │
│   await getToken()       │
└──────┬───────────────────┘
       │
       ↓
┌───────────────────────────┐
│ Send to backend:          │
│ Authorization: Bearer ... │
└──────┬────────────────────┘
       │
       ↓
┌───────────────────────────┐
│ Backend verifies with     │
│ Clerk's public key        │
└───────────────────────────┘
```

---

## 📤 How to Send JWT Token to .NET Backend

### Step 1: Get Token in Frontend
```javascript
const { getToken } = useAuth()
const token = await getToken()
```

### Step 2: Send in API Request
```javascript
fetch('https://your-api.com/api/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,  ← Token goes here
    'Content-Type': 'application/json',
  }
})
```

### Step 3: Backend Receives It
```csharp
// In .NET controller
var authHeader = Request.Headers["Authorization"];
// Value: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

var token = authHeader.ToString().Replace("Bearer ", "");
```

### Step 4: Backend Verifies It
```csharp
var verification = await _clerkClient.Tokens.VerifyTokenAsync(token);

if (verification != null) {
  // ✅ Valid token - grant access
  var userId = verification.Claims["sub"].ToString();
} else {
  // ❌ Invalid token - deny access
  return Unauthorized();
}
```

---

## 🕐 Token Timeline

| Time | What Happens |
|------|--------------|
| **User signs in** | Clerk authenticates password |
| **Immediately after** | JWT token created & stored |
| **You call getToken()** | Returns the current token |
| **After 1 hour** | Token expires |
| **Next getToken() call** | Clerk auto-refreshes & returns new token |

---

## 📋 What's In a JWT Token?

Example token contents (decoded):
```json
{
  "iss": "https://clerk.your-domain.com",
  "sub": "user_abc123...",           // User ID
  "aud": ["your-app-id"],
  "iat": 1609459200,                 // Issued at (timestamp)
  "exp": 1609462800,                 // Expires at (timestamp)
  "email": "user@example.com",
  "name": "John Doe",
  "email_verified": true
}
```

---

## 🧪 Test It Now

### Option 1: Manual Testing
1. Open your app: http://localhost:5176
2. Sign in (if not already)
3. Open DevTools: **F12**
4. Go to **Console** tab
5. Run:
   ```javascript
   const { getToken } = useAuth()
   // ERROR - won't work in console directly
   ```

### Option 2: Use TokenExample Component (Recommended)
1. Click **"🔑 JWT Token"** button in navigation (for admin users)
2. Click **"Get JWT Token"** button
3. See the token displayed
4. Copy it
5. Check "Backend Response" section

### Option 3: Add to Console Logs
In your component:
```javascript
useEffect(() => {
  const getAndLogToken = async () => {
    if (isSignedIn) {
      const token = await getToken()
      console.log('JWT Token:', token)
    }
  }
  getAndLogToken()
}, [isSignedIn, getToken])
```

---

## 🚀 Complete Example

### Frontend (Get Token)
```javascript
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'

export default function MyComponent() {
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isSignedIn) return

    const sendTokenToBackend = async () => {
      // 🔑 Get token
      const token = await getToken()
      console.log('Token:', token)
      
      // 📤 Send to backend
      const response = await fetch('/api/data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      console.log('Response:', data)
    }

    sendTokenToBackend()
  }, [isSignedIn, getToken])

  return <div>Check console for token</div>
}
```

### Backend (.NET - Verify Token)
```csharp
[HttpGet("api/data")]
public async Task<IActionResult> GetData()
{
  // Extract token from header
  var token = Request.Headers["Authorization"]
    .ToString()
    .Replace("Bearer ", "");
  
  // Verify token
  try {
    var verification = await _clerkClient.Tokens
      .VerifyTokenAsync(token);
    
    if (verification == null)
      return Unauthorized();
    
    // Token valid - return data
    return Ok(new { message = "Success", data = "..." });
  }
  catch {
    return BadRequest("Invalid token");
  }
}
```

---

## ✅ Checklist

- [ ] Sign in to your app
- [ ] Open DevTools (F12)
- [ ] Find "🔑 JWT Token" button in navigation
- [ ] Click it to see token example
- [ ] Understand how to get token: `await getToken()`
- [ ] Understand how to send: `Authorization: Bearer <token>`
- [ ] Plan backend endpoint to receive token
- [ ] Setup token verification on backend

---

## 📚 Reference Files

| File | Contains |
|------|----------|
| `JWT_TOKEN_GUIDE.md` | Complete JWT guide |
| `BACKEND_INTEGRATION.md` | Backend setup |
| `src/components/TokenExample.jsx` | Working example component |
| `src/App.jsx` | Token view integration |

---

## 💡 Key Points

✅ **JWT tokens are:**
- Automatically created by Clerk
- Digitally signed (tamper-proof)
- Stored securely by Clerk
- Available via `useAuth()` hook
- Safe to send to backend

❌ **JWT tokens are NOT:**
- Stored in localStorage
- Visible in browser DevTools
- Passwords
- Need to be manually refreshed
- Generated by your app

---

## 🎉 You Have Everything!

**Frontend:**
- ✅`useAuth()` hook to get tokens
- ✅ TokenExample component to test
- ✅ Console logging for debugging

**Backend:**
- ✅ Token verification with Clerk
- ✅ User authentication
- ✅ Access control

**Next:** Use the token in your .NET API calls!

