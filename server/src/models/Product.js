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
    description: {
        type: String,
        trim: true
    },
    // Material and frame shape — quick fields
    material: {
        type: String,
        trim: true
    },
    frameShape: {
        type: String,
        trim: true
        // e.g.: "Rectangular", "Redondo", "Aviador", "Cat-Eye", "Cuadrado"
    },
    // Colors array — basic name + hex
    colors: [{
        name: String,   // e.g., "Marrón Carey"
        hex: String     // e.g., "#8b4513"
    }],
    // General images (fallback / main gallery)
    images: [{
        type: String  // URL from Cloudinary
    }],
    // Color-specific image galleries
    colorImages: [{
        colorName: { type: String },
        colorHex:  { type: String, default: '#000000' },
        images:    [{ type: String }]  // array of Cloudinary URLs
    }],
    // Key-value specifications table
    // e.g. { "Material": "Acetato", "Largo del brazo": "140mm" }
    specifications: {
        type: Map,
        of: String
    },
    // Tags for filtering and highlighting
    tags: [{
        type: String,
        enum: ['nuevo', 'tendencia', 'premium', 'oferta', 'exclusivo', 'limitado']
    }],
    // View counter — incremented every time the detail page is accessed
    views: {
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
