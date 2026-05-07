## 🚀 Clerk Authentication - Getting Started (5 Minutes)

This guide walks you through the complete setup step-by-step.

---

## Step 1: Create Clerk Account (1 min)

1. Open https://dashboard.clerk.com
2. Click "Sign up"
3. Create account (email/password or GitHub sign-in)
4. Choose "React" as your framework when asked
5. Follow the setup wizard

✅ **You now have a Clerk account**

---

## Step 2: Create Your Application (30 seconds)

In your Clerk Dashboard:

1. Click "Create Application" (or skip if already created)
2. Name it: "Property Manager" (or your choice)
3. Select "React" as the SDK
4. Click "Create Application"

✅ **Application created**

---

## Step 3: Get Your API Key (1 min)

1. In your Clerk Dashboard, click **API Keys** (left sidebar)
2. You'll see:
   ```
   Publishable Key: pk_test_abc123...
   Secret Key: sk_test_xyz789...
   ```
3. **Copy only the Publishable Key** (the one starting with `pk_`)

✅ **Key copied (keep it safe!)**

---

## Step 4: Add Key to Project (30 seconds)

1. Open your project folder: `d:\react`
2. Open `.env.local` file
3. Replace this line:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   ```
   With your actual key:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_abc123def456...
   ```
4. Save the file
5. **DO NOT share this key or commit it to git**

✅ **Key added to project**

---

## Step 5: Restart Development Server (30 seconds)

1. If `npm run dev` is still running, press `Ctrl+C` to stop
2. Run again:
   ```bash
   npm run dev
   ```
3. Wait for "Local: http://localhost:5173/"
4. Open browser to http://localhost:5173

✅ **App is running with authentication!**

You should see a sign-in page.

---

## Step 6: Create Test Users (2 minutes)

Now create 3 test users in Clerk Dashboard to try each role:

### User 1: Admin

1. In Clerk Dashboard, go to **Users**
2. Click **+ Create User**
3. Fill in:
   - Email: `admin@example.com`
   - Password: `Test1234!` (or your choice)
   - Uncheck "Send invitation email"
4. Click "Create"
5. Click on the user you just created
6. Scroll down to **Public Metadata**
7. Click **Add Metadata** and paste:
   ```json
   {
     "role": "admin"
   }
   ```
8. Click "Save"

### User 2: Client Owner

Repeat the same process with:
- Email: `client@example.com`
- Metadata: `{ "role": "client-owner" }`

### User 3: External Viewer

Repeat with:
- Email: `viewer@example.com`
- Metadata: `{ "role": "external-viewer" }`

✅ **Three test users created with roles**

---

## Step 7: Test Authentication (1 minute)

### Test Admin Login

1. Go to http://localhost:5173 in browser
2. You'll see the Sign-In page
3. Click "Sign in" 
4. Enter admin credentials:
   - Email: `admin@example.com`
   - Password: `Test1234!`
5. Click "Continue"

**Expected:**
- ✅ Redirects to dashboard
- ✅ See "Admin" in user menu (top right)
- ✅ "Admin" button visible in navigation
- ✅ Can click to see Admin Panel

### Sign Out and Test Client Owner

1. Click your profile in top right → Sign Out
2. Sign in as:
   - Email: `client@example.com`
   - Password: `Test1234!`

**Expected:**
- ✅ Redirects to dashboard
- ✅ See "Client Owner" in user menu
- ✅ NO Admin button in navigation
- ✅ Admin Panel shows "Access Denied"

### Sign Out and Test External Viewer

1. Click your profile → Sign Out
2. Sign in as:
   - Email: `viewer@example.com`
   - Password: `Test1234!`

**Expected:**
- ✅ Redirects to dashboard
- ✅ See "Viewer" in user menu
- ✅ Only "Property View" button visible
- ✅ Limited access to features

✅ **Authentication is working!**

---

## What You Now Have

✅ Secure authentication with Clerk
✅ Three user roles (admin, client-owner, external-viewer)
✅ Role-based access control
✅ User profiles with sign-out
✅ Protected routes and components
✅ Admin panel
✅ External viewer (shareable links)

---

## Next Steps

### 1. Customize the App

Edit these files to add your features:

```
src/
├── components/
│   ├── AdminPanel.jsx       ← Admin features
│   ├── Dashboard.jsx        ← Main dashboard
│   ├── ExternalViewer.jsx   ← Public viewer
│   └── [other components]
└── contexts/
    └── RoleContext.jsx      ← Modify role logic
```

### 2. Add Backend API

When you have a backend, verify tokens:

```javascript
// Backend example (Node.js)
const { verifyToken } = require('@clerk/clerk-sdk-node');

app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = await verifyToken(token);
  
  // decoded.sub = user ID
  // Get role from database using user ID
  const userRole = await getUserRole(decoded.sub);
  
  res.json({ role: userRole });
});
```

### 3. Deploy to Production

When deploying:

1. Create production Clerk application
2. Get production Publishable Key
3. Update `.env.production`
4. Deploy your app
5. Create production users in Clerk Dashboard

---

## Troubleshooting

### I see "Missing VITE_CLERK_PUBLISHABLE_KEY"

```
Solution:
1. Check .env.local file exists in root (d:\react\)
2. Make sure VITE_CLERK_PUBLISHABLE_KEY is set correctly
3. Restart npm run dev
4. Check browser console for specific error
```

### Sign-in button doesn't work

```
Solution:
1. Check publishable key is correct (should start with pk_)
2. Verify it's in Clerk Dashboard → API Keys
3. Make sure app is selected in Clerk Dashboard
4. Try in incognito browser window (clear cookies)
```

### Role not showing in UI

```
Solution:
1. Go to Clerk Dashboard → Users
2. Click on the user
3. Look for "Public Metadata" section
4. Make sure JSON is valid: { "role": "admin" }
5. Click "Save"
6. Sign out and sign back in
```

### Can't sign in at all

```
Solution:
1. Check user exists in Clerk Dashboard → Users
2. Make sure password is correct
3. Try creating a new test user
4. Clear browser cookies/cache
5. Try in different browser
```

---

## Documentation Files

Read these for more details:

| File | Content |
|------|---------|
| **QUICK_REFERENCE.md** | Quick code examples and patterns |
| **CLERK_SETUP.md** | Detailed setup and configuration |
| **CLERK_IMPLEMENTATION.md** | Technical implementation details |
| **ARCHITECTURE.md** | System design and diagrams |

---

## Key Hooks & Components

### Using Role in Components

```javascript
import { useUserRole, useHasRole } from './contexts/RoleContext'
import { useUser } from '@clerk/clerk-react'

function MyComponent() {
  const role = useUserRole()              // Get role: "admin" | "client-owner" | etc
  const isAdmin = useHasRole('admin')    // Check: true/false
  const { user } = useUser()              // Get user: name, email, image, etc
  
  if (!isAdmin) return <div>Access denied</div>
  
  return <div>Admin only content</div>
}
```

### Protecting Routes

```javascript
import ProtectedRoute from './components/ProtectedRoute'

<ProtectedRoute roles={['admin', 'client-owner']}>
  <PropertyManager />
</ProtectedRoute>
```

### Sign Out Button

```javascript
import { SignOutButton } from '@clerk/clerk-react'

<SignOutButton>
  <button>Sign Out</button>
</SignOutButton>
```

---

## Security Reminders

✅ **DO:**
- Keep publishable key in `.env.local` only
- Add `.env.local` to `.gitignore`
- Validate tokens on backend
- Use HTTPS in production
- Rotate keys periodically

❌ **DON'T:**
- Hardcode keys in source files
- Commit `.env.local` to git
- Trust client-side role checks for sensitive operations
- Share your secret key (never needed in frontend)
- Use test keys in production

---

## You're All Set! 🎉

Your app now has:
- ✅ Secure authentication
- ✅ Three user roles
- ✅ Protected features
- ✅ User management
- ✅ Sign in/out

**Happy coding!**

---

Questions? Check the documentation files or visit:
- Clerk Docs: https://clerk.com/docs
- React SDK: https://clerk.com/docs/references/react
- Dashboard: https://dashboard.clerk.com

---

**Need Help?**
1. Check Troubleshooting section above
2. Read CLERK_SETUP.md for detailed guide
3. Visit clerk.com/docs
4. Check browser console for error messages

