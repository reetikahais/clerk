import { createContext, useContext } from 'react'
import { useUser } from '@clerk/clerk-react'

const RoleContext = createContext()

/**
 * Hook to get current user's role
 * Returns: 'admin' | 'client-owner' | 'external-viewer' | null
 */
export function useUserRole() {
  const context = useContext(RoleContext)
  console.log('RoleContext value:', context) // Debugging log
  if (!context) {
    throw new Error('useUserRole must be used within RoleProvider')
  }
  return context.role
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(roles) {
  const role = useUserRole()
  return Array.isArray(roles) ? roles.includes(role) : role === roles
}

export function RoleProvider({ children }) {
  const { user, isLoaded } = useUser()

  // Determine user role based on organization metadata or custom claims
  const getUserRole = () => {
    if (!user) return null

    // Check custom metadata for role
    const metadata = user.publicMetadata || {}
    if (metadata.role) {
      console.log('🔐 USER ROLE ASSIGNED:', metadata.role)
      return metadata.role
    }

    // Default role if not set
    console.log('⚠️ No role found in user metadata')
    return null
  }

  const role = getUserRole()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <RoleContext.Provider value={{ role, user }}>
      {children}
    </RoleContext.Provider>
  )
}
