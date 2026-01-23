import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Glasses, Truck } from 'lucide-react'

const Services = () => {
    const services = [
        {
            icon: Eye,
            title: 'Examen Visual',
            description: 'Evaluación oftalmológica profesional realizada por especialistas en la comodidad de su hogar.',
        },
        {
            icon: Glasses,
            title: 'Monturas de Calidad',
            description: 'Gran variedad de modelos y estilos para todos los gustos, garantizando comodidad y durabilidad.',
        },
        {
            icon: Truck,
            title: 'Entrega a Domicilio',
            description: 'Llevamos sus lentes hasta su puerta, asegurando un ajuste perfecto sin desplazamientos necesarios.',
        },
    ]

    return (
        <section id="servicios" className="py-24 bg-eo-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="text-eo-primary font-bold uppercase tracking-widest text-[10px]">
                        Atención Integral
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-eo-dark uppercase tracking-tight">
                        Servicios de Salud Visual
                    </h2>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-10 rounded-2xl flex flex-col items-center group shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-16 h-16 rounded-xl bg-eo-primary/10 flex items-center justify-center text-eo-primary mb-6 transition duration-300 group-hover:bg-eo-primary group-hover:text-white">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-eo-dark uppercase">
                                    {service.title}
                                </h3>
                                <p className="text-eo-secondary text-sm leading-relaxed">
                                    {service.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <a
                        href="https://wa.me/584247448728"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-eo-primary font-bold hover:underline group"
                    >
                        <span>Consultar otros servicios</span>
                        <svg
                            className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition duration-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

export default Services
