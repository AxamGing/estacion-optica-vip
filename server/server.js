require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/database')

// Import routes
const productRoutes = require('./src/routes/products')
const orderRoutes = require('./src/routes/orders')
const authRoutes = require('./src/routes/auth')
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Estación Óptica API is running' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!' })
})

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📡 API: http://localhost:${PORT}/api`)
})

module.exports = app
