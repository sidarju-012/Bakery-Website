// Script to update existing user to admin or create new admin
// Run with: node server/scripts/updateUserToAdmin.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority'

async function updateUserToAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const email = 'sid88067@gmail.com'
    const password = 'Siddhant@123'
    const name = 'Siddhant'
    const mobile = '9187409934'

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() })
    
    if (user) {
      console.log('📝 User found, updating to admin...')
      // Update existing user
      user.isAdmin = true
      // Set password directly (will be hashed by pre-save hook)
      user.password = password
      user.name = name
      if (mobile) user.mobile = mobile
      // Mark password as modified to trigger hashing
      user.markModified('password')
      await user.save()
      console.log('✅ User updated to admin successfully!')
    } else {
      console.log('➕ Creating new admin user...')
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10)
      user = new User({
        name,
        email: email.toLowerCase(),
        mobile,
        password: hashedPassword,
        isAdmin: true
      })
      await user.save()
      console.log('✅ Admin user created successfully!')
    }
    
    console.log('\n📋 Admin Details:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Mobile: ${user.mobile}`)
    console.log(`   isAdmin: ${user.isAdmin}`)
    console.log('\n🎉 You can now login at: http://localhost:3000/admin/login')
    
    // Verify the user can login
    const testUser = await User.findOne({ email: email.toLowerCase() })
    const passwordMatch = await testUser.comparePassword(password)
    if (passwordMatch) {
      console.log('✅ Password verification: SUCCESS')
    } else {
      console.log('❌ Password verification: FAILED')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

updateUserToAdmin()

