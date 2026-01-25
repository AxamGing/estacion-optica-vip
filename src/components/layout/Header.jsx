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
                            <div className="w-10 h-10 bg-eo-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">EO</span>
                            </div>
                            <span className="font-outfit font-bold text-xl text-eo-dark">
                                Estación Óptica
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="text-eo-secondary hover:text-eo-primary font-medium transition duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <a
                            href="https://wa.me/584247448728"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            Agendar Cita
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
                        <nav className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-eo-secondary hover:text-eo-primary font-medium transition duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block btn-primary text-center"
                            >
                                Agendar Cita
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
