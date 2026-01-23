import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import axios from 'axios'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Send default email with password
            const payload = {
                email: 'admin@estacionoptica.com',
                password: formData.password
            }
            const response = await axios.post('http://localhost:5000/api/auth/login', payload)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('admin', JSON.stringify(response.data))
            navigate('/admin/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-eo-primary to-eo-accent flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <span className="text-eo-primary font-bold text-3xl">EO</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Panel Administrativo</h1>
                    <p className="text-white/80">Estación Óptica</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-eo-dark mb-2">
                                Código de Acceso
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-eo-secondary w-5 h-5" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-eo-primary focus:outline-none transition"
                                    placeholder="Ingrese su clave maestra"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-eo-primary text-white font-bold py-3 rounded-xl hover:bg-eo-accent transition duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Verificando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-eo-secondary">
                        <p>Solo personal autorizado</p>
                    </div>
                </div>

                <p className="text-center text-white/60 text-xs mt-6">
                    © 2024 Estación Óptica - Desarrollado por Isaron Studio
                </p>
            </div>
        </div>
    )
}

export default Login
