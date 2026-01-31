import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // Verify user data is valid
        if (userData && userData._id) {
          setUser(userData)
          // Optionally verify user still exists in database
          authAPI.getUser(userData._id)
            .catch(() => {
              // If user doesn't exist, clear localStorage
              localStorage.removeItem('user')
              setUser(null)
            })
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('user')
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('user')
        setUser(null)
      }
    } else {
      // Ensure user state is null if no saved user
      setUser(null)
    }
    setLoading(false)
  }, [])

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const newUser = response.user
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      return newUser
    } catch (error) {
      // Re-throw with a user-friendly message
      const errorMessage = error.message || 'Registration failed. Please try again.'
      throw new Error(errorMessage)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const user = response.user
      
      // Include isAdmin flag from response if available
      if (response.isAdmin !== undefined) {
        user.isAdmin = response.isAdmin
      }
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return user
    } catch (error) {
      // Re-throw with a user-friendly message
      const errorMessage = error.message || 'Login failed. Please check your credentials and try again.'
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    // Clear all user-related data
    localStorage.removeItem('user')
    // Also clear cart data
    localStorage.removeItem('cartItems')
    setUser(null)
  }

  const value = {
    user,
    register,
    login,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

