# 🔗 Frontend to .NET Backend Integration Guide

## 📍 Where User Data is Logged

Your frontend now logs user data in **three strategic places**:

### 1️⃣ **App.jsx** (Main login point)
```javascript
// File: src/App.jsx
// When user signs in, you'll see:
// 👤 USER SIGNED IN/UP: { userId, email, firstName, lastName, role, ... }
// 📤 SEND THIS TO .NET BACKEND: { JSON string }
```

**Check Console:**
- Open browser DevTools: **F12**
- Go to **Console** tab
- Sign in to your app
- Copy the JSON that appears

### 2️⃣ **RoleContext.jsx** (Role assignment)
```javascript
// File: src/contexts/RoleContext.jsx
// When role is detected:
// 🔐 USER ROLE ASSIGNED: admin
```

### 3️⃣ **backendIntegration.js** (Helper file)
```javascript
// File: src/utils/backendIntegration.js
// Schema and examples for backend integration
```

---

## 📤 User Data Available for Backend

When user signs in, this data is captured:

```json
{
  "userId": "user_abc123...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "imageUrl": "https://...",
  "role": "admin",
  "createdAt": "2024-05-07T12:00:00Z",
  "updatedAt": "2024-05-07T14:30:00Z"
}
```

---

## 🎯 Frontend → .NET Backend Integration Steps

### Step 1: Get User Data from Console
1. Sign in to your app (http://localhost:5175)
2. Open DevTools: **F12**
3. Go to **Console** tab
4. Look for log: `📤 SEND THIS TO .NET BACKEND: {...}`
5. Copy the JSON object

### Step 2: Create .NET Backend Endpoint
Create a C# controller to receive the data:

```csharp
// UsersController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> LoginUser([FromBody] UserLoginDto userDto)
    {
        try
        {
            // userDto will have: userId, email, firstName, lastName, role, etc.
            
            // 1. Check if user exists in database
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.ClerkId == userDto.UserId);

            if (existingUser == null)
            {
                // 2. Create new user
                var newUser = new User
                {
                    ClerkId = userDto.UserId,
                    Email = userDto.Email,
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    Role = userDto.Role,
                    CreatedAt = DateTime.UtcNow
                };
                
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
            }
            else
            {
                // 3. Update existing user
                existingUser.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Login successful", userId = userDto.UserId });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

// UserLoginDto.cs
public class UserLoginDto
{
    public string UserId { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public string ImageUrl { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Step 3: Connect Frontend to Backend
When ready, uncomment the backend call in `App.jsx`:

```javascript
// In App.jsx, replace the console logs with:

fetch('https://your-dotnet-api.com/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
    role: user.publicMetadata?.role || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
})
.then(response => response.json())
.then(data => console.log('✅ Backend response:', data))
.catch(error => console.error('❌ Error:', error))
```

---

## 🔑 Key Points for Integration

| Aspect | Details |
|--------|---------|
| **User ID** | From Clerk: `user.id` |
| **Email** | From Clerk: `user.primaryEmailAddress?.emailAddress` |
| **Name** | From Clerk: `user.firstName`, `user.lastName` |
| **Role** | Custom: `user.publicMetadata?.role` |
| **When Available** | Right after authentication confirmed |
| **Token** | Request JWT via `useAuth()` hook if needed |

---

## 📋 .NET User Model Example

```csharp
public class User
{
    public int Id { get; set; }                    // Database ID
    public string ClerkId { get; set; }           // Clerk user ID
    public string Email { get; set; }             // User email
    public string FirstName { get; set; }         // First name
    public string LastName { get; set; }          // Last name
    public string Role { get; set; }              // admin | client-owner | external-viewer
    public string ImageUrl { get; set; }          // Profile picture
    public DateTime CreatedAt { get; set; }       // Account created
    public DateTime UpdatedAt { get; set; }       // Last updated
    public DateTime? LastLoginAt { get; set; }    // Last login time
    public bool IsActive { get; set; }            // Account status
}
```

---

## 🧪 Testing the Integration

### Step 1: Check Frontend Logs
1. Run: `npm run dev`
2. Open http://localhost:5175 in browser
3. Sign in with test user
4. Open DevTools (F12) → Console tab
5. You'll see:
   ```
   👤 USER SIGNED IN/UP: {...}
   📤 SEND THIS TO .NET BACKEND: {...}
   🔐 USER ROLE ASSIGNED: admin
   ```

### Step 2: Verify Data Format
- Copy the JSON from console
- Paste into your .NET endpoint test tool (Postman, etc.)
- Verify backend receives it correctly

### Step 3: Test End-to-End
1. Sign in on frontend
2. Check database - user should be created/updated
3. Check backend logs
4. Verify response returns to frontend

---

## 🚨 Important Security Notes

### ✅ DO:
- Verify Clerk JWT tokens on backend
- Validate user data on backend
- Use HTTPS in production
- Store Clerk user ID as reference (not password)

### ❌ DON'T:
- Hardcode API URLs in frontend
- Send passwords over API
- Trust frontend role without backend verification
- Skip backend validation

---

## 🔐 Verify Clerk Token (Optional but Recommended)

Add this to frontend when sending to backend:

```javascript
import { useAuth } from '@clerk/clerk-react'

const { getToken } = useAuth()
const token = await getToken()

fetch('https://your-api.com/api/users/login', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  // ... rest of request
})
```

Then in .NET backend, verify the token:

```csharp
// Verify Clerk JWT token
var clerkClient = new ClerkClient(clerkSecretKey);
var decoded = clerkClient.VerifyToken(token);
// Token is valid - proceed with user creation
```

---

## 📊 Data Flow Diagram

```
User Signs In
    ↓
Clerk Authenticates
    ↓
Frontend logs to console:
  - 👤 USER SIGNED IN/UP
  - 🔐 USER ROLE ASSIGNED
  - 📤 JSON for backend
    ↓
Developer copies JSON from console
    ↓
Backend receives POST request
    ↓
Backend validates & saves user
    ↓
Backend returns success
    ↓
Frontend receives response
```

---

## 🎯 What to Do Now (Frontend Only)

✅ Already done:
- User data is logged to console
- Role is captured and logged
- Schema file created at `src/utils/backendIntegration.js`
- Ready for backend integration

⬜ What's next (for backend team):
1. Create UserLoginDto class
2. Create `/api/users/login` endpoint
3. Save user to database
4. Return response to frontend

---

## 📞 Testing Checklist

- [ ] Sign in to app
- [ ] Check console for logs
- [ ] See "👤 USER SIGNED IN/UP" message
- [ ] Copy JSON to test backend manually
- [ ] .NET endpoint created and working
- [ ] Database saves user correctly
- [ ] Backend returns success response
- [ ] Frontend receives response without errors

---

## 📚 Reference Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main user data logging (updates every login) |
| `src/contexts/RoleContext.jsx` | Role assignment logging |
| `src/utils/backendIntegration.js` | Schema & examples for backend |

---

## 🎉 You're Ready for Backend!

**Frontend is ready to send user data.** 

Next: Build your .NET backend to receive it!

Open **browser DevTools (F12)** and sign in to see the exact data format your backend will receive.

