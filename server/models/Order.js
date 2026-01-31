const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  weight: {
    type: String,
    default: '1 kg'
  },
  baseVariant: {
    type: String,
    required: true
  },
  sweetener: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  customerName: {
    type: String,
    required: true
  },
  customerMobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Order Placed',
    enum: ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)

