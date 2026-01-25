import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import axios from 'axios'

const Hero = () => {
    const [content, setContent] = useState({
        title: 'Expertos en Salud Visual',
        subtitle: 'Tu próxima montura perfecta te espera. Estilo, calidad y la mejor atención visual, donde tú estés.',
        image: '' // Default will be handled by UI check or we keep the styling
    })

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/content/hero')
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
        fetchContent()
    }, [])

    return (
        <section id="inicio" className="relative min-h-screen flex items-center bg-animated-professional pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-eo-primary/10 px-4 py-2 rounded-full">
                            <Eye className="w-4 h-4 text-eo-primary" />
                            <span className="text-sm font-bold text-eo-primary uppercase tracking-wider">
                                Atención Especializada
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl lg:text-7xl font-bold text-eo-dark leading-tight">
                            {content.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg lg:text-xl text-eo-secondary font-medium leading-relaxed max-w-xl">
                            {content.subtitle}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center justify-center group"
                            >
                                <span>Solicitar Examen</span>
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="/catalogo"
                                className="btn-secondary inline-flex items-center justify-center"
                            >
                                Ver Monturas
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div>
                                <div className="text-3xl font-bold text-eo-primary">+10</div>
                                <div className="text-sm text-eo-secondary">Años de Experiencia</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-eo-primary">500+</div>
                                <div className="text-sm text-eo-secondary">Clientes Satisfechos</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-eo-primary">100%</div>
                                <div className="text-sm text-eo-secondary">Garantía</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {content.image ? (
                            <div className="relative z-10 p-4 rounded-3xl shadow-2xl bg-white/50 backdrop-blur-sm">
                                <img src={content.image} alt="Banner" className="rounded-2xl w-full h-auto object-cover max-h-[500px]" />
                            </div>
                        ) : (
                            <div className="relative z-10 glass-card p-8 rounded-3xl shadow-2xl">
                                <div className="aspect-square bg-gradient-to-br from-eo-primary/20 to-eo-accent/20 rounded-2xl flex items-center justify-center">
                                    <div className="w-32 h-32 bg-eo-primary rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-5xl">EO</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-eo-accent/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-eo-primary/20 rounded-full blur-2xl"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
