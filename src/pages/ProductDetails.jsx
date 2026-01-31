import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = products.find(p => p.id === parseInt(id))
  
  const [weight, setWeight] = useState('1') // '0.5' for half kg, '1' for 1 kg
  const [quantity, setQuantity] = useState(1)
  const [baseVariant, setBaseVariant] = useState('wheat')
  const [sweetener, setSweetener] = useState('sugar')
  const [addedToCart, setAddedToCart] = useState(false)
  
  // Calculate price based on weight
  const getPrice = () => {
    const basePrice = product.price
    return weight === '0.5' ? basePrice * 0.5 : basePrice
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Home
        </button>
      </div>
    )
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, baseVariant, sweetener, weight, getPrice())
    setAddedToCart(true)
    
    // Show success message for 2 seconds
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  const handleViewCart = () => {
    navigate('/cart')
  }

  return (
    <div className="product-details">
      <div className="container">
        <div className="product-details-content">
          <div className="product-image-section">
            <img
              src={product.image}
              alt={product.name}
              className="product-large-image"
            />
          </div>
          
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-full-description">
              {product.description} Made with love and the finest ingredients. 
              Available in your choice of base and sweetener.
            </p>
            
            <div className="price-section">
              <span className="price-label">Base Price (1 kg):</span>
              <span className="price-value">₹{product.price}</span>
            </div>

            <div className="weight-section">
              <label className="section-label">Weight:</label>
              <div className="weight-options">
                <label className="weight-option">
                  <input
                    type="radio"
                    name="weight"
                    value="0.5"
                    checked={weight === '0.5'}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <span>Half kg (0.5 kg) - ₹{Math.round(product.price * 0.5)}</span>
                </label>
                <label className="weight-option">
                  <input
                    type="radio"
                    name="weight"
                    value="1"
                    checked={weight === '1'}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <span>1 kg - ₹{product.price}</span>
                </label>
              </div>
              <div className="selected-price">
                Selected Price: ₹{Math.round(getPrice())}
              </div>
            </div>

            <div className="quantity-section">
              <label className="section-label">Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <div className="total-price">
                Total: ₹{Math.round(getPrice() * quantity)}
              </div>
            </div>

            <div className="variants-section">
              <div className="variant-group">
                <label className="section-label">Base Variant:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="baseVariant"
                      value="wheat"
                      checked={baseVariant === 'wheat'}
                      onChange={(e) => setBaseVariant(e.target.value)}
                    />
                    <span>Wheat Flour</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="baseVariant"
                      value="maida"
                      checked={baseVariant === 'maida'}
                      onChange={(e) => setBaseVariant(e.target.value)}
                    />
                    <span>Maida</span>
                  </label>
                </div>
              </div>

              <div className="variant-group">
                <label className="section-label">Sweetener:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sweetener"
                      value="sugar"
                      checked={sweetener === 'sugar'}
                      onChange={(e) => setSweetener(e.target.value)}
                    />
                    <span>Sugar</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="sweetener"
                      value="brown-sugar"
                      checked={sweetener === 'brown-sugar'}
                      onChange={(e) => setSweetener(e.target.value)}
                    />
                    <span>Brown Sugar / Jaggery</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
              >
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={handleViewCart}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

