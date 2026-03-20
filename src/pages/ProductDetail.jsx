import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { ArrowLeft, ChevronRight, CheckCircle, ShieldCheck, Truck, Tags, Search, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [recommended, setRecommended] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [mainImage, setMainImage] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchProductData()
    }, [id])

    const fetchProductData = async () => {
        setIsLoading(true)
        try {
            // Fetch main product
            const res = await axios.get(`/api/products/${id}`)
            setProduct(res.data)
            if (res.data.images && res.data.images.length > 0) {
                setMainImage(res.data.images[0])
            }

            // Fetch recommended (same gender or category)
            const recRes = await axios.get(`/api/products?category=${res.data.category}&limit=4`)
            // Filter out the current product from recommendations
            const filteredRec = recRes.data.filter(p => p._id !== res.data._id).slice(0, 4)
            setRecommended(filteredRec)
        } catch (error) {
            console.error('Error fetching product details:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col font-sans">
                <Header />
                <main className="flex-grow bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin w-16 h-16 border-4 border-gray-200 border-t-eo-primary rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-500 font-medium text-lg animate-pulse">Cargando producto...</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col font-sans">
                <Header />
                <main className="flex-grow bg-gray-50 flex items-center justify-center">
                    <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-eo-dark mb-4">Producto no encontrado</h2>
                        <Link to="/catalogo" className="text-eo-primary font-bold hover:underline inline-flex items-center gap-2">
                            <ArrowLeft size={20} /> Volver al catálogo
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow bg-gray-50 pb-16">
                
                {/* Breadcrumbs */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex text-sm font-medium text-gray-500 gap-2 items-center">
                            <Link to="/" className="hover:text-eo-primary transition">Inicio</Link>
                            <ChevronRight size={16} />
                            <Link to={`/catalogo?category=${product.category}`} className="hover:text-eo-primary transition capitalize">{product.category}</Link>
                            <ChevronRight size={16} />
                            <span className="text-eo-dark truncate">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    {/* Product Main Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row mb-12">
                        
                        {/* Left: Images */}
                        <div className="lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col">
                            <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-3xl mb-6 relative aspect-square p-8">
                                {product.brand && (
                                    <div className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-sm font-black tracking-wide text-eo-dark shadow-sm border border-gray-100 z-10">
                                        {product.brand}
                                    </div>
                                )}
                                {mainImage ? (
                                    <img 
                                        src={mainImage} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-gray-300 font-bold uppercase tracking-widest flex flex-col items-center gap-4">
                                        <Search size={48} />
                                        <span>Sin Imagen</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Thumbnails (If we add multiple images later) */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`w-24 h-24 rounded-2xl border-2 flex-shrink-0 bg-gray-50 overflow-hidden transition ${mainImage === img ? 'border-eo-primary ring-2 ring-eo-primary/20' : 'border-transparent hover:border-gray-300'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100">
                            
                            <div className="mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-eo-secondary bg-eo-secondary/10 px-3 py-1.5 rounded-lg inline-block">
                                    {product.gender === 'ninos' ? 'Niños' : product.gender === 'hombre' ? 'Caballeros' : product.gender === 'mujer' ? 'Damas' : 'Unisex'}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-eo-dark mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="mb-8">
                                {product.price > 0 ? (
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl md:text-5xl font-black text-eo-primary">${product.price.toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <span className="inline-block bg-eo-primary text-white text-xl font-bold px-6 py-3 rounded-2xl shadow-lg shadow-eo-primary/30">
                                        Consultar Precio
                                    </span>
                                )}
                            </div>

                            {/* Colors Section */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        Variantes de Color <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{product.colors.length}</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white border-2 border-gray-100 hover:border-eo-primary pr-4 pl-2 py-2 rounded-full cursor-pointer transition shadow-sm group">
                                                <div className="w-8 h-8 rounded-full shadow-inner border border-gray-200 group-hover:scale-110 transition" style={{ backgroundColor: color.hex }}></div>
                                                <span className="font-bold text-eo-dark text-sm">{color.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="mb-10 text-gray-600 leading-relaxed font-medium bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    {product.description}
                                </div>
                            )}

                            {/* Trust badges */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-green-50 text-green-700 p-3 rounded-xl">
                                    <ShieldCheck className="text-green-600" size={20} />
                                    Calidad Garantizada
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-blue-50 text-blue-700 p-3 rounded-xl">
                                    <Truck className="text-blue-600" size={20} />
                                    Envíos a Domicilio
                                </div>
                            </div>

                            {/* Contact Action */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <a 
                                    href={`https://wa.me/584241234567?text=Hola,%20estoy%20interesado%20en%20el%20modelo%20${product.name}%20${product.brand ? `de la marca ${product.brand}` : ''}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-3 py-5 bg-eo-dark text-white font-black text-xl rounded-2xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    ¡Me interesa! Contactar por WhatsApp
                                </a>
                                <p className="text-center text-xs text-gray-400 font-bold mt-4 uppercase tracking-widest">Atención personalizada y segura</p>
                            </div>

                        </div>
                    </div>

                    {/* Mejorada Sección de Recomendaciones Brutales */}
                    {recommended.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }} 
                            transition={{ duration: 0.6 }}
                            className="mt-24 pt-12 border-t border-gray-100"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                        <Zap className="text-eo-primary" size={32} /> 
                                        Piezas Similares Premium
                                    </h2>
                                    <p className="text-gray-500 font-medium mt-2">Continuando en la misma línea de excelencia y estilo.</p>
                                </div>
                                <Link to="/catalogo" className="bg-white border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-2xl font-black hover:border-eo-primary hover:text-eo-primary transition-all flex items-center gap-2 shadow-sm">
                                    Explorar Colección <ArrowLeft className="rotate-180" size={20} />
                                </Link>
                            </div>
                            
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1 } }
                                }}
                            >
                                {recommended.map(rec => (
                                    <motion.div 
                                        key={rec._id} 
                                        variants={{
                                            hidden: { opacity: 0, scale: 0.9 },
                                            visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
                                        }}
                                    >
                                        <Link to={`/producto/${rec._id}`} className="bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
                                            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 overflow-hidden">
                                                {rec.images && rec.images[0] ? (
                                                    <img src={rec.images[0]} alt={rec.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-700 ease-out drop-shadow-xl" />
                                                ) : (
                                                    <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Contenido Restringido</span>
                                                )}
                                                {rec.brand && (
                                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase text-gray-900 shadow-sm border border-gray-100/50">
                                                        {rec.brand}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow bg-white border-t border-gray-50 relative">
                                                <div className="absolute -top-6 right-6 bg-eo-dark text-white w-12 h-12 flex items-center justify-center rounded-full shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                    <Search size={20} />
                                                </div>
                                                <h3 className="font-black text-gray-900 text-xl mb-1 group-hover:text-eo-primary transition-colors">{rec.name}</h3>
                                                <p className="text-sm font-semibold text-gray-400 capitalize tracking-wide mb-4">{rec.category} • {rec.gender}</p>
                                                <div className="mt-auto font-black text-2xl text-eo-primary">
                                                    ${rec.price > 0 ? rec.price.toLocaleString() : 'ConSultar'}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default ProductDetail
