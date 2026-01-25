const Product = require('../models/Product')

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, featured, gender, search, minPrice, maxPrice } = req.query
        const filter = {}

        if (category) filter.category = category
        if (gender) filter.gender = gender
        if (featured) filter.featured = featured === 'true'

        // Price Filter
        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = Number(minPrice)
            if (maxPrice) filter.price.$lte = Number(maxPrice)
        }

        // Search Filter (Name or Description)
        if (search) {
            const searchRegex = new RegExp(search, 'i')
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex }
            ]
        }

        const products = await Product.find(filter).sort({ createdAt: -1 })
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json(product)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json({ message: 'Producto eliminado' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
