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
    CheckCircle,
    XCircle,
    Image as ImageIcon,
    Palette,
    Download
} from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('products')
    const [products, setProducts] = useState([])
    const [stats, setStats] = useState({ products: 0, orders: 0 })
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [notification, setNotification] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null })
    const [isLoading, setIsLoading] = useState(false)

    // Product State Simplified
    const [newProduct, setNewProduct] = useState({
        name: '',
        brand: '',
        category: 'monturas',
        gender: 'unisex',
        price: 0,
        description: '',
        colors: [], // Array of { name: '', hex: '' }
        selectedFile: null,
        previewImage: ''
    })

    const [colorInput, setColorInput] = useState({ name: '', hex: '#000000' })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/admin/login')
            return
        }
        fetchProducts()
    }, [])

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
            const response = await axios.get('/api/products')
            setProducts(response.data)
            setStats(prev => ({ ...prev, products: response.data.length }))
        } catch (error) {
            console.error('Error fetching products:', error)
            showToast('error', 'Error al cargar productos')
        }
    }

    // Handle Image Selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('error', 'La imagen es muy pesada (max 5MB)')
                return
            }
            setNewProduct(prev => ({ ...prev, selectedFile: file }))
            
            // local preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewProduct(prev => ({ ...prev, previewImage: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const addColor = () => {
        if (!colorInput.name.trim()) return;
        setNewProduct(prev => ({
            ...prev,
            colors: [...prev.colors, { name: colorInput.name.trim(), hex: colorInput.hex }]
        }))
        setColorInput({ name: '', hex: '#000000' })
    }

    const removeColor = (indexToRemove) => {
        setNewProduct(prev => ({
            ...prev,
            colors: prev.colors.filter((_, index) => index !== indexToRemove)
        }))
    }

    const resetForm = () => {
        setNewProduct({
            name: '', brand: '', category: 'monturas', gender: 'unisex', 
            price: 0, description: '', colors: [], selectedFile: null, previewImage: ''
        })
        setColorInput({ name: '', hex: '#000000' })
        setEditingId(null)
        setShowAddProduct(false)
    }

    const handleEditProduct = (product) => {
        setNewProduct({
            name: product.name,
            brand: product.brand || '',
            category: product.category,
            gender: product.gender || 'unisex',
            price: product.price || 0,
            description: product.description || '',
            colors: product.colors || [],
            selectedFile: null,
            previewImage: (product.images && product.images[0]) ? product.images[0] : ''
        })
        setEditingId(product._id)
        setShowAddProduct(true)
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const token = localStorage.getItem('token')
            let imageUrlUrl = newProduct.previewImage // Default to existing preview (if editing and not changed)

            // If user selected a NEW file, upload it to Cloudinary first
            if (newProduct.selectedFile) {
                const formData = new FormData();
                formData.append('image', newProduct.selectedFile);

                const uploadRes = await axios.post('/api/products/upload-image', formData, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                imageUrlUrl = uploadRes.data.imageUrl;
            }

            const payload = {
                name: newProduct.name,
                brand: newProduct.brand,
                category: newProduct.category,
                gender: newProduct.gender,
                price: Number(newProduct.price),
                description: newProduct.description,
                colors: newProduct.colors,
                images: imageUrlUrl ? [imageUrlUrl] : []
            }

            if (editingId) {
                await axios.put(`/api/products/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showToast('success', 'Producto actualizado')
            } else {
                await axios.post('/api/products', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showToast('success', 'Producto agregado')
            }

            resetForm()
            fetchProducts()
        } catch (error) {
            console.error('Error saving product:', error)
            showToast('error', 'Error al guardar producto')
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
            await axios.delete(`/api/products/${deleteModal.id}`, {
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

    const exportCatalog = () => {
        const dataStr = JSON.stringify(products, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'estacion_optica_catalogo_respaldo.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showToast('success', 'Respaldo descargado');
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('admin')
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 relative pb-20">
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
                            <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 px-4 py-2 border-2 border-gray-200 text-eo-dark font-bold rounded-xl hover:bg-gray-50 transition">Cancelar</button>
                            <button onClick={executeDelete} className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">Eliminar</button>
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
                        <button onClick={handleLogout} className="flex items-center space-x-2 text-eo-secondary hover:text-eo-primary transition">
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
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-eo-dark flex items-center gap-2">
                            <LayoutDashboard className="text-eo-primary" />
                            Catálogo de Monturas
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={exportCatalog}
                                title="Descargar copia de seguridad"
                                className="flex items-center justify-center space-x-2 bg-gray-100 text-eo-dark px-4 py-2 rounded-xl hover:bg-gray-200 transition font-medium"
                            >
                                <Download className="w-5 h-5" />
                                <span className="hidden sm:inline">Exportar JSON</span>
                            </button>
                            <button
                                onClick={() => { resetForm(); setShowAddProduct(true) }}
                                className="flex items-center justify-center space-x-2 bg-eo-primary text-white px-4 py-2 rounded-xl hover:bg-eo-accent transition font-bold"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Nuevo Producto</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-0">
                        {products.length === 0 ? (
                            <div className="text-center py-16">
                                <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">El catálogo está vacío</h3>
                                <p className="text-gray-500 mt-2">Haz clic en "Nuevo Producto" para empezar</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-sm">
                                            <th className="p-4 font-semibold rounded-tl-xl border-b border-gray-100">Foto</th>
                                            <th className="p-4 font-semibold border-b border-gray-100">Nombre</th>
                                            <th className="p-4 font-semibold border-b border-gray-100">Marca / Cat</th>
                                            <th className="p-4 font-semibold border-b border-gray-100">Precio</th>
                                            <th className="p-4 font-semibold border-b border-gray-100">Colores</th>
                                            <th className="p-4 font-semibold rounded-tr-xl border-b border-gray-100 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition group">
                                                <td className="p-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="w-6 h-6 text-gray-300" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-eo-dark">{product.name}</td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {product.brand && <span className="font-semibold">{product.brand}</span>}
                                                    <br/>
                                                    <span className="capitalize">{product.category} • {product.gender}</span>
                                                </td>
                                                <td className="p-4 font-bold text-eo-primary">
                                                    ${product.price ? product.price.toLocaleString() : '0'}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex -space-x-1">
                                                        {product.colors?.map((c, i) => (
                                                            <div 
                                                                key={i} 
                                                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                                style={{ backgroundColor: c.hex }}
                                                                title={c.name}
                                                            />
                                                        ))}
                                                        {(!product.colors || product.colors.length === 0) && (
                                                            <span className="text-xs text-gray-400">Sin colores</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button onClick={() => handleEditProduct(product)} className="text-blue-600 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => confirmDelete(product._id)} className="text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Agregar/Editar Producto */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-soft">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-3xl">
                            <h2 className="text-2xl font-bold text-eo-dark flex items-center gap-2">
                                {editingId ? <Edit className="text-eo-primary"/> : <Plus className="text-eo-primary"/>}
                                {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition bg-white p-1 rounded-full shadow-sm">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="productForm" onSubmit={handleSaveProduct} className="grid md:grid-cols-2 gap-8">
                                
                                {/* COLUMNA IZQUIERDA: FOTO Y COLORES */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-eo-dark mb-2">Foto Principal</label>
                                        <div className="border-2 border-dashed border-eo-primary/30 rounded-2xl p-6 text-center hover:border-eo-primary hover:bg-eo-primary/5 transition cursor-pointer bg-gray-50 relative group h-64 flex flex-col items-center justify-center">
                                            <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            {newProduct.previewImage ? (
                                                <div className="relative w-full h-full">
                                                    <img src={newProduct.previewImage} className="w-full h-full object-contain rounded-xl" alt="Preview"/>
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white font-bold p-2 text-sm text-center">
                                                        Click para cambiar
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 text-eo-primary">
                                                        <ImageIcon className="w-8 h-8" />
                                                    </div>
                                                    <p className="font-bold text-eo-dark">Subir foto</p>
                                                    <p className="text-xs text-gray-500 mt-1">Soporta JPG, PNG o WEBP (Máx 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                        <label className="block text-sm font-bold text-eo-dark mb-3 flex items-center gap-2">
                                            <Palette className="w-4 h-4 text-eo-primary"/> Variantes de Color
                                        </label>
                                        
                                        {/* Color list */}
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            {newProduct.colors.map((color, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-white pl-2 pr-1 py-1 rounded-full shadow-sm border border-gray-100 text-sm font-medium">
                                                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }}></span>
                                                    <span>{color.name}</span>
                                                    <button type="button" onClick={() => removeColor(idx)} className="text-gray-400 hover:text-red-500 rounded-full p-1 transition">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {newProduct.colors.length === 0 && <span className="text-sm text-gray-400">Sin colores añadidos</span>}
                                        </div>

                                        {/* Add color input */}
                                        <div className="flex gap-2">
                                            <input type="color" value={colorInput.hex} onChange={e => setColorInput({...colorInput, hex: e.target.value})} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
                                            <input type="text" placeholder="Nombre del color (ej: Carey)" value={colorInput.name} onChange={e => setColorInput({...colorInput, name: e.target.value})} className="flex-1 px-3 py-2 border rounded-xl focus:border-eo-primary focus:outline-none text-sm" />
                                            <button type="button" onClick={addColor} className="bg-eo-dark text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-eo-primary transition">Add</button>
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA: DATOS DEL PRODUCTO */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-eo-dark mb-1">Nombre del Modelo</label>
                                        <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-eo-primary focus:bg-white focus:outline-none transition" placeholder="Ej: ALEJANDRO" required />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-eo-dark mb-1">Marca</label>
                                            <input type="text" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-eo-primary focus:bg-white focus:outline-none transition" placeholder="Ej: Palazzo" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-eo-dark mb-1">Precio Venta ($)</label>
                                            <input type="number" min="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-eo-primary focus:bg-white focus:outline-none transition text-eo-primary font-bold" placeholder="0" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-eo-dark mb-1">Público</label>
                                            <select value={newProduct.gender} onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-eo-primary focus:bg-white focus:outline-none transition">
                                                <option value="unisex">Unisex</option>
                                                <option value="hombre">Caballeros</option>
                                                <option value="mujer">Damas</option>
                                                <option value="ninos">Niños</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-eo-dark mb-1">Categoría</label>
                                            <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-eo-primary focus:bg-white focus:outline-none transition">
                                                <option value="monturas">Monturas</option>
                                                <option value="lentes">Lentes Sol</option>
                                                <option value="accesorios">Accesorios</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-eo-dark mb-1">Descripción / Notas (Opcional)</label>
                                        <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:border-eo-primary focus:bg-white focus:outline-none transition resize-none" rows="3" placeholder="Información adicional del producto..." />
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-3xl mt-auto">
                            <button type="button" onClick={resetForm} className="px-6 py-3 bg-white border border-gray-200 text-eo-dark rounded-xl font-bold hover:bg-gray-100 transition shadow-sm">Cancelar</button>
                            <button type="submit" form="productForm" disabled={isLoading} className="px-8 py-3 bg-eo-primary text-white rounded-xl font-bold hover:bg-eo-accent transition shadow-lg shadow-eo-primary/30 disabled:opacity-50 flex items-center gap-2">
                                {isLoading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Guardando...</>
                                ) : (
                                    <>Guardar Producto <CheckCircle className="w-5 h-5"/></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard



