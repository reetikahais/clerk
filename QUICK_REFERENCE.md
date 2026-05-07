# 🔐 Clerk Authentication - Quick Reference

## ⚡ Quick Setup (2 minutes)

```bash
# 1. Get publishable key from https://dashboard.clerk.com
# 2. Add to .env.local:
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# 3. Start the app
npm run dev

# 4. Sign in with test user
# Visit: http://localhost:5173
```

## 👥 Three User Roles

```
┌─────────────────────┬──────────────────────┬─────────────────┐
│      ADMIN          │   CLIENT-OWNER       │ EXTERNAL-VIEWER │
├─────────────────────┼──────────────────────┼─────────────────┤
│ • Dashboard         │ • Dashboard          │ • Property View │
│ • Floor Plan        │ • Floor Plan         │ • Read-only     │
│ • 360° View         │ • 360° View          │ • No login req   │
│ • Photo Capture     │ • Photo Capture      │ • Shareable     │
│ • User Management   │ • (Limited access)   │ • Limited UI    │
│ • System Settings   │                      │                 │
└─────────────────────┴──────────────────────┴─────────────────┘
```

## 📁 Project Structure

```
d:\react/
├── src/
│   ├── contexts/
│   │   └── RoleContext.jsx          ← Role state
│   ├── components/
│   │   ├── SignInPage.jsx           ← Login form
│   │   ├── UserMenu.jsx             ← Profile/logout
│   │   ├── ProtectedRoute.jsx       ← Access control
│   │   ├── AdminPanel.jsx           ← Admin features
│   │   ├── ExternalViewer.jsx       ← Public viewer
│   │   └── [other components]
│   ├── App.jsx                      ← Main + auth
│   └── main.jsx                     ← Clerk setup
├── .env.local                       ← Your Clerk key
├── CLERK_SETUP.md                  ← Full docs
└── CLERK_IMPLEMENTATION.md         ← Details
```

## 🎯 Usage Patterns

### 1. Get User Role
```javascript
import { useUserRole } from './contexts/RoleContext'

const role = useUserRole()
// Returns: 'admin' | 'client-owner' | 'external-viewer' | null
```

### 2. Check Permission
```javascript
import { useHasRole } from './contexts/RoleContext'

const isAdmin = useHasRole('admin')
const canEdit = useHasRole(['admin', 'client-owner'])
```

### 3. Protect Component
```javascript
import ProtectedRoute from './components/ProtectedRoute'

<ProtectedRoute roles="admin">
  <AdminPanel />
</ProtectedRoute>
```

### 4. Get User Info
```javascript
import { useUser } from '@clerk/clerk-react'

const { user } = useUser()
// user.fullName, user.imageUrl, user.primaryEmailAddress, etc.
```

### 5. Sign Out
```javascript
import { SignOutButton } from '@clerk/clerk-react'

<SignOutButton>
  <button>Logout</button>
</SignOutButton>
```

## 🔑 Setting User Roles

**In Clerk Dashboard:**

1. Go to `Users`
2. Click on a user
3. Scroll to "Public Metadata"
4. Add JSON:
```json
{
  "role": "admin"
}
```

**Available roles:**
- `admin` - Full access
- `client-owner` - Limited management
- `external-viewer` - Read-only

## 🧪 Test Users to Create

| Name | Email | Role | Password |
|------|-------|------|----------|
| Admin User | admin@test.com | admin | (your choice) |
| John Smith | john@test.com | client-owner | (your choice) |
| Jane Public | jane@test.com | external-viewer | (your choice) |

## 🚀 Running the App

```bash
# Development
npm run dev
# Opens: http://localhost:5173

# Production build
npm run build

# Preview production
npm run preview
```

## 🔗 Important Links

| Link | Purpose |
|------|---------|
| https://dashboard.clerk.com | Get your API keys |
| https://clerk.com/docs | Full documentation |
| `.env.local` | Store your publishable key |
| `CLERK_SETUP.md` | Detailed setup guide |
| `CLERK_IMPLEMENTATION.md` | Implementation details |

## ✅ Verification Checklist

- [ ] Clerk account created at dashboard.clerk.com
- [ ] Publishable key copied to `.env.local`
- [ ] `npm install` completed
- [ ] `npm run dev` runs without errors
- [ ] App opens at http://localhost:5173
- [ ] Sign-in page shows
- [ ] Can sign in with test user
- [ ] Role appears in UI
- [ ] Navigation matches role
- [ ] Admin panel visible for admin
- [ ] Sign out works

## 🐛 Quick Troubleshooting

```
❌ "Missing VITE_CLERK_PUBLISHABLE_KEY"
✅ Add key to .env.local, restart npm run dev

❌ Sign-in not working
✅ Verify key in Clerk dashboard

❌ Roles not showing
✅ Set role in user's Public Metadata (JSON: {"role": "admin"})

❌ Can't find Admin Panel
✅ Sign in as admin user; set role = "admin" in Clerk
```

## 💡 Pro Tips

1. **Test All Roles** - Sign in and out with different users
2. **Check Metadata** - Roles are in `user.publicMetadata`
3. **Customize UI** - All components are editable
4. **Add More Roles** - Extend RoleContext for additional roles
5. **Backend Integration** - Verify Clerk tokens on your backend

## 📚 Documentation Files

- **CLERK_SETUP.md** - Complete setup and configuration guide
- **CLERK_IMPLEMENTATION.md** - Technical implementation details
- **README.md** - Project overview

## 🎉 You're Ready!

1. Get your Clerk publishable key
2. Add to `.env.local`
3. Create test users with roles
4. Test authentication flow
5. Customize components as needed

**Questions?** Check the documentation files or visit https://clerk.com/docs

---

**Last Updated:** May 7, 2026
**Version:** 1.0.0 (with Clerk integration)
