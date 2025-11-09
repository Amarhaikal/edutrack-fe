// API Configuration
// Copy this file to api.ts and configure your actual API URLs

export const API_CONFIG = {
  // Use environment variables for production
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  LOCAL_URL: 'http://localhost:8000/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Helper function to get auth headers with token
export const getAuthHeaders = (token: string) => ({
  ...API_CONFIG.HEADERS,
  'Authorization': `Bearer ${token}`
})

// Helper function to get base headers
export const getBaseHeaders = () => API_CONFIG.HEADERS

// Error handling and token validation
export const handleApiResponse = async (response: Response) => {
  const data = await response.json()

  // Check for token-related errors
  if (data.status === 'error' &&
      (data.message?.includes('Token is required') ||
       data.message?.includes('invalid') ||
       data.message?.includes('expired'))) {

    // Clear invalid token
    localStorage.removeItem('token')

    // Show session expired toast if the function is available
    if ((window as any).showSessionExpiredToast) {
      (window as any).showSessionExpiredToast()
    }

    // Redirect to login page with session expired reason
    window.location.href = '/edutrack/login?reason=session_expired'

    // Throw error to stop execution
    throw new Error('Authentication failed: ' + data.message)
  }

  return data
}

// Enhanced fetch wrapper for authenticated requests
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')

  if (!token) {
    window.location.href = '/edutrack/login'
    throw new Error('No token found')
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...options.headers
    }
  })

  return handleApiResponse(response)
}
