const express = require('express')
const router = express.Router()
const {
    getProducts,
    getTrendingProducts,
    getBrands,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    seedProducts,
    bulkDeleteProducts,
    deleteAllProducts,
    resetAllViews
} = require('../controllers/productController')
const { protect } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/trending', getTrendingProducts)   // MUST come before /:id
router.get('/brands', getBrands)               // MUST come before /:id
router.get('/', getProducts)
router.get('/:id', getProductById)             // also increments views

// ─── Protected routes (Admin only) ───────────────────────────────────────────
router.post('/', protect, createProduct)
router.put('/:id', protect, updateProduct)
router.delete('/all', protect, deleteAllProducts)   // MUST come before /:id delete
router.delete('/:id', protect, deleteProduct)
router.post('/upload-image', protect, upload.single('image'), uploadImage)
router.post('/seed', protect, seedProducts)
router.post('/bulk-delete', protect, bulkDeleteProducts)
router.post('/reset-views', protect, resetAllViews)

module.exports = router
