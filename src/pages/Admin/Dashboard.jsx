import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, LogOut, Plus, Edit, Trash2, CheckCircle,
    XCircle, Image as ImageIcon, Palette, Download, Search, Menu, Database, BarChart3, TrendingUp, Settings
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview'); // overview, products, bulk
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Data State
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // UI State
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [selectedIds, setSelectedIds] = useState([]);

    // Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '', brand: '', category: 'monturas', gender: 'unisex', price: 0,
        description: '', colors: [], selectedFile: null, previewImage: ''
    });
    const [colorInput, setColorInput] = useState({ name: '', hex: '#000000' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin');
            return;
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            toast.error('Error al cargar inventario');
        }
    };

    // --- Analytics Data Prep ---
    const stats = useMemo(() => {
        const total = products.length;
        const brands = [...new Set(products.map(p => p.brand))].filter(Boolean).length;
        const avgPrice = total > 0 ? products.reduce((acc, p) => acc + (p.price || 0), 0) / total : 0;
        
        // Gender Distribution for Pie Chart
        const genderCount = products.reduce((acc, p) => {
            acc[p.gender || 'unisex'] = (acc[p.gender || 'unisex'] || 0) + 1;
            return acc;
        }, {});
        const genderData = Object.keys(genderCount).map(k => ({ name: k.toUpperCase(), value: genderCount[k] }));

        // Brand Distribution for Bar Chart
        const brandCount = products.reduce((acc, p) => {
            if (p.brand) { acc[p.brand] = (acc[p.brand] || 0) + 1; }
            return acc;
        }, {});
        const brandData = Object.keys(brandCount).map(k => ({ name: k, Total: brandCount[k] })).sort((a,b) => b.Total - a.Total).slice(0, 5);

        return { total, brands, avgPrice, genderData, brandData };
    }, [products]);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // --- Actions ---
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        navigate('/admin');
    };

    const confirmDelete = (id) => setDeleteModal({ show: true, id });
    const executeDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/products/${deleteModal.id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Producto aniquilado con éxito 🗑️');
            setSelectedIds(prev => prev.filter(id => id !== deleteModal.id)); // Remove if selected
            fetchProducts();
        } catch (error) {
            toast.error('Error al eliminar producto');
        } finally {
            setDeleteModal({ show: false, id: null });
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredProducts.map(p => p._id));
        } else {
            setSelectedIds([]);
        }
    };

    const confirmBulkDelete = () => {
        if(window.confirm(`¿Estás 100% seguro de destruir ${selectedIds.length} productos al mismo tiempo? Esta acción no se puede deshacer.`)) {
            executeBulkDelete();
        }
    };

    const executeBulkDelete = async () => {
        const loadingToast = toast.loading('Calculando destrucción masiva... 💣');
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/products/bulk-delete', { ids: selectedIds }, { headers: { Authorization: `Bearer ${token}` } });
            toast.update(loadingToast, { render: `¡${selectedIds.length} productos vaporizados! 💥`, type: "success", isLoading: false, autoClose: 3000 });
            setSelectedIds([]);
            fetchProducts();
        } catch (error) {
            toast.update(loadingToast, { render: 'Error al ejecutar la eliminación masiva', type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    // --- Form Handlers (similar to old but with toast) ---
    const resetForm = () => {
        setNewProduct({ name: '', brand: '', category: 'monturas', gender: 'unisex', price: 0, description: '', colors: [], selectedFile: null, previewImage: ''});
        setColorInput({ name: '', hex: '#000000' });
        setEditingId(null);
        setShowAddProduct(false);
    };

    const handleEditProduct = (product) => {
        setNewProduct({
            name: product.name, brand: product.brand || '', category: product.category, gender: product.gender || 'unisex',
            price: product.price || 0, description: product.description || '', colors: product.colors || [], selectedFile: null,
            previewImage: (product.images && product.images[0]) ? product.images[0] : ''
        });
        setEditingId(product._id);
        setShowAddProduct(true);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { toast.error('La imagen es muy pesada (max 5MB)'); return; }
            setNewProduct(prev => ({ ...prev, selectedFile: file }));
            const reader = new FileReader();
            reader.onloadend = () => setNewProduct(prev => ({ ...prev, previewImage: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const addColor = () => {
        if (!colorInput.name.trim()) return;
        setNewProduct(prev => ({ ...prev, colors: [...prev.colors, { name: colorInput.name.trim(), hex: colorInput.hex }] }));
        setColorInput({ name: '', hex: '#000000' });
    };

    const removeColor = (indexToRemove) => setNewProduct(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== indexToRemove) }));

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading('Guardando hiper-velocidad... 🚀');
        try {
            const token = localStorage.getItem('token');
            let imageUrlUrl = newProduct.previewImage;
            if (newProduct.selectedFile) {
                const formData = new FormData();
                formData.append('image', newProduct.selectedFile);
                const uploadRes = await axios.post('/api/products/upload-image', formData, { headers: { 'Authorization': `Bearer ${token}` }});
                imageUrlUrl = uploadRes.data.imageUrl;
            }
            const payload = {
                name: newProduct.name, brand: newProduct.brand, category: newProduct.category, gender: newProduct.gender,
                price: Number(newProduct.price), description: newProduct.description, colors: newProduct.colors, images: imageUrlUrl ? [imageUrlUrl] : []
            };

            if (editingId) {
                await axios.put(`/api/products/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` }});
                toast.update(loadingToast, { render: "¡Actualizado magistralmente! ✨", type: "success", isLoading: false, autoClose: 3000 });
            } else {
                await axios.post('/api/products', payload, { headers: { Authorization: `Bearer ${token}` }});
                toast.update(loadingToast, { render: "¡Producto nuevo en órbita! 🌌", type: "success", isLoading: false, autoClose: 3000 });
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            toast.update(loadingToast, { render: "Error catastrófico al guardar 💥", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
            <ToastContainer position="top-right" theme="colored" />

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal.show && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">¿Pulsar el gatillo?</h3>
                            <p className="text-gray-500 mb-8">Esta lente se perderá en el abismo. No hay vuelta atrás.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 py-3 px-4 font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Cancelar</button>
                                <button onClick={executeDelete} className="flex-1 py-3 px-4 font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-600/30">ELIMINAR</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside animate={{ width: isSidebarOpen ? 280 : 80 }} className="bg-eo-dark text-white flex flex-col h-screen sticky top-0 z-20 shadow-2xl">
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    {isSidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-eo-primary to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="font-black text-xl">EO</span>
                            </div>
                            <span className="font-black text-xl tracking-tight">Estación Óptica</span>
                        </motion.div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-300 hover:text-white">
                        <Menu size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
                    <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition font-bold ${activeTab === 'overview' ? 'bg-eo-primary text-white shadow-lg shadow-eo-primary/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <LayoutDashboard size={22} className={activeTab === 'overview' ? 'text-white' : ''} />
                        {isSidebarOpen && <span>Panel Principal</span>}
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition font-bold ${activeTab === 'products' ? 'bg-eo-primary text-white shadow-lg shadow-eo-primary/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Package size={22} className={activeTab === 'products' ? 'text-white' : ''} />
                        {isSidebarOpen && <span>Directorio Lentes</span>}
                    </button>
                    <button onClick={() => setActiveTab('bulk')} className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition font-bold ${activeTab === 'bulk' ? 'bg-eo-primary text-white shadow-lg shadow-eo-primary/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Database size={22} className={activeTab === 'bulk' ? 'text-white' : ''} />
                        {isSidebarOpen && <span>Poderes Base de Datos</span>}
                    </button>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition font-bold">
                        <LogOut size={22} />
                        {isSidebarOpen && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 px-8 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {activeTab === 'overview' && 'Centro de Comando'}
                            {activeTab === 'products' && 'Gestor de Inventario'}
                            {activeTab === 'bulk' && 'Ingeniería de Datos'}
                        </h2>
                        <p className="text-sm font-semibold text-gray-500">Bienvenido al sistema absoluto.</p>
                    </div>
                    {activeTab === 'products' && (
                        <button onClick={() => { resetForm(); setShowAddProduct(true) }} className="flex items-center gap-2 bg-gradient-to-r from-eo-primary to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/30">
                            <Plus size={20} />
                            <span>Añadir Joya Visual</span>
                        </button>
                    )}
                </header>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {/* ----------------- TAB: OVERVIEW ----------------- */}
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-between group hover:border-eo-primary/50 transition">
                                        <div>
                                            <p className="text-gray-500 font-bold mb-1">Volumen Inventario</p>
                                            <h3 className="text-4xl font-black text-gray-900">{stats.total}</h3>
                                        </div>
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                            <Package className="text-blue-600 group-hover:text-white w-8 h-8 transition-colors"/>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-between group hover:border-eo-primary/50 transition">
                                        <div>
                                            <p className="text-gray-500 font-bold mb-1">Marcas Exclusivas</p>
                                            <h3 className="text-4xl font-black text-gray-900">{stats.brands}</h3>
                                        </div>
                                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                                            <BarChart3 className="text-emerald-500 group-hover:text-white w-8 h-8 transition-colors"/>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-between group hover:border-eo-primary/50 transition">
                                        <div>
                                            <p className="text-gray-500 font-bold mb-1">Precio Promedio</p>
                                            <h3 className="text-4xl font-black text-gray-900">${Math.round(stats.avgPrice)}</h3>
                                        </div>
                                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                                            <TrendingUp className="text-purple-500 group-hover:text-white w-8 h-8 transition-colors"/>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Dominancia de Marcas</h3>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={stats.brandData}>
                                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                                                    <Bar dataKey="Total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Distribución por Público</h3>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={stats.genderData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                                                        {stats.genderData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent"/>
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}/>
                                                    <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ----------------- TAB: PRODUCTS ----------------- */}
                        {activeTab === 'products' && (
                            <motion.div key="products" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                                {/* Search Bar & Actions */}
                                <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" placeholder="Rastrear lente por nombre o marca..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-eo-primary outline-none transition font-medium" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {selectedIds.length > 0 && (
                                            <motion.button initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} onClick={confirmBulkDelete} className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl font-black shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all">
                                                Eliminar {selectedIds.length} <Trash2 size={20} />
                                            </motion.button>
                                        )}
                                        <button onClick={() => {
                                            const data = JSON.stringify(products, null, 2);
                                        const blob = new Blob([data], {type: 'application/json'});
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url; a.download = 'backup_optica.json'; a.click();
                                        toast.success('Backup descargado');
                                    }} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition font-bold">
                                        <Download size={20} /> Base Datos Local
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="p-5 w-10">
                                                        <div className="flex items-center justify-center">
                                                            <input 
                                                                type="checkbox" 
                                                                className="w-5 h-5 rounded border-gray-300 text-eo-primary focus:ring-eo-primary cursor-pointer accent-eo-primary"
                                                                checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                                                                onChange={toggleSelectAll}
                                                            />
                                                        </div>
                                                    </th>
                                                    <th className="p-5 font-black text-gray-500 uppercase text-xs tracking-wider">Identidad Visual</th>
                                                    <th className="p-5 font-black text-gray-500 uppercase text-xs tracking-wider">Modelo & Marca</th>
                                                    <th className="p-5 font-black text-gray-500 uppercase text-xs tracking-wider">Precio Mercado</th>
                                                    <th className="p-5 font-black text-gray-500 uppercase text-xs tracking-wider">Espectro de Colores</th>
                                                    <th className="p-5 font-black text-gray-500 uppercase text-xs tracking-wider text-right">Maniobras</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredProducts.map((p) => (
                                                    <tr key={p._id} className={`transition duration-200 ${selectedIds.includes(p._id) ? 'bg-blue-50/80 border-l-4 border-l-eo-primary' : 'hover:bg-blue-50/30 border-l-4 border-l-transparent'}`}>
                                                        <td className="p-5">
                                                            <div className="flex items-center justify-center">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="w-5 h-5 rounded border-gray-300 text-eo-primary focus:ring-eo-primary cursor-pointer accent-eo-primary"
                                                                    checked={selectedIds.includes(p._id)}
                                                                    onChange={() => toggleSelect(p._id)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="p-5">
                                                            <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                                                                {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-contain" alt="lente"/> : <ImageIcon className="w-8 h-8 text-gray-300"/>}
                                                            </div>
                                                        </td>
                                                        <td className="p-5">
                                                            <p className="font-black text-gray-900 text-lg">{p.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide">{p.brand || 'Varios'}</span>
                                                                <span className="text-gray-400 text-sm capitalize">{p.gender}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-5">
                                                            <span className="font-black text-eo-primary text-xl">${p.price || '0'}</span>
                                                        </td>
                                                        <td className="p-5">
                                                            <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                                                                {p.colors?.map((c, i) => (
                                                                    <div key={i} className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" style={{backgroundColor: c.hex}} title={c.name} />
                                                                ))}
                                                                {(!p.colors || p.colors.length === 0) && <span className="text-gray-400 text-sm font-medium">Básico</span>}
                                                            </div>
                                                        </td>
                                                        <td className="p-5 text-right space-x-3">
                                                            <button onClick={() => handleEditProduct(p)} className="p-3 bg-white border border-gray-200 text-blue-600 hover:border-blue-600 hover:bg-blue-50 rounded-xl transition shadow-sm inline-block"><Edit size={18}/></button>
                                                            <button onClick={() => confirmDelete(p._id)} className="p-3 bg-white border border-gray-200 text-red-600 hover:border-red-600 hover:bg-red-50 rounded-xl transition shadow-sm inline-block"><Trash2 size={18}/></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredProducts.length === 0 && (
                                                    <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold text-lg border-none">No hay evidencias con ese nombre...</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ----------------- TAB: BULK ----------------- */}
                        {activeTab === 'bulk' && (
                            <motion.div key="bulk" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-4xl mx-auto">
                                <div className="bg-gradient-to-br from-eo-dark to-gray-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-eo-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                                    <h2 className="text-3xl font-black mb-4 tracking-tight flex items-center gap-3">
                                        <Settings className="text-eo-primary" size={32} /> Inyección Maestra de Datos
                                    </h2>
                                    <p className="text-gray-300 text-lg mb-8 max-w-2xl leading-relaxed">
                                        Aquí puedes controlar funciones avanzadas como la inyección masiva del catálogo de Palazzo o volcar información. Estas acciones son irreversibles.
                                    </p>
                                    
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-xl mb-1">Cargar Semilla: Colección Palazzo</h4>
                                            <p className="text-gray-400 text-sm">38 Modelos listos para impactar el mercado. Esto no borra lo que ya tienes.</p>
                                        </div>
                                        <button onClick={async () => {
                                            if (window.confirm("¿Seguro que deseas inyectar los 38 modelos de Palazzo? Esto no se puede deshacer de forma masiva fácilmente.")) {
                                                const seedToast = toast.loading('Inyectando ADN de Palazzo... 🧬');
                                                try {
                                                    const res = await axios.post('/api/products/seed', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
                                                    toast.update(seedToast, { render: res.data.message, type: "success", isLoading: false, autoClose: 4000 });
                                                    fetchProducts();
                                                } catch (err) {
                                                    toast.update(seedToast, { render: "Falla catastrófica en la inyección", type: "error", isLoading: false, autoClose: 4000 });
                                                }
                                            }
                                        }} className="bg-white text-gray-900 font-black px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-xl">
                                            INYECTAR CATÁLOGO
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Product Add/Edit Modal (same form logic, brutal design) */}
            <AnimatePresence>
                {showAddProduct && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-6">
                        <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} className="bg-white max-w-5xl w-full max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-eo-primary/10 rounded-xl flex items-center justify-center text-eo-primary">
                                        {editingId ? <Edit size={20}/> : <Plus size={20}/>}
                                    </div>
                                    {editingId ? 'Forjar Cambios Lente' : 'Esculpir Nueva Lente'}
                                </h2>
                                <button onClick={resetForm} className="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center transition shadow-sm"><XCircle size={24}/></button>
                            </div>

                            {/* Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                                <form id="productForm2" onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Left */}
                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Pieza Visual</label>
                                            <div className="h-72 bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2rem] hover:border-eo-primary hover:bg-blue-50/50 transition relative group flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                                <input type="file" onChange={handleImageSelect} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                                                {newProduct.previewImage ? (
                                                    <div className="relative w-full h-full p-4">
                                                        <img src={newProduct.previewImage} className="w-full h-full object-contain rounded-2xl drop-shadow-xl" alt="Lente" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white font-bold tracking-widest">CAMBIAR ARCHIVO</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-4 text-eo-primary"><ImageIcon size={32}/></div>
                                                        <p className="font-black text-gray-800 text-lg">Subir Archivo HD</p>
                                                        <p className="text-sm font-semibold text-gray-400 mt-2">Formatos Premium: JPG, WEBP</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-[2rem]">
                                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2"><Palette size={18}/> Espectro Cromwell</label>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {newProduct.colors.map((c, i) => (
                                                    <div key={i} className="bg-white flex items-center gap-3 px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                                                        <span className="w-5 h-5 rounded-full border border-gray-100 shadow-inner" style={{backgroundColor: c.hex}}></span>
                                                        <span className="font-bold text-sm">{c.name}</span>
                                                        <button type="button" onClick={() => removeColor(i)} className="text-gray-300 hover:text-red-500"><XCircle size={18}/></button>
                                                    </div>
                                                ))}
                                                {newProduct.colors.length === 0 && <span className="text-sm font-bold text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100">Lente sin variantes</span>}
                                            </div>
                                            <div className="flex gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                                                <input type="color" value={colorInput.hex} onChange={e => setColorInput({...colorInput, hex: e.target.value})} className="w-12 h-12 rounded-xl border-none p-0 cursor-copy" />
                                                <input type="text" placeholder="Ej: Tortoise..." value={colorInput.name} onChange={e => setColorInput({...colorInput, name: e.target.value})} className="flex-1 px-4 font-bold bg-transparent outline-none" />
                                                <button type="button" onClick={addColor} className="bg-gray-900 text-white font-black px-6 rounded-xl hover:bg-eo-primary transition">INCLUIR</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="space-y-6 flex flex-col justify-center">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Denominación</label>
                                            <input type="text" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} placeholder="ALEJANDRO" className="w-full bg-gray-50 border-2 border-transparent focus:border-eo-primary px-6 py-4 rounded-2xl font-black text-xl outline-none transition" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Marca Origen</label>
                                                <input type="text" value={newProduct.brand} onChange={e=>setNewProduct({...newProduct, brand: e.target.value})} placeholder="Palazzo" className="w-full bg-gray-50 border-2 border-transparent focus:border-eo-primary px-6 py-4 rounded-2xl font-bold outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 text-eo-primary">Valor Oficial ($)</label>
                                                <input type="number" min="0" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} placeholder="0" className="w-full bg-blue-50/50 text-eo-primary border-2 border-transparent focus:border-eo-primary px-6 py-4 rounded-2xl font-black text-2xl outline-none transition" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Segmento</label>
                                                <select value={newProduct.gender} onChange={e=>setNewProduct({...newProduct, gender: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-eo-primary px-6 py-4 rounded-2xl font-bold outline-none transition appearance-none">
                                                    <option value="unisex">Unisex Global</option>
                                                    <option value="hombre">Caballeros</option>
                                                    <option value="mujer">Damas Elegancia</option>
                                                    <option value="ninos">Infantil</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tipo de Pieza</label>
                                                <select value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-eo-primary px-6 py-4 rounded-2xl font-bold outline-none transition appearance-none">
                                                    <option value="monturas">Montura Óptica</option>
                                                    <option value="lentes">Lente Solar</option>
                                                    <option value="accesorios">Accesorio Premium</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Atribuciones Finales (Opcional)</label>
                                            <textarea value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} placeholder="Medidas especiales, material de la montura..." rows="3" className="w-full bg-gray-50 border-2 border-transparent focus:border-eo-primary px-6 py-4 rounded-2xl font-semibold outline-none transition resize-none text-sm leading-relaxed" />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="bg-white border-t border-gray-100 p-6 flex justify-end gap-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                                <button type="button" onClick={resetForm} className="px-8 py-4 font-black rounded-2xl text-gray-500 hover:bg-gray-50 transition">DESARTICULAR</button>
                                <button type="submit" form="productForm2" disabled={isLoading} className="px-10 py-4 font-black rounded-2xl bg-eo-primary text-white hover:bg-eo-accent shadow-xl shadow-eo-primary/30 transition disabled:opacity-50 flex gap-2 items-center">
                                    {isLoading ? <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle size={20}/>}
                                    CONSOLIDAR LENTE
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
