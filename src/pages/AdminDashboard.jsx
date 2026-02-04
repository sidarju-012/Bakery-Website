import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ordersAPI } from '../utils/api'
import { onImgError } from '../utils/imageFallback'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate('/admin/login')
      return
    }

    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  const fetchStats = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await ordersAPI.getAdminStats(selectedDate)
      setStats(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch order statistics')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user || !user.isAdmin) {
    return null
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <h1>🍰 Admin Dashboard</h1>
            <div className="admin-actions">
              <span className="admin-name">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="dashboard-content">
          <div className="date-filter-section">
            <label htmlFor="dateFilter" className="date-label">
              Select Date to View Orders:
            </label>
            <input
              type="date"
              id="dateFilter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
            <button onClick={fetchStats} className="btn btn-primary">
              Refresh
            </button>
          </div>

          {loading && (
            <div className="loading-state">
              <p>Loading order statistics...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
            </div>
          )}

          {stats && !loading && (
            <>
              {/* Statistics Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🎂</div>
                  <div className="stat-content">
                    <h3>Total Quantity</h3>
                    <p className="stat-value">{stats.totalQuantity}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{stats.totalRevenue}</p>
                  </div>
                </div>
              </div>

              {/* Product Statistics */}
              {stats.productStats && stats.productStats.length > 0 && (
                <div className="product-stats-section">
                  <h2>Product-wise Statistics</h2>
                  <div className="product-stats-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Orders</th>
                          <th>Quantity</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.productStats.map((product, index) => (
                          <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.orders}</td>
                            <td>{product.quantity}</td>
                            <td>₹{product.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="orders-section">
                <h2>Order Details for {formatDate(selectedDate)}</h2>
                {stats.orders && stats.orders.length > 0 ? (
                  <div className="orders-list">
                    {stats.orders.map((order) => (
                      <div key={order._id || order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-id">
                            <strong>Order ID:</strong> #{order._id ? order._id.slice(-8) : 'N/A'}
                          </div>
                          <div className="order-time">
                            {new Date(order.orderDate || order.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="order-status">
                            <span className="status-badge">{order.status}</span>
                          </div>
                        </div>

                        <div className="order-content">
                          <div className="order-image">
                            <img src={order.productImage} alt={order.productName} onError={onImgError()} />
                          </div>
                          <div className="order-details">
                            <h3>{order.productName}</h3>
                            <div className="order-info">
                              <p><strong>Customer:</strong> {order.customerName}</p>
                              <p><strong>Mobile:</strong> {order.customerMobile}</p>
                              <p><strong>Weight:</strong> {order.weight || '1 kg'}</p>
                              <p><strong>Quantity:</strong> {order.quantity}</p>
                              <p><strong>Base:</strong> {order.baseVariant}</p>
                              <p><strong>Sweetener:</strong> {order.sweetener}</p>
                              <p><strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}</p>
                              <p><strong>Address:</strong> {order.address}</p>
                            </div>
                            <div className="order-price">
                              <span>Total: </span>
                              <span className="price">₹{order.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders">
                    <p>No orders found for {formatDate(selectedDate)}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

