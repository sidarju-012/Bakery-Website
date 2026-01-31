const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body

    // Validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password
    })

    await user.save()

    // Return user without password
    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON()
    })
  } catch (error) {
    console.error('Register error:', error)
    
    // Handle duplicate key error (MongoDB)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({ error: errors.join(', ') })
    }
    
    res.status(500).json({ error: 'Server error during registration. Please try again.' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Return user without password
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      isAdmin: user.isAdmin || false
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error during login' })
  }
})

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router

