const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'estacion-optica-secret-key-2024')

            // Get admin from token
            req.admin = await Admin.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.error(error)
            res.status(401).json({ message: 'No autorizado, token inválido' })
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' })
    }
}

const admin = (req, res, next) => {
    if (req.admin) {
        next()
    } else {
        res.status(401).json({ message: 'No autorizado como administrador' })
    }
}

module.exports = { protect, admin }
