import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Header.css'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const { user, logout } = useAuth()
  const { getTotalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const cartItemCount = getTotalItems()

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0
      setScrolled(y > 50)

      // Mobile-only: hide header when scrolling down, show when scrolling up / at top
      const isMobile = window.innerWidth <= 768
      if (isMobile) {
        const lastY = lastScrollYRef.current
        const delta = y - lastY

        if (y < 10) {
          setHidden(false)
        } else if (delta > 10 && y > 120) {
          // scrolling down
          setHidden(true)
        } else if (delta < -10) {
          // scrolling up
          setHidden(false)
        }

        lastScrollYRef.current = y
      } else {
        setHidden(false)
        lastScrollYRef.current = y
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    // Clear cart first
    clearCart()
    // Then logout (clears user data)
    logout()
    // Navigate to login page
    navigate('/login', { replace: true })
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🍰</span>
            <span className="logo-text">The Happy Oven</span>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <a 
              href="#products" 
              className="nav-link"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault()
                  window.location.href = '/#products'
                } else {
                  e.preventDefault()
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Products
            </a>
            <a 
              href="#jar-cakes" 
              className="nav-link"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault()
                  window.location.href = '/#jar-cakes'
                } else {
                  document.getElementById('jar-cakes')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Jar Cakes
            </a>
            <a 
              href="#why-choose" 
              className="nav-link"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault()
                  window.location.href = '/#why-choose'
                } else {
                  e.preventDefault()
                  document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              Why Choose Us
            </a>
            <a 
              href="#faq" 
              className="nav-link"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault()
                  window.location.href = '/#faq'
                } else {
                  e.preventDefault()
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              FAQ
            </a>
            <Link to="/cart" className="cart-link">
              <span className="cart-icon">🛒</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="nav-link">My Orders</Link>
                <div className="user-menu">
                  <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-small">
                  Login
                </Link>
                <Link to="/admin/login" className="nav-link" style={{ fontSize: '14px' }}>
                  Admin
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

