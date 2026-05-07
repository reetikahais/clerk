import { useState } from 'react'

export default function Viewer360() {
  const [rotation, setRotation] = useState(0)

  const handleRotate = (direction) => {
    setRotation(prev => (prev + (direction === 'left' ? -15 : 15)) % 360)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">360° Property Viewer</h2>
        <p className="text-gray-600 mb-6">Immersive property walkthrough experience</p>

        <div className="bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg overflow-hidden aspect-video flex items-center justify-center mb-6 relative">
          {/* Simulated 360 viewer display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-xl font-semibold">360° View - Rotation: {rotation}°</p>
              <p className="text-sm mt-2">Use controls below to explore the property</p>
            </div>
          </div>

          {/* Gradient overlay based on rotation */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20 transition-all duration-300"
            style={{ transform: `rotateY(${rotation / 360 * 360}deg)` }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => handleRotate('left')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition flex items-center gap-2"
          >
            ← Rotate Left
          </button>
          <button
            onClick={() => setRotation(0)}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            Reset View
          </button>
          <button
            onClick={() => handleRotate('right')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition flex items-center gap-2"
          >
            Rotate Right →
          </button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-4 border border-blue-200">
            <div className="text-sm text-gray-600">Resolution</div>
            <div className="text-lg font-bold text-primary">4K</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-4 border border-green-200">
            <div className="text-sm text-gray-600">Format</div>
            <div className="text-lg font-bold text-green-600">Equirectangular</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded p-4 border border-purple-200">
            <div className="text-sm text-gray-600">FOV</div>
            <div className="text-lg font-bold text-purple-600">360°</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded p-4 border border-orange-200">
            <div className="text-sm text-gray-600">Hotspots</div>
            <div className="text-lg font-bold text-orange-600">12</div>
          </div>
        </div>
      </div>
    </div>
  )
}
