import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_ORIGIN, authAPI, checkServerHealth } from '../utils/api'
import './Auth.css'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })   
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState(null)
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check server health on mount
    checkServerHealth().then(isHealthy => {
      setServerStatus(isHealthy)
      if (!isHealthy) {
        setError(`Backend is not reachable at ${API_ORIGIN}. Please check your Vercel env var VITE_API_BASE_URL.`)
      }
    })
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(formData.email, formData.password)

      // Re-fetch the user from API to avoid stale/local cached flags
      const verified = user?._id ? await authAPI.getUser(user._id) : user

      // Check if user is admin
      if (!verified?.isAdmin) {
        setError(`Access denied. Admin privileges required for ${verified?.email || formData.email}.`)
        logout()
        return
      }

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🔐</h1>
          <h2>Admin Login</h2>
          <p>Access The Happy Oven Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {serverStatus === false && (
            <div className="error-message" style={{ background: '#fff3cd', color: '#856404', borderLeft: '4px solid #ffc107' }}>
              ⚠️ Backend is not reachable at <strong>{API_ORIGIN}</strong>. If you deployed the backend on Render, set <strong>VITE_API_BASE_URL</strong> to <strong>https://bakery-website-backend.onrender.com</strong> in Vercel and redeploy.
            </div>
          )}
          {error && serverStatus !== false && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

