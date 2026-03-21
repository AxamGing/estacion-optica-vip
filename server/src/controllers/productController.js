const Product = require('../models/Product')
const palazzoProducts = require('../utils/seedData')

// @desc    Get all products with filtering and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, featured, gender, search, brand, sort } = req.query
        const filter = {}

        if (category) filter.category = category
        if (gender) filter.gender = gender
        if (featured) filter.featured = featured === 'true'
        if (brand) filter.brand = brand

        // Search Filter (Name, Brand or Description)
        if (search) {
            const searchRegex = new RegExp(search, 'i')
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { brand: searchRegex }
            ]
        }

        // Sorting
        let sortOption = { createdAt: -1 } // default: newest
        if (sort === 'views')      sortOption = { views: -1 }
        if (sort === 'name_asc')   sortOption = { name: 1 }
        if (sort === 'name_desc')  sortOption = { name: -1 }

        const products = await Product.find(filter).sort(sortOption)
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get trending products (most viewed)
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8
        const products = await Product.find({}).sort({ views: -1 }).limit(limit)
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get unique brands list
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand', { brand: { $ne: null, $ne: '' } })
        res.json(brands.filter(Boolean).sort())
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get single product (also increments view count)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        // Increment views atomically and return updated doc
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        )

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

// @desc    Upload product image (single)
// @route   POST /api/products/upload-image
// @access  Private (Admin)
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Por favor sube una imagen' });
        }
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Seed products (Palazzo Catalog)
// @route   POST /api/products/seed
// @access  Private (Admin)
const seedProducts = async (req, res) => {
    try {
        const result = await Product.insertMany(palazzoProducts)
        res.status(201).json({ message: `¡Semilla inyectada! ${result.length} modelos de Palazzo agregados.`, count: result.length })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Bulk Delete products
// @route   POST /api/products/bulk-delete
// @access  Private (Admin)
const bulkDeleteProducts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron IDs válidos para eliminar.' });
        }
        await Product.deleteMany({ _id: { $in: ids } });
        res.json({ message: `${ids.length} productos eliminados correctamente.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Delete ALL products
// @route   DELETE /api/products/all
// @access  Private (Admin)
const deleteAllProducts = async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        res.json({ message: `Catálogo completo eliminado. ${result.deletedCount} productos borrados.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Reset all product view counts to 0
// @route   POST /api/products/reset-views
// @access  Private (Admin)
const resetAllViews = async (req, res) => {
    try {
        await Product.updateMany({}, { $set: { views: 0 } });
        res.json({ message: 'Contador de vistas reiniciado para todos los productos.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
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
}
