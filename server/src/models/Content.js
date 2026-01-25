const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['hero', 'about', 'contact'],
        unique: true
    },
    hero: {
        title: { type: String, default: 'Expertos en Salud Visual' },
        subtitle: { type: String, default: 'Tu próxima montura perfecta te espera.' },
        image: { type: String, default: '' } // Base64 or URL
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Content', contentSchema)
