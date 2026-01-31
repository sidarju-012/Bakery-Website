import React from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="floating-cake">🍰</div>
          <div className="floating-cupcake">🧁</div>
          <div className="floating-bread">🍞</div>
        </div>
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Freshly prepared Cakes<br />
              Delivered in Bengaluru
            </h1>
            <p className="hero-subtitle">
              Freshly baked | Eggless Cake | Refined free Oil used in preparation
            </p>
            <a 
              href="#products" 
              className="btn btn-primary hero-cta"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore Our Cakes
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="products-section">
        <div className="container">
          <h2 className="section-title">Our Delicious Creations</h2>
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="product-card slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                  <div className="product-overlay">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-secondary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose" className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose The Happy Oven?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎂</div>
              <h3>Freshly Prepared Cakes</h3>
              <p>Every cake is made fresh daily with the finest ingredients</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Same-day Preparation & Delivery</h3>
              <p>Order today and get your cake delivered the same day</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Custom Designs</h3>
              <p>Princess, Cartoon, Wedding, Kids Themes - we do it all!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌾</div>
              <h3>Healthy Cakes</h3>
              <p>Free from maida and refined oil - made with whole wheat</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3 className="faq-question">Q: What sizes and prices are available?</h3>
              <p className="faq-answer">
                A: We offer 500 g and 1 kg standard birthday cakes with prices starting from ₹500. 
                Availability and pricing vary by flavour and weight.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Q: What are your delivery hours?</h3>
              <p className="faq-answer">
                A: We deliver daily between 9:00 AM and 10:00 PM. Cut-off times may apply during 
                peak hours and festivals.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Q: Can I add a custom message on the cake?</h3>
              <p className="faq-answer">
                A: Yes. Add your message at checkout and we'll include it on the cake or a greeting 
                plaque.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Q: Are the cakes freshly baked?</h3>
              <p className="faq-answer">
                A: Yes. Cakes are prepared fresh and dispatched in secure boxes. A free knife is 
                included with every order.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Q: Do you prepare maida cakes too?</h3>
              <p className="faq-answer">
                A: Yes. We usually prefer whole wheat but we customize as per customer preference.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

