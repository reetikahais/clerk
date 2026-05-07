export default function FloorPlan() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Floor Plan View</h2>
        <p className="text-gray-600 mb-6">Interactive floor plan visualization</p>

        <div className="bg-gray-100 rounded-lg border-2 border-gray-300 p-8">
          <svg viewBox="0 0 800 600" className="w-full border border-gray-400 bg-white rounded">
            {/* Walls */}
            <rect x="50" y="50" width="700" height="500" fill="none" stroke="#000" strokeWidth="8" />
            
            {/* Interior walls (rooms) */}
            <line x1="50" y1="200" x2="400" y2="200" stroke="#000" strokeWidth="4" />
            <line x1="400" y1="50" x2="400" y2="250" stroke="#000" strokeWidth="4" />
            <line x1="400" y1="300" x2="750" y2="300" stroke="#000" strokeWidth="4" />
            
            {/* Doors (gaps in walls) */}
            <rect x="200" y="198" width="40" height="4" fill="white" />
            <rect x="395" y="220" width="4" height="40" fill="white" />
            
            {/* Windows */}
            <rect x="100" y="48" width="80" height="4" fill="#87CEEB" />
            <rect x="300" y="548" width="100" height="4" fill="#87CEEB" />
            
            {/* Room labels */}
            <text x="100" y="120" fontSize="20" fontWeight="bold" fill="#3B82F6">Living Room</text>
            <text x="420" y="120" fontSize="16" fontWeight="bold" fill="#3B82F6">Bedroom</text>
            <text x="470" y="350" fontSize="16" fontWeight="bold" fill="#3B82F6">Kitchen</text>
            <text x="120" y="450" fontSize="16" fontWeight="bold" fill="#3B82F6">Bathroom</text>
            
            {/* Furniture examples */}
            <rect x="150" y="280" width="100" height="60" fill="#D2691E" opacity="0.6" />
            <text x="175" y="320" fontSize="12" fill="white" fontWeight="bold">Sofa</text>
            
            <rect x="450" y="130" width="80" height="60" fill="#8B4513" opacity="0.6" />
            <text x="460" y="165" fontSize="12" fill="white" fontWeight="bold">Bed</text>
          </svg>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900">Total Area</h3>
            <p className="text-2xl font-bold text-primary">1,200 sq ft</p>
          </div>
          <div className="bg-green-50 rounded p-4 border border-green-200">
            <h3 className="font-semibold text-gray-900">Bedrooms</h3>
            <p className="text-2xl font-bold text-green-600">2</p>
          </div>
          <div className="bg-purple-50 rounded p-4 border border-purple-200">
            <h3 className="font-semibold text-gray-900">Bathrooms</h3>
            <p className="text-2xl font-bold text-purple-600">1.5</p>
          </div>
        </div>
      </div>
    </div>
  )
}
