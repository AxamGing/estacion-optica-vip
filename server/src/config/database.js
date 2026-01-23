const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

const connectDB = async () => {
    try {
        // Si hay una URI en .env, úsala (para producción)
        if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/estacion-optica') {
            const conn = await mongoose.connect(process.env.MONGODB_URI)
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
        } else {
            // Modo desarrollo: MongoDB en memoria (NO REQUIERE INSTALACIÓN)
            console.log('🚀 Iniciando MongoDB en memoria (modo desarrollo)...')
            mongoServer = await MongoMemoryServer.create()
            const mongoUri = mongoServer.getUri()

            const conn = await mongoose.connect(mongoUri)

            console.log(`✅ MongoDB en memoria conectado: ${conn.connection.host}`)
            console.log(`💡 Base de datos temporal - Los datos se borran al reiniciar`)
        }
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`)
        process.exit(1)
    }
}

// Cleanup on exit
process.on('SIGINT', async () => {
    if (mongoServer) {
        await mongoServer.stop()
    }
    process.exit(0)
})

module.exports = connectDB
