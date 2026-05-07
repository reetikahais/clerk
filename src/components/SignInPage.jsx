import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Manager</h1>
          <p className="text-gray-600 mb-8">Sign in to manage your properties</p>
          
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Demo Accounts</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <p className="font-semibold text-red-900">Admin</p>
              <p className="text-red-700">Full system access</p>
            </div>
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="font-semibold text-blue-900">Client Owner</p>
              <p className="text-blue-700">Manage properties</p>
            </div>
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="font-semibold text-green-900">External Viewer</p>
              <p className="text-green-700">View shared properties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
