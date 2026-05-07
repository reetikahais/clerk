import { useAuth, useUser } from '@clerk/clerk-react'
import { useState } from 'react'

/**
 * 🔑 JWT Token Example Component
 * 
 * Shows how to:
 * - Get JWT token from Clerk
 * - Send it to backend
 * - Handle responses
 */
export default function TokenExample() {
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [copied, setCopied] = useState(false)

  // Get JWT token
  const handleGetToken = async () => {
    if (!isSignedIn) {
      alert('Please sign in first')
      return
    }

    setLoading(true)
    try {
      const jwtToken = await getToken()
      setToken(jwtToken)
      
      console.log('🔑 JWT TOKEN:', jwtToken)
      console.log('📊 Decoded:', JSON.parse(atob(jwtToken.split('.')[1])))
    } catch (error) {
      console.error('Error getting token:', error)
    } finally {
      setLoading(false)
    }
  }

  // Send token to backend
  const handleSendToBackend = async () => {
    if (!token) {
      alert('Get token first')
      return
    }

    setLoading(true)
    try {
      // Example: Sending to backend
      const backendUrl = 'https://your-api.com/api/auth/verify' // Replace with your API
      
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        })
      })

      const data = await res.json()
      setResponse(data)
      
      console.log('✅ Backend Response:', data)
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  // Copy token to clipboard
  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-700">Please sign in to see JWT token</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔑 JWT Token Example</h2>
        
        {/* User Info */}
        <div className="bg-blue-50 rounded p-4 border border-blue-200 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Current User</h3>
          <p className="text-gray-700"><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
          <p className="text-gray-700"><strong>User ID:</strong> {user.id}</p>
          <p className="text-gray-700"><strong>Name:</strong> {user.fullName}</p>
        </div>

        {/* Get Token Button */}
        <button
          onClick={handleGetToken}
          disabled={loading}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition disabled:opacity-50 mb-4"
        >
          {loading ? 'Getting token...' : '🔑 Get JWT Token'}
        </button>

        {/* Token Display */}
        {token && (
          <div className="bg-gray-900 rounded p-4 mb-4 relative">
            <p className="text-gray-400 text-sm mb-2">JWT Token:</p>
            <div className="bg-gray-800 rounded p-3 mb-2 overflow-x-auto">
              <code className="text-green-400 text-xs font-mono break-all">
                {token.substring(0, 50)}...{token.substring(token.length - 30)}
              </code>
            </div>
            <button
              onClick={handleCopyToken}
              className="text-sm text-green-400 hover:text-green-300"
            >
              {copied ? '✅ Copied!' : '📋 Copy Full Token'}
            </button>
          </div>
        )}

        {/* Token Details */}
        {token && (
          <div className="bg-purple-50 rounded p-4 border border-purple-200 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Token Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Format:</strong> JWT (3 parts separated by dots)</p>
              <p><strong>Header:</strong> Algorithm info</p>
              <p><strong>Payload:</strong> User claims & data</p>
              <p><strong>Signature:</strong> Cryptographic proof</p>
              <p><strong>Expiry:</strong> 1 hour (auto-refreshed)</p>
              <p><strong>Usage:</strong> Send in Authorization header</p>
            </div>
          </div>
        )}

        {/* Send to Backend */}
        {token && (
          <button
            onClick={handleSendToBackend}
            disabled={loading}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 mb-4"
          >
            {loading ? 'Sending...' : '📤 Send Token to Backend'}
          </button>
        )}

        {/* Backend Response */}
        {response && (
          <div className={`rounded p-4 border ${response.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <h3 className="font-semibold text-gray-900 mb-2">Backend Response:</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto bg-white p-3 rounded border border-gray-200">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 rounded p-4 border border-yellow-200 mt-6">
          <h3 className="font-semibold text-yellow-900 mb-2">📝 How to Use This</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Click "Get JWT Token" button</li>
            <li>Token will be obtained from Clerk</li>
            <li>Copy token and use in your API calls</li>
            <li>Send in header: <code className="bg-yellow-100 px-1 rounded">Authorization: Bearer {'{token}'}</code></li>
            <li>Backend verifies token with Clerk</li>
          </ol>
        </div>

        {/* Code Example */}
        <div className="bg-gray-50 rounded p-4 border border-gray-200 mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">💻 Frontend Code Example</h3>
          <pre className="text-xs text-gray-700 overflow-x-auto bg-gray-900 text-green-400 p-3 rounded">
{`import { useAuth } from '@clerk/clerk-react'

const { getToken } = useAuth()
const token = await getToken()

fetch('/api/endpoint', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
})`}
          </pre>
        </div>

        {/* Backend Code Example */}
        <div className="bg-gray-50 rounded p-4 border border-gray-200 mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">🔧 Backend Code Example (.NET)</h3>
          <pre className="text-xs text-gray-700 overflow-x-auto bg-gray-900 text-green-400 p-3 rounded">
{`[HttpGet("api/endpoint")]
public async Task<IActionResult> GetData()
{
  var token = Request.Headers["Authorization"]
    .ToString()
    .Replace("Bearer ", "");
  
  var verification = 
    await _clerk.Tokens.VerifyTokenAsync(token);
  
  if (verification == null)
    return Unauthorized();
  
  // Token is valid
  return Ok(data);
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
