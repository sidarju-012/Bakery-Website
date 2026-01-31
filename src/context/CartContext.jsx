import React, { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1, baseVariant = 'wheat', sweetener = 'sugar', weight = '1', calculatedPrice = null) => {
    // Use calculated price if provided, otherwise calculate based on weight
    const itemPrice = calculatedPrice !== null 
      ? calculatedPrice 
      : (weight === '0.5' ? product.price * 0.5 : product.price)
    
    const cartItem = {
      id: `${product.id}-${baseVariant}-${sweetener}-${weight}`, // Unique ID for variant combinations including weight
      productId: product.id,
      name: product.name,
      image: product.image,
      price: itemPrice, // Price per unit based on weight
      basePrice: product.price, // Original 1kg price for reference
      weight: weight, // '0.5' or '1'
      quantity: quantity,
      baseVariant: baseVariant,
      sweetener: sweetener,
      description: product.description
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        return [...prevItems, cartItem]
      }
    })

    return cartItem
  }

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cartItems')
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

