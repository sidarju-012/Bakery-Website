// API configuration
// NOTE: If you already have another process using :5000, you can run the backend on :5001
// and the frontend will use it by default here.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Check if server is running
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`)
    return response.ok
  } catch {
    return false
  }
}

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    // Check if response is JSON
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || 'Server error')
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000')
    }
    
    // Re-throw with better message
    if (error.message) {
      throw error
    }
    
    throw new Error('Network error. Please check your connection and ensure the server is running.')
  }
}

const getCurrentUserId = () => {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    const u = JSON.parse(raw)
    return u?._id || u?.id || null
  } catch {
    return null
  }
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  getUser: async (userId) => {
    return apiCall(`/auth/user/${userId}`)
  }
}

// Orders API
export const ordersAPI = {
  createOrder: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  },

  getUserOrders: async (userId) => {
    return apiCall(`/orders/user/${userId}`)
  },

  getOrder: async (orderId) => {
    return apiCall(`/orders/${orderId}`)
  },

  updateOrderStatus: async (orderId, status) => {
    return apiCall(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  },

  // Admin APIs
  getAllOrders: async (date = null) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Admin session missing. Please login again.')
    const endpoint = date ? `/orders/admin/all?date=${date}` : '/orders/admin/all'
    return apiCall(endpoint, { headers: { 'x-user-id': userId } })
  },

  getAdminStats: async (date) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Admin session missing. Please login again.')
    return apiCall(`/orders/admin/stats?date=${date}`, { headers: { 'x-user-id': userId } })
  }
}

