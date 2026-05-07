import { useState, useEffect } from 'react'
import { useUser, SignOutButton, useAuth } from '@clerk/clerk-react'
import Dashboard from './components/Dashboard'
import FloorPlan from './components/FloorPlan'
import Viewer360 from './components/Viewer360'
import MobileCapture from './components/MobileCapture'
import AdminPanel from './components/AdminPanel'
import ExternalViewer from './components/ExternalViewer'
import SignInPage from './components/SignInPage'
import UserMenu from './components/UserMenu'
import TokenExample from './components/TokenExample'
import { useUserRole } from './contexts/RoleContext'

function AppContent() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const userRole = useUserRole()
  const [currentView, setCurrentView] = useState('dashboard')

  // 🔵 LOG USER DATA WHEN SIGNED IN (For Backend Integration)
  useEffect(() => {
    if (user) {
      const userData = {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        role: user.publicMetadata?.role || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
      
      console.log('👤 USER SIGNED IN/UP:', userData)
      console.log('📤 SEND THIS TO .NET BACKEND:', JSON.stringify(userData))
      
      // 🔑 Get JWT Token when user is authenticated
      const fetchToken = async () => {
        try {
          const token = await getToken()
          console.log('🔐 JWT TOKEN OBTAINED:', token)
          console.log('📨 Send this to backend in Authorization header: Bearer ' + token.substring(0, 30) + '...')
        } catch (error) {
          console.error('Error getting token:', error)
        }
      }
      
      fetchToken()
    }
  }, [user, getToken])
, 'token'
  // Determine available views based on role
  const getAvailableViews = () => {
    if (!user) return []
    
    const views = {
      'admin': ['dashboard', 'properties', 'admin', 'floorplan', 'viewer360', 'capture'],
      'client-owner': ['dashboard', 'properties', 'floorplan', 'viewer360', 'capture'],
      'external-viewer': ['viewer'],
    }
    
    return views[userRole] || []
  }

  const availableViews = getAvailableViews()

  // Redirect if current view not available
  useEffect(() => {
    if (!availableViews.includes(currentView)) {
      setCurrentView(availableViews[0] || 'viewer')
    }
  }, [userRole])

  if (!user) {
    return <SignInPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-primary">Property Manager</h1>
            
            <div className="flex items-center space-x-2">
              {/* View Navigation */}
              <div className="flex items-center space-x-2 mr-4">
                {userRole !== 'external-viewer' && (
                  <>
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                        currentView === 'dashboard'
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setCurrentView('floorplan')}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                        currentView === 'floorplan'
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Floor Plan
                    </button>
                    <button
                      onClick={() => setCurrentView('viewer360')}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                        currentView === 'viewer360'
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      360° View
                    </button>
                    <button
                      onClick={() => setCurrentView('capture')}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                        currentView === 'capture'
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Capture
                    </button>
                  </>
                )}

                {userRole === 'admin' && (
                  <>
                    <button
                      onClick={() => setCurrentView('admin')}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                        currentView === 'admin'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => setCurrentView('token')}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                        currentView === 'token'
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🔑 JWT Token
                    </button>
                  </>
                )}

                {userRole === 'external-viewer' && (
                  <button
                    onClick={() => setCurrentView('viewer')}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                      currentView === 'viewer'
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Property View
                  </button>
                )}
              </div>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'floorplan' && <FloorPlan />}
        {currentView === 'viewer360' && <Viewer360 />}
        {currentView === 'capture' && <MobileCapture />}
        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'token' && <TokenExample />}
        {currentView === 'viewer' && <ExternalViewer />}
      </main>
    </div>
  )
}

export default AppContent
