import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ordersAPI } from '../utils/api'
import { onImgError } from '../utils/imageFallback'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    deliveryDate: ''
  })

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login')
      return
    }

    // Check if cart has items
    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    // Pre-fill form with user data
    if (user) {
      setFormData({
        name: user.name || '',
        mobile: user.mobile || '',
        address: ''
      })
    }
  }, [navigate, user, cartItems])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.mobile || !formData.address || !formData.deliveryDate) {
      alert('Please fill in all fields including delivery date')
      return
    }

    // Validate delivery date (should be today or future)
    const selectedDate = new Date(formData.deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      alert('Delivery date cannot be in the past. Please select today or a future date.')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setLoading(true)

    try {
      // Save each cart item as a separate order
      for (const item of cartItems) {
        // Validate jar cake minimum order
        if (item.type === 'jar' && item.quantity < 2) {
          alert(`Minimum order of 2 jars required for ${item.name}. Please update quantity.`)
          setLoading(false)
          return
        }

        const orderData = {
          userId: user._id || user.id,
          productName: item.type === 'jar'
            ? `${item.name} (${item.weight || '350ml'} Jar)`
            : `${item.name} (${item.weight === '0.5' ? 'Half kg' : '1 kg'})`,
          productImage: item.image,
          quantity: item.quantity,
          weight: item.type === 'jar'
            ? `${item.weight || '350ml'} Glass Jar`
            : (item.weight === '0.5' ? 'Half kg (0.5 kg)' : '1 kg'),
          baseVariant: item.type === 'jar' ? 'N/A' : (item.baseVariant === 'wheat' ? 'Wheat Flour' : 'Maida'),
          sweetener: item.type === 'jar' ? 'N/A' : (item.sweetener === 'sugar' ? 'Sugar' : 'Brown Sugar / Jaggery'),
          totalPrice: Math.round(item.price * item.quantity),
          customerName: formData.name,
          customerMobile: formData.mobile,
          address: formData.address,
          deliveryDate: formData.deliveryDate
        }

        await ordersAPI.createOrder(orderData)
      }

      // Clear cart after successful order save
      clearCart()
      setOrderPlaced(true)
      setTimeout(() => {
        navigate('/orders')
      }, 3000)
    } catch (error) {
      console.error('Order placement error:', error)
      const errorMessage = error.message || 'Failed to place order. Please check your connection and try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h2>Order placed successfully!</h2>
          <p>Redirecting to orders page...</p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/orders')}
            >
              View Orders
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout">
      <Helmet>
        <title>Checkout | The Happy Oven</title>
        <meta name="description" content="Complete your cake order at The Happy Oven. Enter delivery details and place order." />
        <link rel="canonical" href="https://thehappyoven.net/checkout" />
      </Helmet>
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-image">
                    <img src={item.image} alt={item.name} onError={onImgError(item.fallbackImage)} />
                  </div>
                  <div className="summary-details">
                    <h3>{item.name}</h3>
                    <div className="summary-variants">
                      {item.type === 'jar' ? (
                        <>
                          <p><strong>Size:</strong> {item.weight || '350ml'} Glass Jar</p>
                          <p><strong>Quantity:</strong> {item.quantity} jar{item.quantity > 1 ? 's' : ''}</p>
                          <p><strong>Price:</strong> ₹{Math.round(item.price)} × {item.quantity} = ₹{Math.round(item.price * item.quantity)}</p>
                        </>
                      ) : (
                        <>
                          <p><strong>Weight:</strong> {item.weight === '0.5' ? 'Half kg (0.5 kg)' : '1 kg'}</p>
                          <p><strong>Base:</strong> {item.baseVariant === 'wheat' ? 'Wheat Flour' : 'Maida'}</p>
                          <p><strong>Sweetener:</strong> {item.sweetener === 'sugar' ? 'Sugar' : 'Brown Sugar / Jaggery'}</p>
                          <p><strong>Quantity:</strong> {item.quantity}</p>
                          <p><strong>Price:</strong> ₹{Math.round(item.price)} × {item.quantity} = ₹{Math.round(item.price * item.quantity)}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <div className="summary-price">
                <span>Total Price:</span>
                <span className="price">₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Customer Form */}
          <div className="customer-form-section">
            <h2>Customer Details</h2>
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your mobile number"
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your delivery address"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryDate">Delivery Date *</label>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  placeholder="Select delivery date"
                />
                <small style={{ color: 'var(--text-light)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  Please select the date when you want the cake to be delivered
                </small>
              </div>

              <div className="payment-method">
                <h3>Payment Method</h3>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    defaultChecked
                    disabled
                  />
                  <label htmlFor="cod">Cash on Delivery (COD)</label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading"></span>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

