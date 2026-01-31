import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { checkServerHealth } from '../utils/api'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState(null)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/')
      return
    }

    // Clear any cached user data on login page
    const cachedUser = localStorage.getItem('user')
    if (cachedUser) {
      localStorage.removeItem('user')
    }

    // Check server health on mount
    checkServerHealth().then(isHealthy => {
      setServerStatus(isHealthy)
      if (!isHealthy) {
        setError('Backend server is not running. Please start it with: npm run server')
      }
    })
  }, [user, navigate])

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
      await login(formData.email, formData.password)
      navigate('/')
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
          <h1>🍰</h1>
          <h2>Welcome Back!</h2>
          <p>Login to The Happy Oven</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {serverStatus === false && (
            <div className="error-message" style={{ background: '#fff3cd', color: '#856404', borderLeft: '4px solid #ffc107' }}>
              ⚠️ Backend server is not running. Please start it in a separate terminal with: <strong>npm run server</strong>
            </div>
          )}
          {error && serverStatus !== false && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

