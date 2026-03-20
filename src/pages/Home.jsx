import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import Gallery from '../components/sections/Gallery'
import Services from '../components/sections/Services'
import Nosotros from '../components/sections/Nosotros'
import Contacto from '../components/sections/Contacto'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductSection = ({ title, products, link }) => {
    if (!products || products.length === 0) return null
    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-6 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{title}</h2>
                        <p className="text-gray-500 font-medium mt-2">Nuestra curaduría exclusiva.</p>
                    </div>
                    <Link to={link} className="flex items-center gap-2 bg-gray-50 text-gray-900 px-6 py-3 rounded-full font-black hover:bg-eo-primary hover:text-white transition-all group">
                        Ver todo el Catálogo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 4).map(product => (
                        <Link key={product._id} to={`/producto/${product._id}`} className="bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
                            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 overflow-hidden">
                                {product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-700 ease-out drop-shadow-xl" />
                                ) : (
                                    <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Contenido Restringido</span>
                                )}
                                {product.brand && (
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase text-gray-900 shadow-sm border border-gray-100/50">
                                        {product.brand}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow bg-white border-t border-gray-50 relative">
                                <h3 className="font-black text-gray-900 text-xl mb-1 group-hover:text-eo-primary transition-colors truncate">{product.name}</h3>
                                <p className="text-sm font-semibold text-gray-400 capitalize tracking-wide mb-4">{product.category}</p>
                                <div className="mt-auto font-black text-2xl text-eo-primary">
                                    ${product.price > 0 ? product.price.toLocaleString() : 'ConSultar'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

const Home = () => {
    const [sections, setSections] = useState({
        damas: [],
        caballeros: [],
        recent: []
    })

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch in parallel
                const [damasRes, caballerosRes, recentRes] = await Promise.all([
                    axios.get('/api/products?gender=mujer'),
                    axios.get('/api/products?gender=hombre'),
                    axios.get('/api/products?limit=8') // Just taking recent ones
                ])

                setSections({
                    damas: damasRes.data,
                    caballeros: caballerosRes.data,
                    recent: recentRes.data
                })
            } catch (error) {
                console.error('Error fetching home data:', error)
            }
        }
        fetchHomeData()
    }, [])

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <Hero />
                <Gallery />

                {/* Dynamic Sections */}
                <ProductSection title="Colección Damas" products={sections.damas} link="/catalogo?gender=mujer" />
                <ProductSection title="Colección Caballeros" products={sections.caballeros} link="/catalogo?gender=hombre" />

                <Services />

                {/* Nosotros y Contacto recuperados del sitio original */}
                <Nosotros />
                <Contacto />
            </main>
            <Footer />
        </div>
    )
}

export default Home
