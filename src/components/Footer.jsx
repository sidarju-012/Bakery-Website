import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="footer-icon">🍰</span>
              The Happy Oven
            </h3>
            <p className="footer-tagline">Freshly baked with love in Bengaluru</p>
          </div>
          
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <p>
                <span className="contact-icon">📞</span>
                <a href="tel:9187409934">9187409934</a>
              </p>
              <p>
                <span className="contact-icon">📧</span>
                <a href="mailto:ds7394986767@gmail.com">ds7394986767@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Facebook">📘</a>
              <a href="#" className="social-icon" aria-label="Instagram">📷</a>
              <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} The Happy Oven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

