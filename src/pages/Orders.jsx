import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ordersAPI } from '../utils/api'
import './Orders.css'

const Orders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        const userId = user._id || user.id
        const userOrders = await ordersAPI.getUserOrders(userId)
        setOrders(userOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        // Fallback to empty array on error
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, navigate])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const groupOrdersByDate = () => {
    const grouped = {}
    orders.forEach(order => {
      const date = new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(order)
    })
    return grouped
  }

  if (loading) {
    return (
      <div className="orders-loading">
        <p>Loading your orders...</p>
      </div>
    )
  }

  const groupedOrders = groupOrdersByDate()

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {Object.entries(groupedOrders).map(([date, dateOrders]) => (
              <div key={date} className="orders-date-group">
                <h2 className="date-header">{date}</h2>
                {dateOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <strong>Order ID:</strong> #{order._id ? order._id.slice(-8) : order.id?.slice(-8) || 'N/A'}
                      </div>
                      <div className="order-time">
                        {new Date(order.orderDate || order.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="order-content">
                      <div className="order-image">
                        <img src={order.productImage} alt={order.productName} />
                      </div>
                      <div className="order-details">
                        <h3>{order.productName}</h3>
                        <div className="order-info">
                          <p><strong>Weight:</strong> {order.weight || '1 kg'}</p>
                          <p><strong>Quantity:</strong> {order.quantity}</p>
                          <p><strong>Base:</strong> {order.baseVariant}</p>
                          <p><strong>Sweetener:</strong> {order.sweetener}</p>
                          <p><strong>Delivery Date:</strong> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not specified'}</p>
                          <p><strong>Delivery Address:</strong> {order.address}</p>
                        </div>
                        <div className="order-price">
                          <span>Total: </span>
                          <span className="price">₹{order.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-status">
                      <span className="status-badge">Order Placed</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders

