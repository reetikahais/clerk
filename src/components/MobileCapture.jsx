import { useState } from 'react'

export default function MobileCapture() {
  const [photos, setPhotos] = useState([
    { id: 1, name: 'Living Room', date: '2024-05-07', status: '✓ Captured' },
    { id: 2, name: 'Master Bedroom', date: '2024-05-07', status: '✓ Captured' },
    { id: 3, name: 'Kitchen', date: '2024-05-06', status: '✓ Captured' },
    { id: 4, name: 'Bathroom', date: '', status: '⏳ Pending' },
  ])

  const [cameraActive, setCameraActive] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mobile Photo Capture</h2>
        <p className="text-gray-600 mb-6">Capture property photos directly from your mobile device</p>

        {/* Camera View Simulator */}
        {cameraActive ? (
          <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-white text-lg font-semibold">Camera Active</p>
                <p className="text-gray-400 text-sm mt-2">Position device and tap to capture</p>
              </div>
            </div>
            
            {/* Camera frame border */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-red-500 rounded pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-red-500 rounded-full pointer-events-none"></div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-16 text-center mb-6">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-600 font-medium">Ready to capture</p>
          </div>
        )}

        {/* Camera Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              cameraActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {cameraActive ? '✕ Stop Camera' : '▶ Start Camera'}
          </button>
          {cameraActive && (
            <button
              onClick={() => {
                setPhotos([...photos, {
                  id: photos.length + 1,
                  name: 'New Capture',
                  date: new Date().toISOString().split('T')[0],
                  status: '✓ Captured'
                }])
              }}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition"
            >
              📸 Capture Photo
            </button>
          )}
        </div>

        {/* Capture History */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Capture History</h3>
          <div className="space-y-3">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded p-4 border border-gray-200 flex items-center justify-between hover:shadow-sm transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xl">
                    📷
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{photo.name}</p>
                    <p className="text-sm text-gray-600">{photo.date || 'Not yet captured'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  photo.status.includes('Captured')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {photo.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded p-4 border border-green-200">
            <div className="text-sm text-gray-600">Captured</div>
            <div className="text-3xl font-bold text-green-600">{photos.filter(p => p.status.includes('Captured')).length}</div>
          </div>
          <div className="bg-yellow-50 rounded p-4 border border-yellow-200">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{photos.filter(p => p.status.includes('Pending')).length}</div>
          </div>
          <div className="bg-blue-50 rounded p-4 border border-blue-200">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-3xl font-bold text-primary">75%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
