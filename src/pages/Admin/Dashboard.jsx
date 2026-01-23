import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    LogOut,
    Plus,
    Edit,
    Trash2,
    Upload,
    CheckCircle,
    XCircle,
    Image as ImageIcon
} from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [stats, setStats] = useState({ products: 0, orders: 0 })
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [notification, setNotification] = useState(null) // { type: 'success'|'error', message: '' }
    const [editingId, setEditingId] = useState(null)
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null })
    const [isLoading, setIsLoading] = useState(false)

    const resetForm = () => {
        setNewProduct({ name: '', category: 'monturas', price: '', description: '', stock: '', image: '' })
        setEditingId(null)
        setShowAddProduct(false)
    }

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'monturas',
        price: '',
        description: '',
        stock: '',
        image: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/admin/login')
            return
        }
        fetchProducts()
    }, [])

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    const showToast = (type, message) => {
        setNotification({ type, message })
    }

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products')
            setProducts(response.data)
            setStats({ ...stats, products: response.data.length })
        } catch (error) {
            console.error('Error fetching products:', error)
            showToast('error', 'Error al cargar productos')
        }
    }

    const processFile = (file) => {
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('error', 'La imagen es muy pesada (max 5MB)')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewProduct(prev => ({ ...prev, image: reader.result }))
                showToast('success', 'Imagen cargada correctamente')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageUpload = (e) => {
        processFile(e.target.files[0])
    }

    const handlePaste = (e) => {
        const items = e.clipboardData.items
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile()
                processFile(file)
                e.preventDefault()
                break
            }
        }
    }

    // ... (previous functions remain until handlePaste)

    const handleEditProduct = (product) => {
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description || '',
            stock: product.stock,
            image: (product.images && product.images[0]) ? product.images[0] : ''
        })
        setEditingId(product._id)
        setShowAddProduct(true)
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const token = localStorage.getItem('token')
            const payload = {
                ...newProduct,
                images: newProduct.image ? [newProduct.image] : []
            }

            if (editingId) {
                // Update existing
                await axios.put(`http://localhost:5000/api/products/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showToast('success', 'Producto actualizado')
            } else {
                // Create new
                await axios.post('http://localhost:5000/api/products', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showToast('success', 'Producto agregado')
            }

            resetForm()
            fetchProducts()
        } catch (error) {
            console.error('Error saving product:', error)
            const msg = error.response?.data?.message || 'Error al guardar producto'
            showToast('error', msg)
        } finally {
            setIsLoading(false)
        }
    }

    const confirmDelete = (id) => {
        setDeleteModal({ show: true, id })
    }

    const executeDelete = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:5000/api/products/${deleteModal.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchProducts()
            showToast('success', 'Producto eliminado')
        } catch (error) {
            console.error('Error deleting product:', error)
            showToast('error', 'Error al eliminar producto')
        } finally {
            setDeleteModal({ show: false, id: null })
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('admin')
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 transform transition-all duration-300 animate-soft ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    <p className="font-medium">{notification.message}</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-soft text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-eo-dark mb-2">¿Eliminar producto?</h3>
                        <p className="text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                className="flex-1 px-4 py-2 border-2 border-gray-200 text-eo-dark font-bold rounded-xl hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-eo-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">EO</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-eo-dark">Panel Admin</h1>
                                <p className="text-xs text-eo-secondary">Estación Óptica</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-eo-secondary hover:text-eo-primary transition"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Salir</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-eo-secondary font-medium">Total Productos</p>
                                <p className="text-3xl font-bold text-eo-dark mt-1">{stats.products}</p>
                            </div>
                            <div className="w-12 h-12 bg-eo-primary/10 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-eo-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-eo-secondary font-medium">Pedidos</p>
                                <p className="text-3xl font-bold text-eo-dark mt-1">{stats.orders}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-eo-secondary font-medium">Dashboard</p>
                                <p className="text-3xl font-bold text-eo-dark mt-1">✓</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-eo-dark">Gestión de Productos</h2>
                        <button
                            onClick={() => { resetForm(); setShowAddProduct(true) }}
                            className="flex items-center space-x-2 bg-eo-primary text-white px-4 py-2 rounded-xl hover:bg-eo-accent transition font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Agregar Producto</span>
                        </button>
                    </div>

                    <div className="p-6">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-eo-secondary">No hay productos aún</p>
                                <p className="text-sm text-gray-400 mt-1">Agrega tu primer producto para comenzar</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                                        {product.images && product.images[0] && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-bold text-eo-dark mb-1">{product.name}</h3>
                                            <p className="text-sm text-eo-secondary mb-2">{product.category}</p>
                                            <p className="text-xl font-bold text-eo-primary mb-3">${product.price}</p>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-eo-dark px-3 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    <span>Editar</span>
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(product._id)}
                                                    className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Eliminar</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-soft">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-eo-dark">
                                {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-eo-dark mb-2">Nombre del Producto</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-eo-primary focus:outline-none"
                                    placeholder="Ej: Ray-Ban Aviator"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-eo-dark mb-2">Categoría</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-eo-primary focus:outline-none"
                                    >
                                        <option value="monturas">Monturas</option>
                                        <option value="lentes">Lentes</option>
                                        <option value="accesorios">Accesorios</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-eo-dark mb-2">Precio ($)</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-eo-primary focus:outline-none"
                                        placeholder="45"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-eo-dark mb-2">Stock</label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-eo-primary focus:outline-none"
                                    placeholder="10"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-eo-dark mb-2">Descripción</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-eo-primary focus:outline-none"
                                    rows="3"
                                    placeholder="Descripción del producto..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-eo-dark mb-2">Imagen del Producto</label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-eo-primary transition cursor-pointer bg-gray-50 focus-within:border-eo-primary group"
                                    onPaste={handlePaste}
                                    tabIndex="0" // Make focusable to receive paste
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
                                        {newProduct.image ? (
                                            <div className="relative group/image">
                                                <img src={newProduct.image} alt="Preview" className="max-h-56 mx-auto rounded-lg shadow-md" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition rounded-lg flex items-center justify-center text-white font-medium">
                                                    Click o arrastra para cambiar
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="w-16 h-16 bg-eo-light rounded-full flex items-center justify-center mx-auto group-hover:bg-white transition duration-300 shadow-sm">
                                                    <ImageIcon className="w-8 h-8 text-eo-primary transform group-hover:scale-110 transition duration-300" />
                                                </div>
                                                <div>
                                                    <p className="text-eo-dark font-bold text-lg">Haz click o pega aquí</p>
                                                    <p className="text-eo-primary font-mono text-sm mt-1 bg-eo-primary/10 inline-block px-2 py-1 rounded">CTRL + V</p>
                                                </div>
                                                <p className="text-sm text-gray-400">Soporta PNG, JPG (Max 5MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-eo-dark font-bold rounded-xl hover:bg-gray-50 transition"
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-eo-primary text-white font-bold rounded-xl hover:bg-eo-accent transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span>{editingId ? 'Actualizar' : 'Guardando...'}</span>
                                        </span>
                                    ) : (editingId ? 'Actualizar Producto' : 'Agregar Producto')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
