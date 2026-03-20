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
        fetchContent()
    }, [])

    return (
        <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
            {/* Background Orbs */}
            <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-eo-primary/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center space-x-2 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-full"
                        >
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eo-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-eo-primary"></span>
                            </span>
                            <span className="text-xs font-black text-gray-800 tracking-widest uppercase">
                                Visión de Alto Nivel
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <div className="space-y-2">
                            <h1 className="text-5xl lg:text-7xl font-black text-eo-dark leading-[1.1] tracking-tight">
                                {content.title}
                            </h1>
                            <div className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-eo-primary to-blue-500 leading-tight pb-2">
                                Redefinida.
                            </div>
                        </div>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
                            {content.subtitle}
                        </p>

                        {/* CTAs */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <a
                                href="/catalogo"
                                className="bg-gray-900 text-white px-8 py-4 rounded-full font-black hover:bg-eo-primary hover:shadow-xl hover:shadow-eo-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center group"
                            >
                                <span>Explorar Colección</span>
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </a>
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-full font-black hover:border-gray-900 transition-all duration-300 flex items-center justify-center shadow-sm"
                            >
                                Asesoría Express
                            </a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-3 gap-8 pt-10 border-t border-gray-100/50 mt-10"
                        >
                            <div>
                                <div className="text-3xl font-black text-gray-900">+10</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Años Exp.</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-900">500+</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Pacientes</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-eo-primary">100%</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Garantía</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Visual Right Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-white rounded-[3rem] transform rotate-3 scale-105 -z-10 shadow-xl border border-white"></div>
                        
                        {content.image ? (
                            <img src={content.image} alt="Colección Premium" className="w-full h-[600px] object-cover rounded-[3rem] shadow-2xl z-10 relative" />
                        ) : (
                            <div className="w-full h-[600px] bg-gray-50 rounded-[3rem] shadow-2xl z-10 relative flex items-center justify-center border border-gray-100 overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-90"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-left">
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white font-black text-sm uppercase tracking-widest inline-block mb-3 border border-white/20">Nueva Era</div>
                                    <h3 className="text-white text-4xl font-black leading-tight">Cristales de Alta<br/>Tecnología</h3>
                                </div>
                            </div>
                        )}

                        {/* Floating Glassmorphism Badge */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute -left-10 top-1/2 bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white flex items-center gap-4 animate-bounce-slow"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Eye className="text-green-600 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Cuidado Visual</p>
                                <p className="text-gray-900 font-black">Certificado</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
