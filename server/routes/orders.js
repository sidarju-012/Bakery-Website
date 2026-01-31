const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

// Create new order
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      productName,
      productImage,
      quantity,
      weight,
      baseVariant,
      sweetener,
      totalPrice,
      customerName,
      customerMobile,
      address,
      deliveryDate
    } = req.body

    // Validation
    if (!userId || !productName || !quantity || !totalPrice || !customerName || !address || !deliveryDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create new order
    const order = new Order({
      userId,
      productName,
      productImage: productImage || '',
      quantity,
      weight: weight || '1 kg',
      baseVariant: baseVariant || 'Wheat Flour',
      sweetener: sweetener || 'Sugar',
      totalPrice,
      customerName,
      customerMobile: customerMobile || '',
      address,
      deliveryDate,
      status: 'Order Placed'
    })

    await order.save()

    res.status(201).json({
      message: 'Order placed successfully',
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Server error creating order' })
  }
})

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ orderDate: -1 }) // Newest first
      .exec()

    res.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ error: 'Server error fetching orders' })
  }
})

// Admin: Get all orders (with optional date filter)
router.get('/admin/all', async (req, res) => {
  try {
    const { date } = req.query
    let query = {}

    // If date is provided, filter by delivery date
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      
      // Filter by deliveryDate (stored as string)
      query.deliveryDate = date
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email mobile')
      .sort({ orderDate: -1 })
      .exec()

    res.json(orders)
  } catch (error) {
    console.error('Get all orders error:', error)
    res.status(500).json({ error: 'Server error fetching orders' })
  }
})

// Admin: Get order statistics for a date
router.get('/admin/stats', async (req, res) => {
  try {
    const { date } = req.query
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' })
    }

    const orders = await Order.find({ deliveryDate: date })
      .populate('userId', 'name email mobile')
      .exec()

    // Calculate statistics
    const totalOrders = orders.length
    const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0)
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    
    // Group by product
    const productStats = {}
    orders.forEach(order => {
      const productName = order.productName
      if (!productStats[productName]) {
        productStats[productName] = {
          name: productName,
          quantity: 0,
          orders: 0,
          revenue: 0
        }
      }
      productStats[productName].quantity += order.quantity
      productStats[productName].orders += 1
      productStats[productName].revenue += order.totalPrice
    })

    res.json({
      date,
      totalOrders,
      totalQuantity,
      totalRevenue,
      productStats: Object.values(productStats),
      orders
    })
  } catch (error) {
    console.error('Get order stats error:', error)
    res.status(500).json({ error: 'Server error fetching statistics' })
  }
})

// Get single order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ error: 'Server error fetching order' })
  }
})

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({
      message: 'Order status updated',
      order
    })
  } catch (error) {
    console.error('Update order error:', error)
    res.status(500).json({ error: 'Server error updating order' })
  }
})

module.exports = router

