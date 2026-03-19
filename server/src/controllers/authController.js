const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'estacion-optica-secret-key-2024', {
        expiresIn: '30d'
    })
}

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public (first admin only, then private)
const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Check if admin exists
        const adminExists = await Admin.findOne({ $or: [{ email }, { username }] })

        if (adminExists) {
            return res.status(400).json({ message: 'Admin ya existe' })
        }

        // Create admin
        const admin = await Admin.create({
            username,
            email,
            password
        })

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                token: generateToken(admin._id)
            })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { password } = req.body
        const MASTER_PASSWORD = '**********'
        const DEFAULT_EMAIL = 'admin@estacionoptica.com'

        // 1. Check for Master Password
        if (password === MASTER_PASSWORD) {
            let admin = await Admin.findOne({ email: DEFAULT_EMAIL })

            // If default admin doesn't exist, create it automatically
            if (!admin) {
                console.log('⚡ Creating default admin via Master Password...')
                admin = await Admin.create({
                    username: 'admin',
                    email: DEFAULT_EMAIL,
                    password: MASTER_PASSWORD // This will be hashed by the model
                })
            }

            // Always login if master password is correct
            return res.json({
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                token: generateToken(admin._id)
            })
        }

        // 2. Normal Login (Fallback)
        const { email } = req.body
        const admin = await Admin.findOne({ email })

        if (admin && (await admin.comparePassword(password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                token: generateToken(admin._id)
            })
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message })
    }
}

// @desc    Get admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.json(req.admin)
}

module.exports = {
    registerAdmin,
    loginAdmin,
    getMe
}
