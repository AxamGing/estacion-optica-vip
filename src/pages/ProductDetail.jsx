import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ArrowLeft, ChevronRight, ChevronLeft, ShieldCheck, Truck, MessageCircle, Eye, Flame, Tag, Layers, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_NUMBER = '584247448728'

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [trending, setTrending] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [mainImage, setMainImage] = useState('')
    const [allImages, setAllImages] = useState([])
    const [selectedColor, setSelectedColor] = useState(null)
    const [imgIndex, setImgIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
    const imgRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchData()
    }, [id])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [prodRes, trendRes] = await Promise.all([
                axios.get(`/api/products/${id}`),
                axios.get('/api/products/trending?limit=4')
            ])
            const p = prodRes.data
            setProduct(p)
            const imgs = p.images && p.images.length > 0 ? p.images : []
            setAllImages(imgs)
            setMainImage(imgs[0] || '')
            setImgIndex(0)
            setSelectedColor(null)
            setTrending(trendRes.data.filter(t => t._id !== p._id))
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const selectColor = (color, colorIdx) => {
        setSelectedColor(color)
        const ci = product.colorImages?.find(c => c.colorName === color.name)
        if (ci && ci.images && ci.images.length > 0) {
            setAllImages(ci.images)
            setMainImage(ci.images[0])
            setImgIndex(0)
        } else {
            const fallback = product.images || []
            setAllImages(fallback)
            setMainImage(fallback[0] || '')
            setImgIndex(0)
        }
    }

    const goNext = () => {
        const next = (imgIndex + 1) % allImages.length
        setImgIndex(next)
        setMainImage(allImages[next])
    }

    const goPrev = () => {
        const prev = (imgIndex - 1 + allImages.length) % allImages.length
        setImgIndex(prev)
        setMainImage(allImages[prev])
    }

    const handleMouseMove = (e) => {
        if (!imgRef.current) return
        const { left, top, width, height } = imgRef.current.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setZoomPos({ x, y })
    }

    const buildWhatsAppMsg = () => {
        let msg = `Hola, estoy interesado en el modelo *${product.name}*`
        if (product.brand) msg += ` de la marca *${product.brand}*`
        if (selectedColor) msg += ` en color *${selectedColor.name}*`
        msg += `. ¿Me pueden dar más información?`
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    }

    const genderLabel = (g) => ({ hombre: 'Caballeros', mujer: 'Damas', ninos: 'Niños', unisex: 'Unisex' }[g] || g)

    if (isLoading) return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-14 h-14 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold animate-pulse">Cargando producto...</p>
                </div>
            </main>
            <Footer />
        </div>
    )

    if (!product) return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow bg-gray-50 flex items-center justify-center p-8">
                <div className="text-center bg-white p-12 rounded-3xl shadow border border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">Producto no encontrado</h2>
                    <Link to="/catalogo" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-2"><ArrowLeft size={18} /> Volver al catálogo</Link>
                </div>
            </main>
            <Footer />
        </div>
    )

    const specs = product.specifications ? Object.entries(product.specifications) : []

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow bg-gray-50 pb-16">

                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                        <nav className="flex text-xs font-semibold text-gray-400 gap-2 items-center flex-wrap">
                            <Link to="/" className="hover:text-blue-600 transition">Inicio</Link>
                            <ChevronRight size={14} />
                            <Link to="/catalogo" className="hover:text-blue-600 transition">Catálogo</Link>
                            <ChevronRight size={14} />
                            <Link to={`/catalogo?category=${product.category}`} className="hover:text-blue-600 transition capitalize">{product.category}</Link>
                            <ChevronRight size={14} />
                            <span className="text-gray-700 font-bold truncate max-w-[200px]">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                    {/* Main Grid */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 mb-16">

                        {/* ── IMAGE GALLERY ── */}
                        <div className="p-6 md:p-10 flex flex-col gap-4 bg-gray-50/50">
                            {/* Main Image with zoom */}
                            <div
                                ref={imgRef}
                                className="relative rounded-3xl overflow-hidden bg-white aspect-square border border-gray-100 shadow-sm cursor-zoom-in"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {product.brand && (
                                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-black tracking-wider text-gray-900 shadow-sm border border-gray-100">{product.brand}</div>
                                )}
                                {product.tags?.includes('nuevo') && <div className="absolute top-4 right-4 z-10 bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow">NUEVO</div>}
                                {product.tags?.includes('tendencia') && !product.tags?.includes('nuevo') && <div className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow flex items-center gap-1"><Flame size={12} /> TENDENCIA</div>}

                                {mainImage ? (
                                    <div className="w-full h-full relative overflow-hidden">
                                        <img
                                            src={mainImage}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-6 transition-transform duration-200"
                                            style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: 'scale(2)' } : {}}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200 font-black uppercase tracking-widest text-sm">Sin Imagen</div>
                                )}

                                {/* Prev / Next arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition z-10"><ChevronLeft size={18} /></button>
                                        <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition z-10"><ChevronRight size={18} /></button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {allImages.map((img, i) => (
                                        <button key={i} onClick={() => { setMainImage(img); setImgIndex(i); }} className={`w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition bg-white ${imgIndex === i ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100 hover:border-gray-300'}`}>
                                            <img src={img} alt="" className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* View count badge */}
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                                <Eye size={14} /> {product.views || 0} personas vieron este producto
                            </div>
                        </div>

                        {/* ── PRODUCT INFO ── */}
                        <div className="p-6 md:p-10 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100">
                            {/* Category + Gender */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg capitalize">{product.category}</span>
                                <span className="text-xs font-black uppercase tracking-wide bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">{genderLabel(product.gender)}</span>
                                {product.frameShape && <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg">{product.frameShape}</span>}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h1>
                            {product.brand && <p className="text-gray-400 font-bold text-sm mb-6">por {product.brand}</p>}

                            {/* Description */}
                            {product.description && (
                                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                                    <p className="text-gray-600 text-sm leading-relaxed font-medium">{product.description}</p>
                                </div>
                            )}

                            {/* Material */}
                            {product.material && (
                                <div className="flex items-center gap-2 mb-6 text-sm">
                                    <Layers size={16} className="text-gray-400" />
                                    <span className="font-semibold text-gray-500">Material:</span>
                                    <span className="font-black text-gray-800">{product.material}</span>
                                </div>
                            )}

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        Color disponible
                                        {selectedColor && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg font-bold normal-case tracking-normal">{selectedColor.name}</span>}
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {product.colors.map((color, i) => (
                                            <button key={i} onClick={() => selectColor(color, i)}
                                                className={`flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition font-bold text-sm ${selectedColor?.name === color.name ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'}`}>
                                                <div className="w-5 h-5 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: color.hex }} />
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Specs table */}
                            {specs.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Info size={12} /> Especificaciones</h3>
                                    <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                        {specs.map(([k, v], i) => (
                                            <div key={i} className={`flex items-center px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <span className="font-black text-gray-600 w-40 flex-shrink-0">{k}</span>
                                                <span className="text-gray-800 font-medium">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {product.tags.map(t => (
                                        <span key={t} className="flex items-center gap-1 text-xs font-black bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl capitalize"><Tag size={11} />{t}</span>
                                    ))}
                                </div>
                            )}

                            {/* Trust badges */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="flex items-center gap-2.5 bg-green-50 text-green-700 p-3 rounded-2xl text-xs font-bold"><ShieldCheck size={18} className="text-green-600 flex-shrink-0" /> Calidad Garantizada</div>
                                <div className="flex items-center gap-2.5 bg-blue-50 text-blue-700 p-3 rounded-2xl text-xs font-bold"><Truck size={18} className="text-blue-600 flex-shrink-0" /> Envíos a Domicilio</div>
                            </div>

                            {/* WhatsApp CTA */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                {selectedColor ? null : (
                                    product.colors && product.colors.length > 0 &&
                                    <p className="text-xs text-center text-gray-400 font-semibold mb-3">Selecciona un color para incluirlo en tu consulta</p>
                                )}
                                <a href={buildWhatsAppMsg()} target="_blank" rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#1ebc5a] text-white font-black text-lg rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
                                    <MessageCircle size={24} />
                                    Consultar por WhatsApp
                                </a>
                                <p className="text-center text-xs text-gray-400 font-semibold mt-3 uppercase tracking-widest">Nuestros asesores te atenderán</p>
                            </div>
                        </div>
                    </div>

                    {/* ── TRENDING SECTION ── */}
                    {trending.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3"><Flame className="text-orange-500" size={28} /> Lo Más Visto</h2>
                                    <p className="text-gray-500 font-medium mt-1 text-sm">Los productos que más enamoran a nuestros clientes</p>
                                </div>
                                <Link to="/catalogo" className="hidden md:flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-2xl font-bold text-sm hover:border-blue-400 hover:text-blue-600 transition shadow-sm">
                                    Ver catálogo completo <ChevronRight size={18} />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {trending.map((rec, i) => (
                                    <motion.div key={rec._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                        <Link to={`/producto/${rec._id}`} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group h-full">
                                            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 overflow-hidden">
                                                {rec.images?.[0] ? (
                                                    <img src={rec.images[0]} alt={rec.name} className="w-full h-full object-contain group-hover:scale-105 transition duration-500 drop-shadow-xl" />
                                                ) : (
                                                    <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Sin Imagen</span>
                                                )}
                                                {rec.brand && <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-black text-gray-800 shadow-sm">{rec.brand}</div>}
                                                <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-xl text-xs font-black flex items-center gap-1"><Eye size={10} />{rec.views || 0}</div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="font-black text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition">{rec.name}</h3>
                                                <p className="text-xs text-gray-400 font-semibold capitalize mb-4">{rec.category} · {genderLabel(rec.gender)}</p>
                                                {rec.colors && rec.colors.length > 0 && (
                                                    <div className="flex gap-1.5 mt-auto">
                                                        {rec.colors.slice(0, 5).map((c, ci) => <div key={ci} title={c.name} className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: c.hex }} />)}
                                                        {rec.colors.length > 5 && <span className="text-xs text-gray-400 font-bold">+{rec.colors.length - 5}</span>}
                                                    </div>
                                                )}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-xs font-black bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl">Ver detalles</span>
                                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default ProductDetail
