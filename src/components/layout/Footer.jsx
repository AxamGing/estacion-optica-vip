import React from 'react'
import { Instagram, MessageCircle } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-eo-dark text-white py-16 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-eo-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">EO</span>
                        </div>
                        <p className="text-white/50 text-xs leading-relaxed">
                            Comprometidos con la salud visual de nuestros pacientes en Maracay,
                            brindando atención de calidad y monturas de alta gama.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.instagram.com/estacion_optica_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-eo-primary transition duration-300"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-eo-primary transition duration-300"
                            >
                                <MessageCircle size={16} />
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
                                <a href="#inicio" className="text-white/50 hover:text-white transition duration-200">
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a href="#servicios" className="text-white/50 hover:text-white transition duration-200">
                                    Servicios
                                </a>
                            </li>
                            <li>
                                <a href="#galeria" className="text-white/50 hover:text-white transition duration-200">
                                    Monturas
                                </a>
                            </li>
                            <li>
                                <a href="#nosotros" className="text-white/50 hover:text-white transition duration-200">
                                    Sobre Nosotros
                                </a>
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
