require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('./src/models/Admin')
const { MongoMemoryServer } = require('mongodb-memory-server')

const seedAdmin = async () => {
    try {
        let mongoUri = process.env.MONGODB_URI

        // Si estamos en desarrollo sin MongoDB Atlas, iniciamos el servidor en memoria para el seed tmb
        if (!mongoUri || mongoUri === 'mongodb://localhost:27017/estacion-optica') {
            console.log('Seed: Usando MongoDB en memoria...')
            const mongoServer = await MongoMemoryServer.create()
            mongoUri = mongoServer.getUri()
        }

        await mongoose.connect(mongoUri)
        console.log('Conectado a MongoDB para seeding...')

        const adminExists = await Admin.findOne({ email: 'admin@estacionoptica.com' })
        if (adminExists) {
            console.log('El admin ya existe.')
            process.exit(0)
        }

        await Admin.create({
            username: 'admin',
            email: 'admin@estacionoptica.com',
            password: 'admin123'
        })

        console.log('✅ Admin creado exitosamente: admin@estacionoptica.com / admin123')
        process.exit(0)
    } catch (error) {
        console.error('Error seeding admin:', error)
        process.exit(1)
    }
}

seedAdmin()
