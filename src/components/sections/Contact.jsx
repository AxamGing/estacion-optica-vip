import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, MapPin, Phone } from 'lucide-react'

const Contact = () => {
    return (
        <section id="contacto" className="py-24 bg-white text-eo-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gray-100"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-eo-primary font-bold uppercase tracking-widest text-[10px]">
                        Atención al Cliente
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-eo-dark uppercase tracking-tight">
                        Contacto y Ubicación
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* WhatsApp Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-10 rounded-2xl flex flex-col justify-center items-center text-center group border border-gray-100"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 transition duration-300 group-hover:bg-green-500 group-hover:text-white">
                            <MessageCircle className="w-10 h-10 text-green-500 group-hover:text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-eo-dark">WhatsApp Directo</h3>
                        <p className="text-eo-secondary text-base mb-8 max-w-sm">
                            Coordine su examen visual o consulte disponibilidad de monturas con nuestro equipo de atención.
                        </p>
                        <a
                            href="https://wa.me/584247448728"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white text-base font-bold rounded-xl shadow-md hover:bg-green-600 transition duration-300 w-full sm:w-auto"
                        >
                            <Phone className="w-5 h-5 mr-3" />
                            ENVIAR MENSAJE
                        </a>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Location/Map */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6 rounded-2xl border border-gray-100"
                        >
                            <h3 className="text-lg font-bold mb-4 flex items-center text-eo-dark">
                                <MapPin className="w-5 h-5 mr-3 text-eo-primary" />
                                Nuestra Sede en Maracay
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-gray-100">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.862878165775!2d-67.61096719999999!3d10.253444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e803da86c3c8fb3%3A0xd924856fb107cb7a!2zRXN0YWNpw7NuIMOTcHRpY2E!5e1!3m2!1ses-419!2sve!4v1766095961572!5m2!1ses-419!2sve"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Ubicación Estación Óptica"
                                ></iframe>
                            </div>
                            <p className="text-eo-secondary text-xs italic text-center">
                                Av. Ayacucho con Calle Bolívar, Maracay, Edo. Aragua.
                            </p>
                        </motion.div>

                        {/* Info Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="grid sm:grid-cols-2 gap-4"
                        >
                            <div className="glass-card p-5 rounded-xl border border-gray-100">
                                <h4 className="text-eo-primary font-bold text-[10px] uppercase tracking-widest mb-1">
                                    Teléfono
                                </h4>
                                <p className="text-lg font-bold text-eo-dark">+58 424-7448728</p>
                            </div>
                            <div className="glass-card p-5 rounded-xl border border-gray-100">
                                <h4 className="text-eo-primary font-bold text-[10px] uppercase tracking-widest mb-1">
                                    E-mail
                                </h4>
                                <p className="text-sm font-bold text-eo-dark break-all">
                                    estacionoptica22@gmail.com
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
