import { useState } from 'react'

export default function Dashboard() {
  const [properties] = useState([
    { id: 1, name: 'Modern Apartment', location: 'Downtown', status: 'Active', price: '$450,000' },
    { id: 2, name: 'Family House', location: 'Suburbs', status: 'Available', price: '$750,000' },
    { id: 3, name: 'Studio Loft', location: 'Arts District', status: 'Sold', price: '$320,000' },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome to your property management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Total Properties</div>
          <div className="text-3xl font-bold text-primary mt-2">12</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Active Listings</div>
          <div className="text-3xl font-bold text-green-600 mt-2">8</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Pending Offers</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">3</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Sold Properties</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">1</div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{prop.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prop.location}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{prop.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      prop.status === 'Active' ? 'bg-green-100 text-green-800' :
                      prop.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
