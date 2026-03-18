const express = require('express')
const router = express.Router()
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController')
const { protect } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// Public routes
router.get('/', getProducts)
router.get('/:id', getProductById)

// Protected routes (Admin only)
router.post('/', protect, createProduct)
router.put('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)
router.post('/upload-image', protect, upload.single('image'), uploadImage)

module.exports = router
