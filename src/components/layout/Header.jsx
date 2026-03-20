import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { to: '/', label: 'Inicio' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/catalogo?category=monturas', label: 'Monturas' },
        { to: '/#nosotros', label: 'Nosotros' }, // Anchors on home require hashed routing or scroll handling, but for now strict links
        { to: '/#contacto', label: 'Contacto' },
    ]

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'
                    }`}>
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <img src="/logo.jpg" alt="Estación Óptica Logo" className="w-12 h-12 object-contain rounded-lg" />
                            <span className="font-outfit font-bold text-xl text-eo-dark">
                                Estación Óptica
                            </span>
                        </Link>
                    </div>

                    {/* Center Navigation */}
                    <nav className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="group relative font-bold text-gray-600 hover:text-gray-900 transition-colors duration-300"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-eo-primary to-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="https://wa.me/584247448728"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-900 text-white font-black px-6 py-2.5 rounded-full hover:bg-eo-primary hover:shadow-lg hover:shadow-eo-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Hablar con Asesor
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-eo-dark"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100"
                    >
                        <nav className="px-6 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block font-bold text-lg text-gray-700 hover:text-eo-primary hover:pl-2 transition-all duration-200 border-b border-gray-50 pb-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-gray-900 text-white font-black py-4 rounded-xl text-center mt-6 hover:bg-eo-primary transition-colors"
                            >
                                Hablar con Asesor
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
