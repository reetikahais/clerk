## 🏗️ Clerk Authentication Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         ClerkProvider (main.jsx)                     │  │
│  │  - Manages Clerk authentication                      │  │
│  │  - Handles sign-in/out                              │  │
│  │  - Stores session tokens securely                   │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │      RoleProvider (RoleContext.jsx)           │ │  │
│  │  │  - Reads user metadata                        │ │  │
│  │  │  - Determines user role                       │ │  │
│  │  │  - Provides role to all components            │ │  │
│  │  │                                               │ │  │
│  │  │  ┌──────────────────────────────────────────┐│ │  │
│  │  │  │        App Component (App.jsx)         ││ │  │
│  │  │  │                                        ││ │  │
│  │  │  │  Navigation + View Router              ││ │  │
│  │  │  │                                        ││ │  │
│  │  │  │  Components:                          ││ │  │
│  │  │  │  - Dashboard                          ││ │  │
│  │  │  │  - FloorPlan                          ││ │  │
│  │  │  │  - Viewer360                          ││ │  │
│  │  │  │  - MobileCapture                      ││ │  │
│  │  │  │  - AdminPanel (role-protected)        ││ │  │
│  │  │  │  - ExternalViewer (no auth)           ││ │  │
│  │  │  └──────────────────────────────────────┘│ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    Clerk Backend API
                 (Authentication Server)
```

### Authentication Flow

```
START: User visits app
  │
  ├─→ [Is user authenticated?]
  │
  ├─→ NO: Show SignInPage → Clerk login form
  │       └─→ User enters credentials
  │           └─→ Clerk validates
  │              └─→ Session created
  │                 └─→ Redirect to app
  │
  └─→ YES: Continue to role check
          │
          └─→ [Has role in metadata?]
              │
              ├─→ NO: role = null (access denied)
              │
              └─→ YES: role = metadata.role
                  │
                  ├─→ "admin" → Show admin features
                  ├─→ "client-owner" → Show property tools
                  └─→ "external-viewer" → Show limited view
```

### Component Communication

```
ClerkProvider
    │
    ├─ useUser()              ← Get authenticated user
    │
    └─ useAuth()              ← Get auth state
            │
            └─→ RoleProvider
                    │
                    ├─ useUserRole()     ← Get user role
                    ├─ useHasRole()      ← Check permission
                    │
                    └─→ Components can use hooks:
                        │
                        ├─ useUser()           (Clerk)
                        ├─ useUserRole()       (Custom)
                        ├─ useHasRole()        (Custom)
                        ├─ SignOutButton       (Clerk UI)
                        └─ ProtectedRoute      (Custom)
```

### Data Flow: User Sign-In

```
User Form Input
    ↓
Clerk SDK (clerk-react)
    ↓
Clerk API Server
    ↓
Validate credentials
    ↓
Create session
    ↓
Return JWT token + user data
    ↓
Store session locally (secure)
    ↓
useUser() hook activated
    ↓
RoleProvider reads user.publicMetadata.role
    ↓
Set role in context
    ↓
All child components get updated role
    ↓
Navigation re-renders based on role
    ↓
User sees role-appropriate UI
```

### Role Access Matrix

```
Route/Feature       │ Admin │ Client-Owner │ External │ Anonymous
────────────────────┼───────┼──────────────┼──────────┼──────────
/dashboard          │  ✓    │      ✓       │    ✗     │    ✗
/floorplan          │  ✓    │      ✓       │    ✗     │    ✗
/viewer360          │  ✓    │      ✓       │    ✗     │    ✗
/capture            │  ✓    │      ✓       │    ✗     │    ✗
/admin              │  ✓    │      ✗       │    ✗     │    ✗
/viewer (public)    │  ✓    │      ✓       │    ✓     │    ✓
/signin             │  ✗    │      ✗       │    ✗     │    ✓
────────────────────┴───────┴──────────────┴──────────┴──────────
✓ = Accessible    ✗ = Blocked/Hidden
```

### File Dependencies

```
main.jsx
  ├─ Imports ClerkProvider
  ├─ Imports RoleProvider
  └─ Imports App.jsx
        │
        ├─ Imports Dashboard.jsx (uses useUserRole)
        ├─ Imports FloorPlan.jsx
        ├─ Imports Viewer360.jsx
        ├─ Imports MobileCapture.jsx
        │
        ├─ Imports AdminPanel.jsx
        │   └─ Uses ProtectedRoute(roles="admin")
        │
        ├─ Imports ExternalViewer.jsx
        │   └─ Uses ProtectedRoute(roles="external-viewer")
        │
        ├─ Imports UserMenu.jsx
        │   ├─ Uses useUser() (Clerk)
        │   └─ Uses useUserRole() (Custom)
        │
        └─ Imports SignInPage.jsx
            └─ Uses Clerk SignIn component

Contexts:
RoleContext.jsx
  ├─ useUserRole()
  ├─ useHasRole()
  └─ RoleProvider
     └─ Uses useUser() from Clerk
        └─ Reads user.publicMetadata.role

Components:
ProtectedRoute.jsx
  │
  ├─ Uses useHasRole()
  ├─ Checks if user has required role
  └─ Shows content or access denied

Other Components:
  └─ Use hooks as needed:
     ├─ useUserRole()
     ├─ useHasRole()
     └─ useUser()
```

### Session Management

```
Browser Storage (Secure)
    │
    ├─ Session Token (encrypted)
    ├─ User ID
    └─ User Metadata
            │
            └─→ useUser() hook checks on load
                │
                └─→ Returns user object
                    │
                    ├─ user.id
                    ├─ user.fullName
                    ├─ user.imageUrl
                    ├─ user.publicMetadata ← ROLE HERE
                    └─ user.primaryEmailAddress
```

### Error Handling

```
User Action
    ↓
Try-Catch in component
    ↓
Error Handler
    ├─ Network error → Retry or show message
    ├─ Auth error → Redirect to sign-in
    ├─ Permission error → Show access denied
    └─ Other → Show generic error
    ↓
User sees error message
    ↓
Suggested action (sign in, contact admin, etc.)
```

### Roles and Permissions Matrix (Detailed)

```
┌───────────────────────┬─────────────────────────────────────────┐
│        ADMIN          │              Permissions                │
├───────────────────────┼─────────────────────────────────────────┤
│ metadata.role = admin │  • View all properties                 │
│                       │  • Create/edit/delete properties       │
│                       │  • Manage all users                    │
│                       │  • View system analytics               │
│                       │  • Access admin panel                  │
│                       │  • Configure system settings           │
│                       │  • Upload 360° photos                  │
│                       │  • View all reports                    │
└───────────────────────┴─────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│    CLIENT-OWNER       │              Permissions                │
├───────────────────────┼─────────────────────────────────────────┤
│ metadata.role =       │  • View own properties                 │
│ client-owner          │  • Edit own properties                 │
│                       │  • Upload photos/360° content          │
│                       │  • View property analytics             │
│                       │  • Can't manage other users            │
│                       │  • Can't access admin panel            │
│                       │  • Can generate shareable links        │
└───────────────────────┴─────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│  EXTERNAL-VIEWER      │              Permissions                │
├───────────────────────┼─────────────────────────────────────────┤
│ metadata.role =       │  • View property via shared link       │
│ external-viewer       │  • View 360° photos                    │
│ (or no auth needed)   │  • View floor plan                     │
│                       │  • Can't upload content                │
│                       │  • Can't edit property                 │
│                       │  • Limited timeline (expires)          │
│                       │  • No account required                 │
└───────────────────────┴─────────────────────────────────────────┘
```

### Security Layers

```
Layer 1: Frontend (Browser)
    └─ Clerk SDK validates user
    └─ JWT token stored securely
    └─ useUser() hook checks auth status

Layer 2: Component Level
    └─ ProtectedRoute checks role
    └─ useHasRole() validates permissions
    └─ Conditional rendering based on role

Layer 3: Backend (When added)
    └─ Verify Clerk JWT token
    └─ Double-check role from database
    └─ Authorize API calls

Layer 4: API Security
    └─ Validate tokens on every request
    └─ Check user permissions in database
    └─ Log sensitive operations
    └─ Rate limiting and DDoS protection
```

### Key Concepts

**ClerkProvider**
- Wraps entire app
- Manages all authentication
- Provides useUser() hook
- Handles session persistence

**RoleProvider**
- Gets user data from Clerk
- Reads role from user metadata
- Provides role to all components
- Handles role-based logic

**useUserRole()**
- Returns current user's role
- Returns null if not authenticated
- Used to personalize UI

**useHasRole()**
- Checks if user has specific role(s)
- Accepts single role or array
- Returns boolean

**ProtectedRoute**
- Wraps sensitive components
- Checks user authentication
- Checks user role
- Shows fallback if denied

**External Viewer**
- No authentication required
- Accessed via public link
- Limited feature set
- Perfect for sharing with clients
