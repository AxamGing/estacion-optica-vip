const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true
    },
    category: {
        type: String,
        enum: ['monturas', 'lentes', 'accesorios'],
        required: true
    },
    gender: {
        type: String,
        enum: ['hombre', 'mujer', 'unisex', 'ninos'],
        default: 'unisex'
    },
    price: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    images: [{
        type: String  // Base64 or URL
    }],
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    specifications: {
        material: String,
        color: String,
        size: String,
        brand: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// Update timestamp on save
// Update timestamp on save
productSchema.pre('save', function () {
    this.updatedAt = Date.now()
})

module.exports = mongoose.model('Product', productSchema)
