import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { onImgError } from '../utils/imageFallback'
import './Cart.css'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(i => i.id === itemId)
    if (item) {
      const newQuantity = item.quantity + change
      const minQty = item.minOrderQuantity || (item.type === 'jar' ? 2 : 1)
      if (newQuantity < minQty) return
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }

    navigate('/checkout')
  }

  const totalPrice = getTotalPrice()

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to your cart!</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} onError={onImgError(item.fallbackImage)} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-variants">
                    {item.type === 'jar' ? (
                      <span><strong>Size:</strong> {item.weight || '350ml'} Glass Jar</span>
                    ) : item.type === 'piece' ? (
                      <span><strong>Unit:</strong> Per piece</span>
                    ) : (
                      <>
                        <span><strong>Weight:</strong> {item.weight === '0.5' ? 'Half kg (0.5 kg)' : '1 kg'}</span>
                        <span><strong>Base:</strong> {item.baseVariant === 'wheat' ? 'Wheat Flour' : 'Maida'}</span>
                        <span><strong>Sweetener:</strong> {item.sweetener === 'sugar' ? 'Sugar' : 'Brown Sugar / Jaggery'}</span>
                      </>
                    )}
                  </div>
                  <div className="cart-item-price">
                    ₹{Math.round(item.price)} per {item.type === 'jar' ? 'jar' : item.type === 'piece' ? 'piece' : (item.weight === '0.5' ? 'half kg' : 'kg')}
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={item.quantity <= (item.minOrderQuantity || (item.type === 'jar' ? 2 : 1))}
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <div className="item-total-price">₹{Math.round(item.price * item.quantity)}</div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button
              className="btn btn-primary btn-checkout"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
            <Link to="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

