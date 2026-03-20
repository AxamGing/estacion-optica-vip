import React from 'react'
import { motion } from 'framer-motion'
import { Award, Clock, ShieldCheck } from 'lucide-react'

const features = [
    {
        icon: Award,
        title: 'Calidad Profesional',
        description: 'Atención seria y responsable enfocada en su bienestar visual.',
    },
    {
        icon: Clock,
        title: 'Eficiencia y Puntualidad',
        description: 'Respetamos su tiempo con citas programadas y entregas a término.',
    },
    {
        icon: ShieldCheck,
        title: 'Garantía Asegurada',
        description: 'Garantizamos la calidad y durabilidad de cada montura con atención personalizada incluida.',
    },
]

const Nosotros = () => {
    return (
        <section id="nosotros" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-eo-primary font-bold uppercase tracking-widest text-[10px]">
                                Sobre Nosotros
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-black mt-2 text-eo-dark uppercase tracking-tight leading-tight">
                                Compromiso con su Salud Visual
                            </h2>
                        </div>

                        <p className="text-lg text-eo-secondary leading-relaxed">
                            En Estación Óptica nos dedicamos a brindar soluciones visuales integrales. Combinamos el 
                            profesionalismo clínico con la conveniencia de la atención personalizada a domicilio.
                        </p>

                        <div className="space-y-6">
                            {features.map((feat, i) => {
                                const Icon = feat.icon
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15 }}
                                        className="flex items-start gap-5"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-eo-primary/10 flex items-center justify-center text-eo-primary flex-shrink-0 transition duration-300 hover:bg-eo-primary hover:text-white">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-eo-dark">{feat.title}</h4>
                                            <p className="text-sm text-eo-secondary mt-0.5">{feat.description}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="pt-2">
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-black rounded-full shadow-lg hover:bg-eo-primary hover:shadow-eo-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                HABLAR CON UN ESPECIALISTA
                            </a>
                        </div>
                    </motion.div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-eo-primary/5 to-blue-100/30 rounded-[3rem] transform rotate-3"></div>
                        <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <img
                                src="/logo.jpg"
                                alt="Estación Óptica"
                                className="w-full h-auto rounded-2xl bg-gray-50 p-12"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/500x400/106AA5/ffffff?text=Estación+Óptica'
                                }}
                            />
                            {/* Stats overlay */}
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-eo-primary/10 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-eo-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900">100%</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Garantía</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}

export default Nosotros
