const express = require('express')
const router = express.Router()
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder
} = require('../controllers/orderController')
const { protect } = require('../middleware/auth')

// Public route
router.post('/', createOrder)

// Protected routes (Admin only)
router.get('/', protect, getOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id', protect, updateOrder)

module.exports = router
