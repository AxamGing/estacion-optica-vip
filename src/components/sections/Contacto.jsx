import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'

const Contacto = () => {
    return (
        <section id="contacto" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gray-100"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-eo-primary font-bold uppercase tracking-widest text-[10px]">
                        Atención al Cliente
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black mt-2 text-eo-dark uppercase tracking-tight">
                        Contacto y Ubicación
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10">

                    {/* WhatsApp Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center group border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6 transition duration-300 group-hover:bg-green-500">
                            <MessageCircle className="w-12 h-12 text-green-500 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 text-eo-dark">WhatsApp Directo</h3>
                        <p className="text-eo-secondary text-base mb-8 max-w-sm leading-relaxed">
                            Coordine su examen visual o consulte disponibilidad de monturas con nuestro equipo de atención.
                        </p>
                        <a
                            href="https://wa.me/584247448728"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white font-black rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 hover:shadow-green-500/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
                        >
                            <Phone className="w-5 h-5" /> ENVIAR MENSAJE
                        </a>
                    </motion.div>

                    {/* Right Column: Map + Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="space-y-6"
                    >
                        {/* Map Card */}
                        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-lg overflow-hidden">
                            <h3 className="text-base font-black mb-4 flex items-center text-eo-dark gap-3">
                                <MapPin className="w-5 h-5 text-eo-primary flex-shrink-0" />
                                Nuestra Sede en Maracay
                            </h3>
                            <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-gray-100">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.862878165775!2d-67.61096719999999!3d10.253444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e803da86c3c8fb3%3A0xd924856fb107cb7a!2zRXN0YWNpw7NuIMOTcHRpY2E!5e1!3m2!1ses-419!2sve!4v1766095961572!5m2!1ses-419!2sve"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Mapa Estación Óptica"
                                ></iframe>
                            </div>
                            <p className="text-eo-secondary text-xs italic text-center">
                                Av. Ayacucho con Calle Bolívar, Maracay, Edo. Aragua.
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-eo-primary font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Phone className="w-3 h-3" /> Teléfono
                                </p>
                                <p className="text-lg font-black text-eo-dark">+58 424-7448728</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-eo-primary font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> E-mail
                                </p>
                                <p className="text-sm font-black text-eo-dark break-all">estacionoptica22@gmail.com</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Contacto
