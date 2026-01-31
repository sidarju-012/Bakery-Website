const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority'

if (!process.env.MONGODB_URI) {
  console.log('⚠️  Warning: Using default MongoDB URI. Create .env file for production.')
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/orders', require('./routes/orders'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

