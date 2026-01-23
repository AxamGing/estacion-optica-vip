const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
})

contentSchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model('Content', contentSchema)
