const express = require('express')
const router = express.Router()
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')
const { protect } = require('../middleware/auth')

// Public routes
router.get('/', getProducts)
router.get('/:id', getProductById)

// Protected routes (Admin only)
router.post('/', protect, createProduct)
router.put('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

module.exports = router
