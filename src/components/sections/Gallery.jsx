import React from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'

const Gallery = () => {
    const products = [
        {
            id: 1,
            name: 'Turquesa Elegante',
            category: 'Línea Selecta',
            price: 45,
            image: 'https://m.media-amazon.com/images/I/51r2X7Wz2cL._AC_SL1200_.jpg',
        },
        {
            id: 2,
            name: 'Titanium Shadow',
            category: 'Diseño Urbano',
            price: 55,
            image: 'https://m.media-amazon.com/images/I/61j8Rj7dK5L._AC_SL1500_.jpg',
        },
        {
            id: 3,
            name: 'Retro Master',
            category: 'Clase Ejecutiva',
            price: 120,
            image: 'https://m.media-amazon.com/images/I/51XvLgE-kOL._AC_SL1001_.jpg',
        },
    ]

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
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-eo-light shadow-sm aspect-[4/5] border border-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="mt-4 flex justify-between items-end">
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-eo-secondary uppercase tracking-widest">
                                        {product.category}
                                    </p>
                                    <h3 className="text-lg font-bold text-eo-dark">{product.name}</h3>
                                </div>
                                <span className="text-eo-primary font-bold text-xl">${product.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <a
                        href="https://wa.me/584247448728"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-3 bg-eo-primary text-white text-sm font-bold rounded-xl shadow hover:bg-eo-secondary transition duration-300 uppercase tracking-widest"
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Ver Catálogo Completo
                    </a>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100"></div>
        </section>
    )
}

export default Gallery
