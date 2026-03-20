import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Search, Filter, X, ChevronRight, Tags, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SkeletonCard = () => (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 animate-pulse flex flex-col h-full">
        <div className="aspect-square bg-gray-100"></div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-6"></div>
            <div className="flex gap-2 mb-8">
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            </div>
            <div className="mt-auto h-8 bg-gray-200 rounded-full w-1/3"></div>
        </div>
    </div>
);

const Catalog = () => {
    const [products, setProducts] = useState([])
    const [filters, setFilters] = useState({
        search: '',
        gender: '',
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: ''
    })
    const [isLoading, setIsLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)
    // Extract unique brands for the filter dropdown
    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))]

    useEffect(() => {
        fetchProducts()
    }, [filters.gender, filters.category, filters.brand]) // Re-fetch on major filter changes

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.search) params.append('search', filters.search)
            if (filters.gender) params.append('gender', filters.gender)
            if (filters.category) params.append('category', filters.category)
            if (filters.brand) params.append('brand', filters.brand)
            if (filters.minPrice) params.append('minPrice', filters.minPrice)
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

            const response = await axios.get(`/api/products?${params.toString()}`)
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
        setFilters({ search: '', gender: '', category: '', brand: '', minPrice: '', maxPrice: '' })
    }

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow bg-gray-50 py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-eo-dark tracking-tight">Nuestro Catálogo</h1>
                            <p className="text-gray-500 mt-2">Encuentra la montura perfecta para tu estilo</p>
                        </div>

                        <div className="flex gap-2 md:hidden">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold p-3 rounded-xl shadow-lg hover:bg-eo-primary transition-colors"
                            >
                                <SlidersHorizontal size={20} /> Filtros Rápidos
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Sidebar Filters */}
                        <aside className={`lg:w-72 flex-shrink-0 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-extrabold text-xl text-eo-dark">Filtros</h3>
                                    {(filters.gender || filters.category || filters.search || filters.brand) && (
                                        <button onClick={clearFilters} className="text-sm font-bold text-red-500 hover:text-red-700 transition">
                                            Limpiar
                                        </button>
                                    )}
                                </div>

                                {/* Search */}
                                <form onSubmit={handleSearch} className="mb-8">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Buscar modelo..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-eo-primary outline-none transition font-medium"
                                        />
                                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                    </div>
                                </form>

                                {/* Categories */}
                                <div className="mb-8">
                                    <h4 className="font-bold mb-4 text-eo-dark flex items-center gap-2">Categoría</h4>
                                    <div className="space-y-3">
                                        {[
                                            { id: '', label: 'Todas las categorías' },
                                            { id: 'monturas', label: 'Monturas Oftálmicas' },
                                            { id: 'lentes', label: 'Lentes de Sol' },
                                        ].map(c => (
                                            <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${filters.category === c.id ? 'border-eo-primary' : 'border-gray-300 group-hover:border-eo-primary'}`}>
                                                    {filters.category === c.id && <div className="w-2.5 h-2.5 bg-eo-primary rounded-full" />}
                                                </div>
                                                <span className={`font-medium ${filters.category === c.id ? 'text-eo-primary' : 'text-gray-600'}`}>{c.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="mb-8">
                                    <h4 className="font-bold mb-4 text-eo-dark flex items-center gap-2">Público</h4>
                                    <div className="space-y-3">
                                        {[
                                            { id: '', label: 'Todos' },
                                            { id: 'hombre', label: 'Caballeros' },
                                            { id: 'mujer', label: 'Damas' },
                                            { id: 'ninos', label: 'Niños' },
                                            { id: 'unisex', label: 'Unisex' }
                                        ].map(g => (
                                            <label key={g.id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${filters.gender === g.id ? 'border-eo-primary' : 'border-gray-300 group-hover:border-eo-primary'}`}>
                                                    {filters.gender === g.id && <div className="w-2.5 h-2.5 bg-eo-primary rounded-full" />}
                                                </div>
                                                <span className={`font-medium capitalize ${filters.gender === g.id ? 'text-eo-primary' : 'text-gray-600'}`}>{g.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-8">
                                    <h4 className="font-bold mb-4 text-eo-dark flex items-center gap-2">Rango de Precio</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                                            <input 
                                                type="number" 
                                                placeholder="Min" 
                                                value={filters.minPrice}
                                                onChange={(e) => setFilters(prev => ({...prev, minPrice: e.target.value}))}
                                                className="w-full pl-8 pr-2 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-eo-primary outline-none font-bold text-sm"
                                            />
                                        </div>
                                        <span className="text-gray-400 font-bold">-</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                                            <input 
                                                type="number" 
                                                placeholder="Max" 
                                                value={filters.maxPrice}
                                                onChange={(e) => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
                                                className="w-full pl-8 pr-2 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-eo-primary outline-none font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={fetchProducts}
                                        className="w-full mt-3 bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-eo-primary transition shadow-md"
                                    >
                                        Aplicar Rango
                                    </button>
                                </div>

                                {/* Brands (Dynamic if available) */}
                                {uniqueBrands.length > 0 && (
                                    <div>
                                        <h4 className="font-bold mb-4 text-eo-dark flex items-center gap-2">Marca</h4>
                                        <select 
                                            value={filters.brand} 
                                            onChange={(e) => setFilters(prev => ({...prev, brand: e.target.value}))}
                                            className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-eo-primary outline-none font-medium"
                                        >
                                            <option value="">Todas las marcas</option>
                                            {uniqueBrands.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Product Grid Area */}
                        <div className="flex-1">
                            {/* Summary bar */}
                            {!isLoading && (
                                <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
                                    <p>Mostrando <span className="font-bold text-eo-dark">{products.length}</span> modelos</p>
                                </div>
                            )}

                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-eo-dark mb-2">No se encontraron resultados</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8">No tenemos monturas que coincidan con los filtros seleccionados actualmente.</p>
                                    <button onClick={clearFilters} className="px-6 py-3 bg-eo-primary text-white font-bold rounded-xl hover:bg-eo-accent transition shadow-lg shadow-eo-primary/30">
                                        Ver todo el catálogo
                                    </button>
                                </div>
                            ) : (
                                <motion.div 
                                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: { transition: { staggerChildren: 0.1 } }
                                    }}
                                >
                                    {products.map(product => (
                                        <motion.div
                                            key={product._id}
                                            variants={{
                                                hidden: { opacity: 0, y: 30 },
                                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                                            }}
                                        >
                                            <Link 
                                                to={`/producto/${product._id}`}
                                                className="bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full transform hover:-translate-y-2"
                                            >
                                                {/* Image Container */}
                                                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center p-8">
                                                    {product.images && product.images[0] ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain group-hover:scale-110 transition duration-700 ease-out drop-shadow-xl"
                                                        />
                                                    ) : (
                                                        <div className="text-gray-300 font-black tracking-widest uppercase text-xs">Sin Foto</div>
                                                    )}
                                                    
                                                    {/* Brand Tag overlay */}
                                                    {product.brand && (
                                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase text-gray-900 shadow-sm border border-gray-100/50 flex items-center gap-1">
                                                            <Tags size={12}/> {product.brand}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="p-6 flex flex-col flex-grow border-t border-gray-50">
                                                    <div className="mb-2">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-eo-secondary bg-eo-secondary/10 px-2 py-1 rounded-md">
                                                            {product.gender === 'ninos' ? 'Niños' : product.gender === 'hombre' ? 'Caballeros' : product.gender === 'mujer' ? 'Damas' : 'Unisex'}
                                                        </span>
                                                    </div>
                                                    
                                                    <h3 className="font-extrabold text-2xl text-eo-dark mb-1 group-hover:text-eo-primary transition line-clamp-1">{product.name}</h3>
                                                    
                                                    {/* Colors visual display */}
                                                    <div className="mt-3 flex items-center gap-2">
                                                        {product.colors && product.colors.length > 0 ? (
                                                            <div className="flex -space-x-1.5">
                                                                {product.colors.slice(0, 5).map((color, i) => (
                                                                    <div 
                                                                        key={i} 
                                                                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100"
                                                                        style={{ backgroundColor: color.hex }}
                                                                        title={color.name}
                                                                    />
                                                                ))}
                                                                {product.colors.length > 5 && (
                                                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 z-10">
                                                                        +{product.colors.length - 5}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">Variantes no especificadas</span>
                                                        )}
                                                    </div>

                                                    <div className="mt-auto pt-8 flex justify-between items-end">
                                                        <div>
                                                            <span className="text-sm text-gray-500 font-medium block">Precio Mercado</span>
                                                            {product.price > 0 ? (
                                                                <span className="text-3xl font-black text-eo-dark">${product.price.toLocaleString()}</span>
                                                            ) : (
                                                                <span className="text-xl font-bold text-white bg-eo-primary px-3 py-1 rounded-lg">Consultar</span>
                                                            )}
                                                        </div>
                                                        <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-eo-primary group-hover:text-white text-eo-dark flex items-center justify-center transition shadow-sm">
                                                            <ChevronRight size={24} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
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
