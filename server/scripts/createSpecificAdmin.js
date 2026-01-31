// Script to create a specific admin user
// Run with: node server/scripts/createSpecificAdmin.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority'

async function createSpecificAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')

    // Admin credentials
    const email = 'sid88067@gmail.com'
    const password = 'Siddhant@123'
    const name = 'Siddhant'
    const mobile = '9187409934'

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      // Update existing user to admin
      existingUser.isAdmin = true
      existingUser.password = await bcrypt.hash(password, 10)
      existingUser.name = name
      existingUser.mobile = mobile
      await existingUser.save()
      console.log('✅ Existing user updated to admin!')
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
      console.log(`   Admin status: Active`)
    } else {
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
      console.log(`   Name: ${name}`)
      console.log(`   Mobile: ${mobile}`)
      console.log(`   Admin status: Active`)
    }
    
    console.log('\n🎉 You can now login at: http://localhost:3000/admin/login')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createSpecificAdmin()

