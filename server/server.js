const app = require('./app')

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`🚀 Server running localmente on port ${PORT}`)
    console.log(`📡 Local API: http://localhost:${PORT}/api`)
})
