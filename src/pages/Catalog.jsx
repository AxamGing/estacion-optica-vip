import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Search, X, ChevronRight, SlidersHorizontal, LayoutGrid, List, Flame, Eye, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SkeletonCard = () => (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 animate-pulse flex flex-col h-full">
        <div className="aspect-square bg-gray-100" />
        <div className="p-5 flex flex-col flex-grow gap-3">
            <div className="h-3 bg-gray-200 rounded-full w-1/4" />
            <div className="h-5 bg-gray-200 rounded-full w-3/4" />
            <div className="flex gap-2 mt-2"><div className="w-5 h-5 rounded-full bg-gray-200" /><div className="w-5 h-5 rounded-full bg-gray-200" /><div className="w-5 h-5 rounded-full bg-gray-200" /></div>
        </div>
    </div>
)

const genderLabel = (g) => ({ hombre: 'Caballeros', mujer: 'Damas', ninos: 'Niños', unisex: 'Unisex' }[g] || g)

const Catalog = () => {
    const [products, setProducts] = useState([])
    const [trending, setTrending] = useState([])
    const [brands, setBrands] = useState([])
    const [filters, setFilters] = useState({ search: '', gender: '', category: '', brand: '', sort: 'newest' })
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => { fetchAll() }, [])
    useEffect(() => { fetchProducts() }, [filters.gender, filters.category, filters.brand, filters.sort])

    const fetchAll = async () => {
        try {
            const [bRes, tRes] = await Promise.all([
                axios.get('/api/products/brands'),
                axios.get('/api/products/trending?limit=4')
            ])
            setBrands(bRes.data)
            setTrending(tRes.data)
        } catch {}
        fetchProducts()
    }

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.search) params.append('search', filters.search)
            if (filters.gender) params.append('gender', filters.gender)
            if (filters.category) params.append('category', filters.category)
            if (filters.brand) params.append('brand', filters.brand)
            if (filters.sort) params.append('sort', filters.sort)
            const response = await axios.get(`/api/products?${params.toString()}`)
            setProducts(response.data)
        } catch { console.error('Error fetching catalog') }
        finally { setIsLoading(false) }
    }

    const handleSearch = (e) => { e.preventDefault(); fetchProducts() }
    const clearFilters = () => setFilters({ search: '', gender: '', category: '', brand: '', sort: 'newest' })
    const hasActiveFilters = filters.gender || filters.category || filters.brand || filters.search

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow bg-gray-50 py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Nuestro Catálogo</h1>
                            <p className="text-gray-500 mt-1.5 font-medium">Encuentra la montura perfecta para tu estilo</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-gray-900 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-blue-600 transition lg:hidden">
                                <SlidersHorizontal size={18} /> Filtros
                            </button>
                            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl border-2 transition ${viewMode === 'grid' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'}`}><LayoutGrid size={18} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl border-2 transition ${viewMode === 'list' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'}`}><List size={18} /></button>
                        </div>
                    </div>

                    {/* Trending Banner */}
                    {trending.length > 0 && (
                        <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-5 md:p-6 text-white shadow-xl shadow-orange-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Flame size={22} className="flex-shrink-0" />
                                <h2 className="font-black text-lg">Lo Más Visto esta semana</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {trending.map(p => (
                                    <Link key={p._id} to={`/producto/${p._id}`} className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-2xl p-3 flex items-center gap-3 transition group">
                                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-contain p-1" alt="" /> : <span className="text-gray-300 text-xs">—</span>}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-sm truncate">{p.name}</p>
                                            <p className="text-orange-100 text-xs flex items-center gap-1"><Eye size={10} />{p.views || 0} vistas</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-black text-gray-900">Filtros</h3>
                                    {hasActiveFilters && <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-700 transition">Limpiar</button>}
                                </div>

                                {/* Search */}
                                <form onSubmit={handleSearch}>
                                    <div className="relative">
                                        <input type="text" placeholder="Buscar modelo..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition font-medium text-sm" />
                                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                                    </div>
                                </form>

                                {/* Sort */}
                                <div>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Ordenar por</h4>
                                    <div className="space-y-1">
                                        {[{ id: 'newest', label: '⭐ Más recientes' }, { id: 'views', label: '🔥 Más vistos' }, { id: 'name_asc', label: 'A → Z' }, { id: 'name_desc', label: 'Z → A' }].map(o => (
                                            <button key={o.id} onClick={() => setFilters(p => ({ ...p, sort: o.id }))} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition ${filters.sort === o.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}>{o.label}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Categoría</h4>
                                    <div className="space-y-2">
                                        {[{ id: '', label: 'Todas' }, { id: 'monturas', label: 'Monturas Ópticas' }, { id: 'lentes', label: 'Lentes de Sol' }, { id: 'accesorios', label: 'Accesorios' }].map(c => (
                                            <label key={c.id} onClick={() => setFilters(p => ({ ...p, category: c.id }))} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${filters.category === c.id ? 'border-blue-500' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                                    {filters.category === c.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                                </div>
                                                <span className={`text-sm font-medium ${filters.category === c.id ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{c.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Público</h4>
                                    <div className="space-y-2">
                                        {[{ id: '', label: 'Todos' }, { id: 'hombre', label: 'Caballeros' }, { id: 'mujer', label: 'Damas' }, { id: 'ninos', label: 'Niños' }, { id: 'unisex', label: 'Unisex' }].map(g => (
                                            <label key={g.id} onClick={() => setFilters(p => ({ ...p, gender: g.id }))} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${filters.gender === g.id ? 'border-blue-500' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                                    {filters.gender === g.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                                </div>
                                                <span className={`text-sm font-medium ${filters.gender === g.id ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{g.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Brands as chips */}
                                {brands.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Marca</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={() => setFilters(p => ({ ...p, brand: '' }))} className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition ${!filters.brand ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400'}`}>Todas</button>
                                            {brands.map(b => (
                                                <button key={b} onClick={() => setFilters(p => ({ ...p, brand: p.brand === b ? '' : b }))} className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition ${filters.brand === b ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400'}`}>{b}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {!isLoading && (
                                <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-500">
                                    <p>Mostrando <span className="font-black text-gray-900">{products.length}</span> modelos</p>
                                    {hasActiveFilters && <button onClick={clearFilters} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-bold transition"><X size={14} /> Limpiar filtros</button>}
                                </div>
                            )}

                            {isLoading ? (
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-900 mb-2">Sin resultados</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">No encontramos monturas con esos filtros.</p>
                                    <button onClick={clearFilters} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg">Ver todo el catálogo</button>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
                                    {products.map(p => (
                                        <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }}>
                                            <Link to={`/producto/${p._id}`} className="bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full hover:-translate-y-2">
                                                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center p-6">
                                                    {p.images?.[0] ? (
                                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-700 ease-out drop-shadow-xl" />
                                                    ) : (
                                                        <div className="text-gray-300 font-black tracking-widest uppercase text-xs">Sin Foto</div>
                                                    )}
                                                    {p.brand && <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-black text-gray-900 shadow-sm border border-gray-100/50">{p.brand}</div>}
                                                    {p.tags?.includes('nuevo') && <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded-xl">NUEVO</div>}
                                                    {p.tags?.includes('tendencia') && !p.tags?.includes('nuevo') && <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-xl flex items-center gap-1"><Flame size={10} />HOT</div>}
                                                </div>
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg capitalize">{genderLabel(p.gender)}</span>
                                                        {p.frameShape && <span className="text-xs text-gray-400 font-semibold">{p.frameShape}</span>}
                                                    </div>
                                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition mb-2 line-clamp-1">{p.name}</h3>
                                                    <div className="flex items-center gap-1.5 mt-1 mb-4">
                                                        {p.colors?.slice(0, 5).map((c, i) => <div key={i} title={c.name} className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: c.hex }} />)}
                                                        {p.colors?.length > 5 && <span className="text-xs text-gray-400 font-bold">+{p.colors.length - 5}</span>}
                                                        {(!p.colors || p.colors.length === 0) && <span className="text-xs text-gray-400">Sin variantes de color</span>}
                                                    </div>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">Consultar</span>
                                                        <div className="w-9 h-9 rounded-full bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-gray-400 flex items-center justify-center transition shadow-sm"><ChevronRight size={18} /></div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                // LIST VIEW
                                <div className="flex flex-col gap-4">
                                    {products.map(p => (
                                        <Link key={p._id} to={`/producto/${p._id}`} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-blue-200 transition group flex items-center gap-5 p-4">
                                            <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                                                {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-contain p-2 group-hover:scale-105 transition" alt="" /> : <span className="text-gray-300 text-xs">—</span>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    {p.brand && <span className="text-xs font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{p.brand}</span>}
                                                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg capitalize">{p.category}</span>
                                                    {p.tags?.map(t => <span key={t} className="text-xs bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-lg capitalize">{t}</span>)}
                                                </div>
                                                <h3 className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition truncate">{p.name}</h3>
                                                {p.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1 font-medium">{p.description}</p>}
                                                <div className="flex items-center gap-2 mt-2">
                                                    {p.colors?.slice(0, 6).map((c, i) => <div key={i} title={c.name} className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: c.hex }} />)}
                                                    {p.colors?.length > 6 && <span className="text-xs text-gray-400">+{p.colors.length - 6} más</span>}
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                                <span className="text-xs font-bold flex items-center gap-1 text-gray-400"><Eye size={12} />{p.views || 0}</span>
                                                <span className="text-sm font-black bg-blue-600 text-white px-4 py-2 rounded-xl group-hover:bg-blue-700 transition">Ver detalles</span>
                                            </div>
                                        </Link>
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
