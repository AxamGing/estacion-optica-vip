import React from 'react'
import { motion } from 'framer-motion'
import { Award, Clock, ShieldCheck } from 'lucide-react'

const About = () => {
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
            description: 'Cada uno de nuestros productos cuenta con el respaldo de calidad Isaron.',
        },
    ]

    return (
        <section id="nosotros" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-eo-primary font-bold uppercase tracking-widest text-[10px]">
                                Sobre Nosotros
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-eo-dark uppercase tracking-tight">
                                Compromiso con su Salud Visual
                            </h2>
                        </div>

                        <p className="text-lg text-eo-secondary leading-relaxed">
                            En Estación Óptica nos dedicamos a brindar soluciones visuales integrales.
                            Combinamos el profesionalismo clínico con la conveniencia de la atención
                            personalizada a domicilio.
                        </p>

                        <div className="space-y-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-eo-primary/10 flex items-center justify-center text-eo-primary mr-5 transition duration-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-eo-dark">{feature.title}</h4>
                                            <p className="text-sm text-eo-secondary">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="pt-4">
                            <a
                                href="https://wa.me/584247448728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                HABLAR CON UN ESPECIALISTA
                            </a>
                        </div>
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100">
                            <div className="aspect-square bg-gradient-to-br from-eo-primary/20 to-eo-accent/20 rounded-2xl flex items-center justify-center p-12">
                                <div className="w-full h-full bg-eo-primary/10 rounded-xl flex items-center justify-center">
                                    <span className="text-eo-primary font-bold text-6xl">EO</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default About
