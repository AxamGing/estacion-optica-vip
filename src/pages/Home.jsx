import React, { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import Gallery from '../components/sections/Gallery'
import Services from '../components/sections/Services'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductSection = ({ title, products, link }) => {
    if (!products || products.length === 0) return null
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-bold text-eo-dark">{title}</h2>
                    <Link to={link} className="flex items-center gap-2 text-eo-primary font-bold hover:underline">
                        Ver todo <ArrowRight size={20} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map(product => (
                        <div key={product._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                            <div className="h-64 bg-gray-100 relative overflow-hidden">
                                {product.images[0] && (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                )}
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-gray-500 mb-1 capitalize">{product.category}</p>
                                <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
                                <p className="text-xl font-bold text-eo-primary">${product.price}</p>
                            </div>
                        </div>
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
                    axios.get('http://localhost:5000/api/products?gender=mujer'),
                    axios.get('http://localhost:5000/api/products?gender=hombre'),
                    axios.get('http://localhost:5000/api/products?limit=8') // Just taking recent ones
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
            </main>
            <Footer />
        </div>
    )
}

export default Home
