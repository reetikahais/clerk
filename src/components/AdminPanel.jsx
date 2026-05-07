import { useUser } from '@clerk/clerk-react'
import { useUserRole } from '../contexts/RoleContext'
import ProtectedRoute from './ProtectedRoute'
import Dashboard from './Dashboard'

export default function AdminPanel() {
  const { user } = useUser()
  const role = useUserRole()

  return (
    <ProtectedRoute roles="admin">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-red-100">System management and user administration</p>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded p-4 border border-blue-200">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-primary">24</p>
              </div>
              <div className="bg-green-50 rounded p-4 border border-green-200">
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <div className="bg-purple-50 rounded p-4 border border-purple-200">
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-purple-600">3</p>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">John Doe</td>
                  <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Admin</span></td>
                  <td className="px-4 py-3"><span className="text-green-600 font-semibold">Active</span></td>
                  <td className="px-4 py-3"><button className="text-primary hover:underline">Edit</button></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">Jane Smith</td>
                  <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Client Owner</span></td>
                  <td className="px-4 py-3"><span className="text-green-600 font-semibold">Active</span></td>
                  <td className="px-4 py-3"><button className="text-primary hover:underline">Edit</button></td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">Mike Johnson</td>
                  <td className="px-4 py-3"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">Viewer</span></td>
                  <td className="px-4 py-3"><span className="text-yellow-600 font-semibold">Pending</span></td>
                  <td className="px-4 py-3"><button className="text-primary hover:underline">Review</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Authentication Enabled</p>
                <p className="text-sm text-gray-600">Clerk authentication is active</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
