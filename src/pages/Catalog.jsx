import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import axios from 'axios'
import { Search, Filter, X } from 'lucide-react'

const Catalog = () => {
    const [products, setProducts] = useState([])
    const [filters, setFilters] = useState({
        search: '',
        gender: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    })
    const [isLoading, setIsLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [filters.gender, filters.category]) // Re-fetch on major filter changes

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.search) params.append('search', filters.search)
            if (filters.gender) params.append('gender', filters.gender)
            if (filters.category) params.append('category', filters.category)
            if (filters.minPrice) params.append('minPrice', filters.minPrice)
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

            const response = await axios.get(`http://localhost:5000/api/products?${params.toString()}`)
            setProducts(response.data)
        } catch (error) {
            console.error('Error fetching catalog:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchProducts()
    }

    const clearFilters = () => {
        setFilters({ search: '', gender: '', category: '', minPrice: '', maxPrice: '' })
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Bar: Title & Mobile Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-eo-dark">Catálogo Completo</h1>

                        <div className="flex gap-2 md:hidden">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white p-2 border rounded-lg shadow-sm"
                            >
                                <Filter size={20} /> Filtros
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className={`md:w-64 space-y-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Filtros</h3>
                                    {(filters.gender || filters.category || filters.search) && (
                                        <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">
                                            Limpiar
                                        </button>
                                    )}
                                </div>

                                {/* Search Input */}
                                <form onSubmit={handleSearch} className="mb-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-eo-primary/20 focus:border-eo-primary outline-none"
                                        />
                                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    </div>
                                </form>

                                {/* Gender Filter */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-eo-secondary">Género</h4>
                                    <div className="space-y-2">
                                        {['hombre', 'mujer', 'ninos', 'unisex'].map(g => (
                                            <label key={g} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    checked={filters.gender === g}
                                                    onChange={() => setFilters(prev => ({ ...prev, gender: g }))}
                                                    className="accent-eo-primary"
                                                />
                                                <span className="capitalize">{g === 'ninos' ? 'Niños' : g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-eo-secondary">Categoría</h4>
                                    <div className="space-y-2">
                                        {['monturas', 'lentes', 'accesorios'].map(c => (
                                            <label key={c} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={filters.category === c}
                                                    onChange={() => setFilters(prev => ({ ...prev, category: c }))}
                                                    className="accent-eo-primary"
                                                />
                                                <span className="capitalize">{c}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-12 h-12 border-4 border-eo-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-500">Cargando productos...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <p className="text-xl font-medium text-gray-600">No encontramos productos con esos filtros</p>
                                    <button onClick={clearFilters} className="mt-4 text-eo-primary font-bold hover:underline">
                                        Ver todo el catálogo
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <div key={product._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                                            <div className="relative h-64 bg-gray-100 overflow-hidden">
                                                {product.images && product.images[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        Sin imagen
                                                    </div>
                                                )}
                                                {product.price < 50 && (
                                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        OFERTA
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-eo-secondary capitalize mb-1">{product.category} • {product.gender}</p>
                                                <h3 className="font-bold text-lg text-eo-dark mb-2">{product.name}</h3>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xl font-bold text-eo-primary">${product.price}</span>
                                                    <button className="bg-eo-dark text-white p-2 rounded-full hover:bg-eo-primary transition">
                                                        <Search size={18} />
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
            </main>
            <Footer />
        </div>
    )
}

export default Catalog
