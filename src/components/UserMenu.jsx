import { useUser, SignOutButton } from '@clerk/clerk-react'
import { useUserRole } from '../contexts/RoleContext'

export default function UserMenu() {
  const { user } = useUser()
  const role = useUserRole()

  if (!user) return null

  const roleLabels = {
    'admin': { label: 'Admin', color: 'bg-red-100 text-red-800' },
    'client-owner': { label: 'Client Owner', color: 'bg-blue-100 text-blue-800' },
    'external-viewer': { label: 'Viewer', color: 'bg-green-100 text-green-800' },
  }

  const roleInfo = roleLabels[role] || { label: 'User', color: 'bg-gray-100 text-gray-800' }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex items-center gap-2">
        <img
          src={user.imageUrl}
          alt={user.fullName}
          className="w-8 h-8 rounded-full"
        />
        <div className="text-sm">
          <p className="font-medium text-gray-900">{user.firstName}</p>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${roleInfo.color}`}>
            {roleInfo.label}
          </span>
        </div>
      </div>
      <SignOutButton>
        <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
          Sign Out
        </button>
      </SignOutButton>
    </div>
  )
}
