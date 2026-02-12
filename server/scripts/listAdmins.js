// List admin users in MongoDB
// Run with: node server/scripts/listAdmins.js

const mongoose = require('mongoose')
require('dotenv').config()

const User = require('../models/User')

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority'

async function main() {
  try {
    await mongoose.connect(MONGODB_URI)
    const admins = await User.find({ isAdmin: true }).select('email name mobile isAdmin createdAt').lean()
    const total = await User.countDocuments()
    console.log(`Total users: ${total}`)
    console.log(`Admin users: ${admins.length}`)
    admins.forEach((a, idx) => {
      console.log(`${idx + 1}. ${a.email} | ${a.name || ''} | ${a.mobile || ''} | isAdmin=${a.isAdmin}`)
    })
    process.exit(0)
  } catch (err) {
    console.error('Error listing admins:', err)
    process.exit(1)
  }
}

main()


