# Clerk Authentication Setup Guide

This guide explains how to implement Clerk authentication in your React project with three user roles.

## 🚀 Quick Setup

### 1. Create a Clerk Account

1. Visit [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up for a free account
3. Create a new application (choose "React" as your framework)

### 2. Get Your API Keys

1. Go to your Clerk Dashboard
2. Navigate to **API Keys** (left sidebar)
3. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
4. Add it to `.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
```

### 3. Install Dependencies

```bash
npm install @clerk/clerk-react
```

Done! The app is already configured.

---

## 👥 User Roles

Three roles are implemented:

| Role | Access | Use Case |
|------|--------|----------|
| **admin** | Full system access, user management | Copy.nl team members |
| **client-owner** | Manage properties, upload photos | Property contractors |
| **external-viewer** | View shared properties only | End clients, limited access |

### Setting User Roles in Clerk Dashboard

#### Method 1: Custom Metadata (Recommended)

1. In Clerk Dashboard, go to **Users**
2. Click on a user
3. Scroll to **Public Metadata**
4. Add:
```json
{
  "role": "admin"
}
```
or
```json
{
  "role": "client-owner"
}
```

#### Method 2: Organizations (Advanced)

For more complex role management:

1. Enable **Organizations** in Clerk settings
2. Create three organizations: "Admins", "Client Owners", "Viewers"
3. Assign users to appropriate organizations

---

## 🔐 How Authentication Works

### Project Structure

```
src/
├── contexts/
│   └── RoleContext.jsx          # Role management
├── components/
│   ├── SignInPage.jsx           # Sign in form
│   ├── UserMenu.jsx             # User profile dropdown
│   ├── ProtectedRoute.jsx       # Role-based access control
│   ├── AdminPanel.jsx           # Admin-only features
│   ├── ExternalViewer.jsx       # Public viewer (no login)
│   └── [other components]
└── App.jsx                       # Main app with auth integration
```

### Authentication Flow

```
User visits app
    ↓
Check if authenticated (Clerk hooks)
    ↓
If NOT authenticated → Show SignInPage
    ↓
If authenticated → Get user role from metadata
    ↓
RoleProvider passes role to all components
    ↓
Navigation updates based on role
    ↓
Components check role with ProtectedRoute or useHasRole()
```

### Sign In Page

- Clerk-hosted sign-in component
- Automatic redirect after login
- Demo role information displayed

### External Viewer (No Login)

```javascript
// Users can view properties without authentication
// Access via shareable link
// Example: https://yourapp.com?viewer=true
```

---

## 🛠️ Usage Examples

### 1. Get Current User's Role

```javascript
import { useUserRole } from './contexts/RoleContext'

function MyComponent() {
  const role = useUserRole()
  
  if (role === 'admin') {
    return <AdminPanel />
  }
  
  return <UserPanel />
}
```

### 2. Check if User Has Specific Role

```javascript
import { useHasRole } from './contexts/RoleContext'

function Settings() {
  const isAdmin = useHasRole('admin')
  const isEditor = useHasRole(['admin', 'client-owner'])
  
  if (!isEditor) {
    return <div>You don't have access</div>
  }
  
  return <SettingsPanel />
}
```

### 3. Protect Routes by Role

```javascript
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      {/* Only admins can see this */}
      <ProtectedRoute roles="admin">
        <AdminPanel />
      </ProtectedRoute>

      {/* Admin or client-owner can see this */}
      <ProtectedRoute roles={['admin', 'client-owner']}>
        <PropertyManager />
      </ProtectedRoute>

      {/* Fallback UI if no access */}
      <ProtectedRoute 
        roles="admin"
        fallback={<div>Admin access required</div>}
      >
        <AdminSettings />
      </ProtectedRoute>
    </>
  )
}
```

### 4. User Sign Out

```javascript
import { SignOutButton } from '@clerk/clerk-react'

function LogoutButton() {
  return (
    <SignOutButton>
      <button>Sign Out</button>
    </SignOutButton>
  )
}
```

### 5. Access User Info

```javascript
import { useUser } from '@clerk/clerk-react'

function Profile() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) return <div>Loading...</div>
  
  return (
    <div>
      <img src={user.imageUrl} alt={user.fullName} />
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.primaryEmailAddress?.emailAddress}</p>
    </div>
  )
}
```

---

## 🔗 External Viewer (No Login Required)

For clients without accounts (shareable links):

```javascript
// Route without authentication requirement
// Users can view properties without signing in
// Perfect for sharing property tours with clients
```

**Example Implementation:**

```javascript
// In App.jsx, handle public viewer
if (viewerMode && !user) {
  return <ExternalViewer propertyId={propertyId} />
}
```

---

## 🆔 Testing Roles Locally

### Create Test Users in Clerk Dashboard

1. Go to **Users** in Clerk Dashboard
2. Click **+ Create user**
3. Add test user for each role
4. Set their public metadata with appropriate role
5. Test sign-in with each user

### Quick Test Flow

1. Sign in as **admin** → See admin panel
2. Sign out
3. Sign in as **client-owner** → See property management
4. Sign out
5. Share external viewer link → No login required

---

## 🔒 Security Best Practices

✅ **Do's:**
- Always validate roles on backend (when you add a backend)
- Use environment variables for API keys
- Keep session tokens secure
- Verify JWT tokens server-side

❌ **Don'ts:**
- Don't hardcode API keys in code
- Don't trust client-side role checks for sensitive data
- Don't expose secrets in commits
- Don't cache user roles longer than necessary

---

## 🚨 Troubleshooting

### "Missing VITE_CLERK_PUBLISHABLE_KEY"
- Add key to `.env.local`
- Restart dev server: `npm run dev`

### Sign-in loop / Not redirecting
- Check Clerk dashboard for correct app setup
- Verify `publishableKey` is correct
- Check browser console for errors

### Roles not working
- Confirm role is set in Clerk Dashboard user metadata
- Check RoleProvider wraps your app
- Verify role key is exactly `"role"` in metadata

### "useUserRole must be used within RoleProvider"
- Make sure `<RoleProvider>` wraps your app in `main.jsx`
- Check component is imported correctly

---

## 📚 Advanced: Backend Integration

When you add a backend:

1. **Backend should verify Clerk tokens:**
```javascript
// Node.js example
const clerkClient = require('@clerk/clerk-sdk-node').default;

const token = request.headers.authorization;
const decoded = await clerkClient.verifyToken(token);
const userId = decoded.sub;
```

2. **Get role from backend (not client):**
```javascript
// Instead of trusting client-side role
// Fetch from backend database
const response = await fetch('/api/user/role', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { role } = await response.json();
```

3. **Use backend role for sensitive operations**

---

## 📖 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react)
- [Custom JWT claims](https://clerk.com/docs/tokens/jwt-templates)
- [Organizations (advanced roles)](https://clerk.com/docs/organizations/overview)

---

## Next Steps

1. ✅ Create Clerk account
2. ✅ Get publishable key
3. ✅ Add to `.env.local`
4. ✅ Create test users with roles
5. ✅ Test sign in/sign out flows
6. ✅ Verify role-based access works

Your authentication system is ready! 🎉
