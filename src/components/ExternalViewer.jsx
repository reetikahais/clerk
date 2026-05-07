import { useUser } from '@clerk/clerk-react'

export default function ExternalViewer() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Shared Property Link</h2>
        <p className="text-blue-700">
          {user 
            ? `Welcome! You can view this property without creating an account.`
            : 'View this property without creating an account.'
          }
        </p>
      </div>

      {/* Limited property preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Property Preview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Floor plan section */}
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <h4 className="font-semibold text-gray-900 mb-3">Floor Plan</h4>
            <svg viewBox="0 0 400 300" className="w-full border border-gray-400 bg-white rounded">
              <rect x="25" y="25" width="350" height="250" fill="none" stroke="#000" strokeWidth="4" />
              <line x1="25" y1="100" x2="200" y2="100" stroke="#000" strokeWidth="2" />
              <rect x="25" y="25" width="40" height="2" fill="#87CEEB" />
              <text x="50" y="60" fontSize="14" fontWeight="bold" fill="#3B82F6">Living Room</text>
              <text x="220" y="60" fontSize="14" fontWeight="bold" fill="#3B82F6">Bedroom</text>
            </svg>
          </div>

          {/* Stats section */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-4 border border-blue-200">
              <p className="text-sm text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-primary">1,200 sq ft</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-4 border border-green-200">
              <p className="text-sm text-gray-600">Bedrooms</p>
              <p className="text-2xl font-bold text-green-600">2</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded p-4 border border-purple-200">
              <p className="text-sm text-gray-600">Bathrooms</p>
              <p className="text-2xl font-bold text-purple-600">1.5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Property Features</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✓</span> Modern kitchen with stainless steel appliances
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✓</span> Hardwood flooring throughout
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✓</span> In-unit laundry
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✓</span> Access to 360° property tour
          </li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Note:</span> This preview has limited access. 
          For more information, please contact the property owner.
        </p>
      </div>
    </div>
  )
}
