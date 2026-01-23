const Order = require('../models/Order')

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = async (req, res) => {
    try {
        const { status } = req.query
        const filter = {}

        if (status) filter.status = status

        const orders = await Order.find(filter)
            .populate('items.product')
            .sort({ createdAt: -1 })

        res.json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Admin)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product')

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' })
        }

        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Create order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body)
        res.status(201).json(order)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('items.product')

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' })
        }

        res.json(order)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder
}
