/**
 * 🔗 Backend Integration Helper
 * 
 * Use this file to understand what user data is available from Clerk
 * and how to format it for your .NET backend
 */

/**
 * USER LOGIN/SIGNUP DATA FROM CLERK
 * 
 * This is what you'll get after authentication:
 */
export const USER_DATA_SCHEMA = {
  userId: "user_abc123...",          // Clerk's unique user ID
  email: "user@example.com",         // Primary email address
  firstName: "John",                 // First name
  lastName: "Doe",                   // Last name
  fullName: "John Doe",              // Full name
  imageUrl: "https://...",           // Profile image URL
  role: "admin",                     // Custom role from metadata
  createdAt: "2024-05-07T12:00:00", // Account creation timestamp
  updatedAt: "2024-05-07T14:30:00", // Last update timestamp
}

/**
 * 📡 HOW TO SEND DATA TO .NET BACKEND
 * 
 * Add this function to your code:
 */
export async function sendUserToBackend(userData) {
  try {
    const response = await fetch('https://your-api.com/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Add Clerk JWT token for verification
        'Authorization': `Bearer ${userData.clerkToken}`,
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json()
    console.log('✅ Backend response:', data)
    return data
  } catch (error) {
    console.error('❌ Error sending to backend:', error)
  }
}

/**
 * ✅ WHERE USER DATA IS AVAILABLE
 * 
 * 1. src/App.jsx
 *    └─ useUser() hook from @clerk/clerk-react
 *    └─ Check console logs with "USER SIGNED IN/UP"
 * 
 * 2. src/components/UserMenu.jsx
 *    └─ Display & sign out happens here
 * 
 * 3. src/contexts/RoleContext.jsx
 *    └─ Role is extracted from user metadata
 * 
 * 4. Any component using: useUser() from @clerk/clerk-react
 */

/**
 * 🔐 CLERK JWT TOKEN FOR BACKEND VERIFICATION
 * 
 * You can get the JWT token like this:
 * 
 * import { useAuth } from '@clerk/clerk-react'
 * 
 * const { getToken } = useAuth()
 * const token = await getToken()
 */

/**
 * 📋 .NET BACKEND EXAMPLE (What to build)
 * 
 * C# Controller Example:
 * 
 * [HttpPost("api/users/login")]
 * public async Task<IActionResult> LoginUser([FromBody] UserLoginDto userDto)
 * {
 *     // userDto will have:
 *     // - UserId (from Clerk)
 *     // - Email
 *     // - FirstName
 *     // - LastName
 *     // - Role
 *     
 *     // 1. Verify Clerk JWT token (if sent)
 *     // 2. Save/update user in your database
 *     // 3. Create session or return auth token
 *     // 4. Return success response
 * }
 */

/**
 * 🎯 IMPLEMENTATION STEPS
 * 
 * 1. In App.jsx - User data is logged to console (already done)
 * 2. In your .NET backend:
 *    - Create UserLoginDto class
 *    - Create endpoint to receive the data
 *    - Save user to database
 *    - Return success/error response
 * 3. In frontend (when ready):
 *    - Get user data from useUser()
 *    - Call fetch() to send to backend
 *    - Handle response
 * 
 * Example in App.jsx:
 * 
 * useEffect(() => {
 *   if (user) {
 *     const userData = {
 *       userId: user.id,
 *       email: user.primaryEmailAddress?.emailAddress,
 *       firstName: user.firstName,
 *       lastName: user.lastName,
 *       role: user.publicMetadata?.role,
 *     }
 *     
 *     // Send to your .NET backend
 *     fetch('https://yourapi.com/api/users/login', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(userData)
 *     })
 *   }
 * }, [user])
 */

/**
 * 🔍 CHECK CONSOLE LOGS
 * 
 * Open browser DevTools (F12)
 * Go to Console tab
 * 
 * You'll see:
 * - "👤 USER SIGNED IN/UP: {...}"  ← User data object
 * - "📤 SEND THIS TO .NET BACKEND: {...}"  ← JSON format
 * 
 * Copy this and use it as your API request body
 */

export default {
  USER_DATA_SCHEMA,
  sendUserToBackend,
}
