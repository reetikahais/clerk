import { Children } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useUserRole } from '../contexts/RoleContext'

/**
 * Component to restrict access based on user role
 * 
 * Usage:
 * <ProtectedRoute roles={['admin', 'client-owner']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles, fallback }) {
  const { user } = useUser()
  const userRole = useUserRole()

  // Not authenticated
  if (!user) {
    return fallback || (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-yellow-900 mb-2">Authentication Required</h2>
        <p className="text-yellow-700">Please sign in to access this content.</p>
      </div>
    )
  }

  // Check if user has required role
  if (!Array.isArray(roles)) {
    roles = [roles]
  }

  if (!roles.includes(userRole)) {
    return fallback || (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-red-900 mb-2">Access Denied</h2>
        <p className="text-red-700">You don't have permission to view this content.</p>
      </div>
    )
  }

  return children
}
