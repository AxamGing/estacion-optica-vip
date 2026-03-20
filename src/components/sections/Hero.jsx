import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import axios from 'axios'

const Hero = () => {
    const [content, setContent] = useState({
        title: 'Expertos en Salud Visual',
        subtitle: 'Tu próxima montura perfecta te espera. Estilo, calidad y la mejor atención visual, donde tú estés.',
        image: ''
    })
    const [latestProduct, setLatestProduct] = useState(null)

    useEffect(() => {
        // Fetch CMS hero content
        const fetchContent = async () => {
            try {
                const response = await axios.get('/api/content/hero')
                if (response.data && response.data.hero) {
                    setContent({
                        title: response.data.hero.title || content.title,
                        subtitle: response.data.hero.subtitle || content.subtitle,
                        image: response.data.hero.image || ''
                    })
                }
            } catch (error) {
                console.error('Error fetching hero content:', error)
            }
        }

        // Fetch the most recently added product for the visual side
        const fetchLatestProduct = async () => {
            try {
                const response = await axios.get('/api/products?limit=1&sort=-createdAt')
                if (response.data && response.data.length > 0) {
                    setLatestProduct(response.data[0])
                }
            } catch (error) {
                console.error('Error fetching latest product:', error)
            }
        }

        fetchContent()
        fetchLatestProduct()
    }, [])

    // Determine what image to show on the right side
    const heroImage = content.image || (latestProduct?.images?.[0]) || null

    return (
        <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
            {/* Background Orbs */}
            <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-eo-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-eo-primary/8 rounded-full blur-[120px] -z-10"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* ── Left: Content ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-8"
                    >
                        {/* Live badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center space-x-2 bg-eo-primary/10 border border-eo-primary/20 px-4 py-2 rounded-full"
                        >
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eo-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-eo-primary"></span>
                            </span>
                            <span className="text-xs font-black text-eo-primary tracking-widest uppercase">
                                Atención Especializada
                            </span>
                        </motion.div>

                        {/* Main Heading — brand blue */}
                        <h1 className="text-5xl lg:text-6xl font-black text-eo-primary leading-[1.1] tracking-tight">
                            {content.title}
                        </h1>

                        {/* Subtitle — brand blue */}
                        <p className="text-lg text-eo-primary/80 font-medium leading-relaxed max-w-lg">
                            {content.subtitle}
                        </p>

                        {/* CTAs — with original labels */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-eo-primary text-white px-8 py-4 rounded-xl font-black hover:bg-eo-accent hover:shadow-xl hover:shadow-eo-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                            >
                                SOLICITAR EXAMEN
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="/catalogo"
                                className="border-2 border-eo-primary text-eo-primary px-8 py-4 rounded-xl font-black hover:bg-eo-primary hover:text-white transition-all duration-300 flex items-center justify-center"
                            >
                                VER MONTURAS
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Latest product image (dynamic) ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, type: 'spring', bounce: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        {/* Tilted background card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-eo-primary/10 to-eo-primary/5 rounded-[3rem] transform rotate-3 scale-105 -z-10 shadow-xl border border-eo-primary/10"></div>

                        {heroImage ? (
                            <div className="relative w-full h-[580px] bg-white rounded-[3rem] shadow-2xl overflow-hidden z-10 flex items-center justify-center p-10 border border-gray-50">
                                <img
                                    src={heroImage}
                                    alt={latestProduct?.name || 'Última Colección'}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                                {/* Product name tag */}
                                {latestProduct && (
                                    <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md border border-eo-primary/10 rounded-2xl px-5 py-4 shadow-lg">
                                        <p className="text-[10px] font-black text-eo-primary uppercase tracking-widest mb-1">Última Incorporación</p>
                                        <p className="text-eo-dark font-black text-lg leading-tight truncate">{latestProduct.name}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Fallback placeholder while loading */
                            <div className="w-full h-[580px] bg-eo-primary/5 rounded-[3rem] shadow-2xl z-10 relative flex flex-col items-center justify-center border border-eo-primary/10 gap-4">
                                <div className="w-20 h-20 bg-eo-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                    <Eye className="w-10 h-10 text-eo-primary" />
                                </div>
                                <p className="text-eo-primary/50 font-bold text-sm tracking-widest uppercase">Cargando colección...</p>
                            </div>
                        )}

                        {/* Floating badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-eo-primary/10 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-eo-primary/10 rounded-full flex items-center justify-center">
                                <Eye className="text-eo-primary w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Cuidado Visual</p>
                                <p className="text-eo-dark font-black">Certificado</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
