import React from 'react'
import { Instagram, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-eo-dark text-white py-16 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <img src="/logo.jpg" alt="Logo" className="w-12 h-12 object-contain rounded-lg" />
                        <p className="text-white/50 text-xs leading-relaxed">
                            Comprometidos con la salud visual de nuestros pacientes en Maracay,
                            brindando atención de calidad y monturas de alta gama.
                        </p>
                        <div className="flex space-x-3">
                            <a
                                href="https://www.instagram.com/estacion_optica_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center hover:scale-110 transition duration-300 shadow-lg"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} className="text-white" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@estacion_opticavenezuela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-black flex items-center justify-center hover:scale-110 transition duration-300 shadow-lg border border-gray-800"
                                aria-label="TikTok"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </a>
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center hover:scale-110 transition duration-300 shadow-lg"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle size={20} className="text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h5 className="text-eo-primary font-bold uppercase tracking-widest text-[10px] mb-6">
                            Navegación
                        </h5>
                        <ul className="space-y-3 text-xs">
                            <li>
                                <Link to="/" className="text-white/50 hover:text-white transition duration-200">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/catalogo" className="text-white/50 hover:text-white transition duration-200">
                                    Colección de Lentes
                                </Link>
                            </li>
                            <li>
                                <Link to="/nosotros" className="text-white/50 hover:text-white transition duration-200">
                                    Sobre Nosotros
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h5 className="text-eo-primary font-bold uppercase tracking-widest text-[10px] mb-6">
                            Contacto
                        </h5>
                        <ul className="space-y-3 text-xs text-white/50">
                            <li>Maracay, Aragua</li>
                            <li>+58 424-7448728</li>
                            <li>estacionoptica22@gmail.com</li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h5 className="text-eo-primary font-bold uppercase tracking-widest text-[10px] mb-6">
                            Información
                        </h5>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <span className="text-[9px] font-bold uppercase text-eo-primary">
                                Isaron Certified Asset
                            </span>
                            <div className="mt-1 text-[10px] text-white/40">
                                Versión 3.0 - Enterprise Edition
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-[9px] font-medium text-white/30 uppercase tracking-widest">
                        © {currentYear} Estación Óptica. Todos los derechos reservados.
                    </div>
                    <div className="text-[9px] font-bold text-eo-primary uppercase tracking-widest">
                        Desarrollado por Isaron Studio
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
