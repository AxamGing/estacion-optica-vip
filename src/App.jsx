import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Login from './pages/Admin/Login'
import Dashboard from './pages/Admin/Dashboard'
import WhatsAppButton from './components/common/WhatsAppButton'

// Smooth scroll wrapper — only active on public routes
const SmoothScroll = ({ children }) => {
    const location = useLocation()
    const isAdmin = location.pathname.startsWith('/admin')

    useEffect(() => {
        if (isAdmin) return // keep admin panel with normal scroll

        const lenis = new Lenis({
            duration: 1.4,         // how long the momentum lasts (seconds)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // natural ease
            smoothWheel: true,
            wheelMultiplier: 0.9,  // slightly slower for that "heavy" feel
        })

        const raf = (time) => {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        const rafId = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(rafId)
            lenis.destroy()
        }
    }, [isAdmin])

    return children
}

function App() {
    return (
        <Router>
            <SmoothScroll>
                <WhatsAppButton />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/producto/:id" element={<ProductDetail />} />
                    <Route path="/nosotros" element={<About />} />
                    <Route path="/admin" element={<Login />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                </Routes>
            </SmoothScroll>
        </Router>
    )
}

export default App
