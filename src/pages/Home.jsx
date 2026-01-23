import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import Services from '../components/sections/Services'
import Gallery from '../components/sections/Gallery'
import About from '../components/sections/About'
import Contact from '../components/sections/Contact'

const Home = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <Hero />
                <Services />
                <Gallery />
                <About />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}

export default Home
