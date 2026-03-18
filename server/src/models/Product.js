const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true
    },
    brand: {
        type: String,
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
        default: 0,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    colors: [{
        name: String,   // i.e., "Marrón Carey"
        hex: String     // i.e., "#8b4513"
    }],
    images: [{
        type: String  // URL from Cloudinary
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
productSchema.pre('save', function () {
    this.updatedAt = Date.now()
})

module.exports = mongoose.model('Product', productSchema)
