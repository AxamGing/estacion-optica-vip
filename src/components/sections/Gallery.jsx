import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Gallery = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await axios.get('/api/products?limit=3')
                setProducts(response.data)
            } catch (error) {
                console.error('Error fetching featured products:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchFeatured()
    }, [])

    return (
        <section id="galeria" className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gray-100"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="text-eo-primary font-bold uppercase tracking-widest text-[10px]">
                        Variedad y Estilo
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-eo-dark uppercase tracking-tight">
                        Catálogo de Monturas
                    </h2>
                </motion.div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {products.length === 0 ? (
                            <div className="col-span-full py-12 text-eo-secondary">
                                Agrega productos en el panel para verlos aquí
                            </div>
                        ) : (
                            products.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="relative overflow-hidden rounded-2xl bg-eo-light shadow-sm aspect-[4/5] border border-gray-100">
                                        {product.images && product.images[0] && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-between items-end">
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-eo-secondary uppercase tracking-widest">
                                                {product.category}
                                            </p>
                                            <h3 className="text-lg font-bold text-eo-dark truncate w-40">{product.name}</h3>
                                        </div>
                                        <span className="text-eo-primary font-bold text-xl">${product.price}</span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <Link
                        to="/catalogo"
                        className="inline-flex items-center justify-center px-8 py-3 bg-eo-primary text-white text-sm font-bold rounded-xl shadow hover:bg-eo-secondary transition duration-300 uppercase tracking-widest"
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Ver Catálogo Completo
                    </Link>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100"></div>
        </section>
    )
}

export default Gallery
