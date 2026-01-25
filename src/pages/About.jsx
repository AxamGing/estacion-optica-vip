import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { CheckCircle } from 'lucide-react'

const About = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="bg-eo-dark text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4">Nuestra Historia</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Más de 10 años cuidando la visión de nuestros clientes con estilo y profesionalismo.
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-eo-dark">¿Quiénes Somos?</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    En Estación Óptica, no solo vendemos lentes; ofrecemos una experiencia visual completa.
                                    Nacimos con la pasión de combinar la salud visual con las últimas tendencias de moda,
                                    creyendo firmemente que tus gafas son una extensión de tu personalidad.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Contamos con un equipo de especialistas dedicados a encontrar la solución perfecta
                                    para tus necesidades, utilizando tecnología de punta en nuestros exámenes y
                                    ofreciendo un catálogo cuidadosamente curado.
                                </p>
                                <div className="space-y-3 pt-4">
                                    {[
                                        'Exámenes visuales computarizados',
                                        'Asesoría de imagen personalizada',
                                        'Garantía en todos nuestros productos',
                                        'Taller de montaje propio'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <CheckCircle className="text-eo-primary w-5 h-5 flex-shrink-0" />
                                            <span className="text-gray-700 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl transform md:rotate-2 hover:rotate-0 transition duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
                                    alt="Equipo Estación Óptica"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission / Vision */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="text-2xl font-bold text-eo-dark mb-4">Nuestra Misión</h3>
                                <p className="text-gray-600">
                                    Mejorar la calidad de vida de nuestros pacientes a través de una salud visual óptima,
                                    proporcionando productos de alta calidad y un servicio excepcional que supere sus expectativas.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                    <span className="text-2xl">👁️</span>
                                </div>
                                <h3 className="text-2xl font-bold text-eo-dark mb-4">Nuestra Visión</h3>
                                <p className="text-gray-600">
                                    Ser la óptica líder en referencia por nuestra innovación, calidad humana y profesionalismo,
                                    siendo reconocidos como el mejor aliado para la salud visual de las familias.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default About
