require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/database')

// Import routes
const productRoutes = require('./src/routes/products')
const orderRoutes = require('./src/routes/orders')
const authRoutes = require('./src/routes/auth')
const contentRoutes = require('./src/routes/contentRoutes')
const Admin = require('./src/models/Admin')

// Initialize app
const app = express()

// Connect to database
connectDB()

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Estación Óptica API is running' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!' })
})

// (Server listener removed for Netlify Functions, moved to server.js)
module.exports = app
