// Script to create an admin user
// Run with: node server/scripts/createAdmin.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority'

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')

    // Get admin details from command line or use defaults
    const args = process.argv.slice(2)
    const email = args[0] || 'admin@happyoven.com'
    const password = args[1] || 'admin123'
    const name = args[2] || 'Admin User'
    const mobile = args[3] || '9999999999'

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase() })
    if (existingAdmin) {
      if (existingAdmin.isAdmin) {
        console.log('⚠️  Admin user already exists with this email')
        process.exit(0)
      } else {
        // Update existing user to admin
        existingAdmin.isAdmin = true
        existingAdmin.password = await bcrypt.hash(password, 10)
        await existingAdmin.save()
        console.log('✅ Existing user updated to admin')
        process.exit(0)
      }
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      isAdmin: true
    })

    await admin.save()
    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('   Please change the password after first login!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()

