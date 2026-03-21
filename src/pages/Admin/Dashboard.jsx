import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, Package, LogOut, Plus, Edit, Trash2, CheckCircle,
    XCircle, Image as ImageIcon, Palette, Download, Search, Menu, Database,
    BarChart3, TrendingUp, Settings, Eye, Tag, RefreshCw, Star, Flame,
    ExternalLink, X, ChevronDown, MessageCircle, Filter
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const TAG_OPTIONS = ['nuevo', 'tendencia', 'premium', 'exclusivo', 'limitado'];
const FRAME_SHAPES = ['Rectangular', 'Redondo', 'Cuadrado', 'Aviador', 'Cat-Eye', 'Ovalado', 'Irregular'];

const emptyForm = {
    name: '', brand: '', category: 'monturas', gender: 'unisex',
    description: '', material: '', frameShape: '',
    colors: [], tags: [],
    images: [], previewImages: [], selectedFiles: [],
    colorImages: [],
    specifications: [],
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [products, setProducts] = useState([]);
    const [trending, setTrending] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [selectedIds, setSelectedIds] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [colorInput, setColorInput] = useState({ name: '', hex: '#3b82f6' });
    const [specInput, setSpecInput] = useState({ key: '', value: '' });
    const [activeColorImg, setActiveColorImg] = useState(null);
    const [draggingGeneral, setDraggingGeneral] = useState(false);
    const [draggingColorIdx, setDraggingColorIdx] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('token')) { navigate('/admin'); return; }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const [prodRes, trendRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/products/trending?limit=5')
            ]);
            setProducts(prodRes.data);
            setTrending(trendRes.data);
        } catch { toast.error('Error al cargar datos'); }
    };

    const stats = useMemo(() => {
        const total = products.length;
        const brands = [...new Set(products.map(p => p.brand))].filter(Boolean).length;
        const totalViews = products.reduce((a, p) => a + (p.views || 0), 0);
        const genderCount = products.reduce((acc, p) => { acc[p.gender || 'unisex'] = (acc[p.gender || 'unisex'] || 0) + 1; return acc; }, {});
        const genderData = Object.keys(genderCount).map(k => ({ name: k.toUpperCase(), value: genderCount[k] }));
        const brandCount = products.reduce((acc, p) => { if (p.brand) acc[p.brand] = (acc[p.brand] || 0) + 1; return acc; }, {});
        const brandData = Object.keys(brandCount).map(k => ({ name: k, Total: brandCount[k] })).sort((a, b) => b.Total - a.Total).slice(0, 6);
        return { total, brands, totalViews, genderData, brandData };
    }, [products]);

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = !filterCat || p.category === filterCat;
        const matchGender = !filterGender || p.gender === filterGender;
        return matchSearch && matchCat && matchGender;
    });

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('admin'); navigate('/admin'); };

    const resetForm = () => { setForm(emptyForm); setColorInput({ name: '', hex: '#3b82f6' }); setSpecInput({ key: '', value: '' }); setEditingId(null); setShowForm(false); setActiveColorImg(null); };

    const handleEdit = (p) => {
        setForm({
            name: p.name, brand: p.brand || '', category: p.category, gender: p.gender || 'unisex',
            description: p.description || '', material: p.material || '', frameShape: p.frameShape || '',
            colors: p.colors || [], tags: p.tags || [],
            images: p.images || [], previewImages: p.images || [], selectedFiles: [],
            colorImages: p.colorImages || [],
            specifications: p.specifications ? Object.entries(p.specifications) : [],
        });
        setEditingId(p._id);
        setShowForm(true);
    };

    const handleFilesSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const previews = files.map(f => URL.createObjectURL(f));
        setForm(prev => ({ ...prev, selectedFiles: [...prev.selectedFiles, ...files], previewImages: [...prev.previewImages, ...previews] }));
    };

    const handleGeneralDrop = (e) => {
        e.preventDefault();
        setDraggingGeneral(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (!files.length) return;
        const previews = files.map(f => URL.createObjectURL(f));
        setForm(prev => ({ ...prev, selectedFiles: [...prev.selectedFiles, ...files], previewImages: [...prev.previewImages, ...previews] }));
    };

    const removeImage = (idx) => setForm(prev => ({ ...prev, previewImages: prev.previewImages.filter((_, i) => i !== idx), selectedFiles: prev.selectedFiles.filter((_, i) => i !== idx) }));

    const addColor = () => {
        if (!colorInput.name.trim()) return;
        const newColor = { name: colorInput.name.trim(), hex: colorInput.hex };
        setForm(prev => ({ ...prev, colors: [...prev.colors, newColor], colorImages: [...prev.colorImages, { colorName: newColor.name, colorHex: newColor.hex, images: [], selectedFiles: [] }] }));
        setColorInput({ name: '', hex: '#3b82f6' });
    };

    const removeColor = (i) => setForm(prev => ({ ...prev, colors: prev.colors.filter((_, idx) => idx !== i), colorImages: prev.colorImages.filter((_, idx) => idx !== i) }));

    const handleColorFiles = (colorIdx, e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const previews = files.map(f => URL.createObjectURL(f));
        setForm(prev => {
            const ci = [...prev.colorImages];
            ci[colorIdx] = { ...ci[colorIdx], images: [...(ci[colorIdx].images || []), ...previews], selectedFiles: [...(ci[colorIdx].selectedFiles || []), ...files] };
            return { ...prev, colorImages: ci };
        });
    };

    const handleColorDrop = (colorIdx, e) => {
        e.preventDefault();
        setDraggingColorIdx(null);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (!files.length) return;
        const previews = files.map(f => URL.createObjectURL(f));
        setForm(prev => {
            const ci = [...prev.colorImages];
            ci[colorIdx] = { ...ci[colorIdx], images: [...(ci[colorIdx].images || []), ...previews], selectedFiles: [...(ci[colorIdx].selectedFiles || []), ...files] };
            return { ...prev, colorImages: ci };
        });
    };

    const pickColor = async () => {
        if (!window.EyeDropper) {
            toast.warning('Tu navegador no soporta el cuentagotas nativo. Usa el selector manual.');
            return;
        }
        try {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            setColorInput(p => ({ ...p, hex: result.sRGBHex }));
        } catch (e) {
            // User canceled eyedropper
        }
    };

    const removeColorImage = (colorIdx, imgIdx) => setForm(prev => {
        const ci = [...prev.colorImages];
        ci[colorIdx] = { ...ci[colorIdx], images: ci[colorIdx].images.filter((_, i) => i !== imgIdx), selectedFiles: (ci[colorIdx].selectedFiles || []).filter((_, i) => i !== imgIdx) };
        return { ...prev, colorImages: ci };
    });

    const addSpec = () => {
        if (!specInput.key.trim() || !specInput.value.trim()) return;
        setForm(prev => ({ ...prev, specifications: [...prev.specifications, [specInput.key.trim(), specInput.value.trim()]] }));
        setSpecInput({ key: '', value: '' });
    };

    const removeSpec = (i) => setForm(prev => ({ ...prev, specifications: prev.specifications.filter((_, idx) => idx !== i) }));

    const toggleTag = (tag) => setForm(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }));

    const uploadFiles = async (files, token) => {
        const urls = [];
        for (const file of files) {
            const fd = new FormData(); fd.append('image', file);
            const r = await axios.post('/api/products/upload-image', fd, { headers: { Authorization: `Bearer ${token}` } });
            urls.push(r.data.imageUrl);
        }
        return urls;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading('Guardando...');
        try {
            const token = localStorage.getItem('token');
            // Upload general images
            let finalImages = form.images.filter(u => u.startsWith('http'));
            if (form.selectedFiles.length) {
                const uploaded = await uploadFiles(form.selectedFiles, token);
                finalImages = [...finalImages, ...uploaded];
            }
            // Upload color images
            const finalColorImages = [];
            for (const ci of form.colorImages) {
                let ciUrls = (ci.images || []).filter(u => u.startsWith('http'));
                if (ci.selectedFiles && ci.selectedFiles.length) {
                    const uploaded = await uploadFiles(ci.selectedFiles, token);
                    ciUrls = [...ciUrls, ...uploaded];
                }
                finalColorImages.push({ colorName: ci.colorName, colorHex: ci.colorHex, images: ciUrls });
            }
            const payload = {
                name: form.name, brand: form.brand, category: form.category, gender: form.gender,
                description: form.description, material: form.material, frameShape: form.frameShape,
                colors: form.colors, tags: form.tags,
                images: finalImages, colorImages: finalColorImages,
                specifications: Object.fromEntries(form.specifications),
            };
            if (editingId) {
                await axios.put(`/api/products/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.update(loadingToast, { render: '¡Actualizado! ✨', type: 'success', isLoading: false, autoClose: 3000 });
            } else {
                await axios.post('/api/products', payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.update(loadingToast, { render: '¡Producto creado! 🌟', type: 'success', isLoading: false, autoClose: 3000 });
            }
            resetForm(); fetchProducts();
        } catch (err) {
            toast.update(loadingToast, { render: 'Error al guardar 💥', type: 'error', isLoading: false, autoClose: 3000 });
        } finally { setIsLoading(false); }
    };

    const confirmDelete = (id) => setDeleteModal({ show: true, id });
    const executeDelete = async () => {
        try {
            await axios.delete(`/api/products/${deleteModal.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            toast.success('Producto eliminado 🗑️'); setSelectedIds(p => p.filter(x => x !== deleteModal.id)); fetchProducts();
        } catch { toast.error('Error al eliminar'); }
        finally { setDeleteModal({ show: false, id: null }); }
    };

    const executeBulkDelete = async () => {
        if (!window.confirm(`¿Eliminar ${selectedIds.length} productos? No hay vuelta atrás.`)) return;
        const t = toast.loading('Eliminando...');
        try {
            await axios.post('/api/products/bulk-delete', { ids: selectedIds }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            toast.update(t, { render: `${selectedIds.length} eliminados 💥`, type: 'success', isLoading: false, autoClose: 3000 });
            setSelectedIds([]); fetchProducts();
        } catch { toast.update(t, { render: 'Error', type: 'error', isLoading: false, autoClose: 3000 }); }
    };

    const navItems = [
        { id: 'overview', icon: <LayoutDashboard size={22} />, label: 'Panel Principal' },
        { id: 'products', icon: <Package size={22} />, label: 'Inventario' },
        { id: 'advanced', icon: <Database size={22} />, label: 'Herramientas' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
            <ToastContainer position="top-right" theme="colored" />

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal.show && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-10 h-10 text-red-600" /></div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">¿Eliminar producto?</h3>
                            <p className="text-gray-500 mb-8">Esta acción no se puede deshacer.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 py-3 font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Cancelar</button>
                                <button onClick={executeDelete} className="flex-1 py-3 font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-lg">ELIMINAR</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside animate={{ width: isSidebarOpen ? 270 : 72 }} className="bg-gray-900 text-white flex flex-col h-screen sticky top-0 z-20 shadow-2xl overflow-hidden">
                <div className="p-5 flex items-center justify-between border-b border-white/10 min-h-[72px]">
                    {isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg"><span className="font-black text-base">EO</span></div>
                        <span className="font-black text-lg tracking-tight whitespace-nowrap">Estación Óptica</span>
                    </motion.div>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white flex-shrink-0"><Menu size={22} /></button>
                </div>
                <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-4 px-3 py-3.5 rounded-2xl transition font-bold w-full text-left ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                            <span className="flex-shrink-0">{item.icon}</span>
                            {isSidebarOpen && <span className="whitespace-nowrap text-sm">{item.label}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-white/10">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-3 py-3.5 rounded-2xl text-red-400 hover:bg-red-400/10 transition font-bold">
                        <LogOut size={22} className="flex-shrink-0" />{isSidebarOpen && <span className="whitespace-nowrap text-sm">Cerrar Sesión</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main */}
            <main className="flex-1 h-screen overflow-y-auto">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">
                            {activeTab === 'overview' && '📊 Centro de Comando'}
                            {activeTab === 'products' && '📦 Inventario de Catálogo'}
                            {activeTab === 'advanced' && '⚙️ Herramientas Avanzadas'}
                        </h2>
                        <p className="text-xs font-semibold text-gray-400">Panel Administrativo — Estación Óptica</p>
                    </div>
                    {activeTab === 'products' && (
                        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/30 text-sm">
                            <Plus size={18} /> Añadir Producto
                        </button>
                    )}
                </header>

                <div className="p-6 md:p-8">
                    <AnimatePresence mode="wait">

                        {/* ── OVERVIEW ── */}
                        {activeTab === 'overview' && (
                            <motion.div key="ov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Total Productos', value: stats.total, icon: <Package className="w-7 h-7" />, color: 'blue' },
                                        { label: 'Marcas', value: stats.brands, icon: <Star className="w-7 h-7" />, color: 'emerald' },
                                        { label: 'Vistas Totales', value: stats.totalViews.toLocaleString(), icon: <Eye className="w-7 h-7" />, color: 'purple' },
                                    ].map(({ label, value, icon, color }) => (
                                        <div key={label} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex items-center justify-between group hover:border-${color}-400/50 transition`}>
                                            <div><p className="text-sm text-gray-500 font-bold mb-1">{label}</p><h3 className="text-4xl font-black text-gray-900">{value}</h3></div>
                                            <div className={`w-14 h-14 bg-${color}-50 rounded-2xl flex items-center justify-center text-${color}-500 group-hover:bg-${color}-500 group-hover:text-white transition-colors`}>{icon}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Charts + Trending */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
                                        <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2"><BarChart3 size={20} className="text-blue-500" /> Marcas</h3>
                                        <div className="h-52">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={stats.brandData}>
                                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                                    <Bar dataKey="Total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
                                        <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2"><PieChart size={20} className="text-emerald-500" /> Público</h3>
                                        <div className="h-52">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={stats.genderData} innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                                                        {stats.genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                                    <Legend verticalAlign="bottom" height={32} iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    {/* Top Trending */}
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
                                        <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2"><Flame size={20} className="text-orange-500" /> Más Vistos</h3>
                                        <div className="space-y-3">
                                            {trending.length === 0 && <p className="text-sm text-gray-400 font-medium text-center py-4">Sin visitas aún</p>}
                                            {trending.map((p, i) => (
                                                <div key={p._id} className="flex items-center gap-3 group">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0 ? 'bg-orange-500 text-white' : i === 1 ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                        {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-contain" alt="" /> : <ImageIcon className="w-5 h-5 text-gray-300 m-auto mt-2" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                                                        <p className="text-xs text-gray-400">{p.brand || '—'}</p>
                                                    </div>
                                                    <span className="flex items-center gap-1 text-xs font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0"><Eye size={12} />{p.views || 0}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent products */}
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg">
                                    <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2"><TrendingUp size={20} className="text-purple-500" /> Últimos Añadidos</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {products.slice(0, 6).map(p => (
                                            <div key={p._id} className="text-center">
                                                <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-2 flex items-center justify-center p-2">
                                                    {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-contain" alt="" /> : <ImageIcon className="w-6 h-6 text-gray-300" />}
                                                </div>
                                                <p className="text-xs font-bold text-gray-700 truncate">{p.name}</p>
                                                <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── PRODUCTS ── */}
                        {activeTab === 'products' && (
                            <motion.div key="pr" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                                {/* Filters bar */}
                                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center">
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input type="text" placeholder="Buscar por nombre o marca..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Todas las categorías</option>
                                        <option value="monturas">Monturas</option>
                                        <option value="lentes">Lentes Solar</option>
                                        <option value="accesorios">Accesorios</option>
                                    </select>
                                    <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Todo el público</option>
                                        <option value="hombre">Caballeros</option>
                                        <option value="mujer">Damas</option>
                                        <option value="ninos">Niños</option>
                                        <option value="unisex">Unisex</option>
                                    </select>
                                    <div className="flex items-center gap-2 ml-auto">
                                        {selectedIds.length > 0 && (
                                            <button onClick={executeBulkDelete} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition shadow">
                                                <Trash2 size={16} /> Eliminar {selectedIds.length}
                                            </button>
                                        )}
                                        <button onClick={() => { const data = JSON.stringify(products, null, 2); const b = new Blob([data], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'catalogo_optica.json'; a.click(); toast.success('Backup descargado'); }} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                                            <Download size={16} /> Exportar
                                        </button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="p-4 w-10"><input type="checkbox" className="w-4 h-4 rounded accent-blue-600 cursor-pointer" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={e => setSelectedIds(e.target.checked ? filtered.map(p => p._id) : [])} /></th>
                                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Producto</th>
                                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Detalles</th>
                                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Colores</th>
                                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Vistas</th>
                                                    <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {filtered.map(p => (
                                                    <tr key={p._id} className={`transition ${selectedIds.includes(p._id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50/60 border-l-4 border-l-transparent'}`}>
                                                        <td className="p-4"><input type="checkbox" className="w-4 h-4 rounded accent-blue-600 cursor-pointer" checked={selectedIds.includes(p._id)} onChange={() => setSelectedIds(prev => prev.includes(p._id) ? prev.filter(x => x !== p._id) : [...prev, p._id])} /></td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                                                                    {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-contain" alt="" /> : <ImageIcon className="w-6 h-6 text-gray-300" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-gray-900">{p.name}</p>
                                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-bold uppercase">{p.brand || '—'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold capitalize mr-2">{p.category}</span>
                                                            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg font-bold capitalize">{p.gender}</span>
                                                            {p.tags?.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{p.tags.map(t => <span key={t} className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">{t}</span>)}</div>}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-1 flex-wrap max-w-[100px]">
                                                                {p.colors?.slice(0, 6).map((c, i) => <div key={i} title={c.name} className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: c.hex }} />)}
                                                                {(!p.colors || p.colors.length === 0) && <span className="text-xs text-gray-400">—</span>}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="flex items-center gap-1 text-sm font-black text-blue-500"><Eye size={14} />{p.views || 0}</span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link to={`/producto/${p._id}`} target="_blank" className="p-2 bg-white border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 rounded-xl transition shadow-sm"><ExternalLink size={15} /></Link>
                                                                <button onClick={() => handleEdit(p)} className="p-2 bg-white border border-gray-200 text-blue-600 hover:border-blue-600 hover:bg-blue-50 rounded-xl transition shadow-sm"><Edit size={15} /></button>
                                                                <button onClick={() => confirmDelete(p._id)} className="p-2 bg-white border border-gray-200 text-red-500 hover:border-red-500 hover:bg-red-50 rounded-xl transition shadow-sm"><Trash2 size={15} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filtered.length === 0 && <tr><td colSpan="6" className="p-10 text-center text-gray-400 font-bold">No hay productos que coincidan</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">{filtered.length} de {products.length} productos</p>
                            </motion.div>
                        )}

                        {/* ── ADVANCED ── */}
                        {activeTab === 'advanced' && (
                            <motion.div key="adv" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 max-w-3xl mx-auto">
                                <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                                    <h2 className="text-2xl font-black mb-2 flex items-center gap-3"><Settings className="text-blue-400" size={28} /> Herramientas Avanzadas</h2>
                                    <p className="text-gray-400 mb-6">Acciones que afectan a todo el catálogo. Procede con cuidado.</p>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: 'Inyectar Catálogo Palazzo', desc: '38 modelos listos. No borra lo que ya tienes.',
                                                btnLabel: 'INYECTAR', btnClass: 'bg-blue-500 hover:bg-blue-600',
                                                action: async () => {
                                                    if (!window.confirm('¿Inyectar 38 modelos Palazzo?')) return;
                                                    const t = toast.loading('Inyectando...');
                                                    try { const r = await axios.post('/api/products/seed', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); toast.update(t, { render: r.data.message, type: 'success', isLoading: false, autoClose: 4000 }); fetchProducts(); }
                                                    catch { toast.update(t, { render: 'Error en inyección', type: 'error', isLoading: false, autoClose: 4000 }); }
                                                }
                                            },
                                            {
                                                title: 'Reiniciar Contador de Vistas', desc: 'Pone a 0 las vistas de todos los productos.',
                                                btnLabel: 'REINICIAR', btnClass: 'bg-amber-500 hover:bg-amber-600',
                                                action: async () => {
                                                    if (!window.confirm('¿Reiniciar todas las vistas a 0?')) return;
                                                    const t = toast.loading('Reiniciando...');
                                                    try { await axios.post('/api/products/reset-views', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); toast.update(t, { render: 'Vistas reiniciadas ✅', type: 'success', isLoading: false, autoClose: 3000 }); fetchProducts(); }
                                                    catch { toast.update(t, { render: 'Error', type: 'error', isLoading: false, autoClose: 3000 }); }
                                                }
                                            },
                                            {
                                                title: '⚠️ Borrar TODO el Catálogo', desc: 'Elimina TODOS los productos sin excepción. Irreversible.',
                                                btnLabel: 'BORRAR TODO', btnClass: 'bg-red-600 hover:bg-red-700',
                                                action: async () => {
                                                    const confirm1 = window.confirm('¿Seguro que quieres borrar TODOS los productos?');
                                                    if (!confirm1) return;
                                                    const confirm2 = window.confirm('Última advertencia. Esto NO se puede deshacer. ¿Continuar?');
                                                    if (!confirm2) return;
                                                    const t = toast.loading('Borrando catálogo...');
                                                    try { await axios.delete('/api/products/all', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); toast.update(t, { render: 'Catálogo eliminado 🗑️', type: 'success', isLoading: false, autoClose: 4000 }); fetchProducts(); }
                                                    catch { toast.update(t, { render: 'Error', type: 'error', isLoading: false, autoClose: 4000 }); }
                                                }
                                            },
                                        ].map(({ title, desc, btnLabel, btnClass, action }) => (
                                            <div key={title} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between gap-4">
                                                <div><h4 className="font-black text-base mb-0.5">{title}</h4><p className="text-gray-400 text-sm">{desc}</p></div>
                                                <button onClick={action} className={`${btnClass} text-white font-black px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg flex-shrink-0`}>{btnLabel}</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>

            {/* ══ PRODUCT FORM MODAL ══ */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto">
                        <motion.div initial={{ y: 40, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: 0.97 }} className="bg-white max-w-5xl w-full rounded-[2rem] shadow-2xl overflow-hidden my-8">
                            {/* Header */}
                            <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">{editingId ? <Edit size={18} /> : <Plus size={18} />}</div>
                                    {editingId ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <button onClick={resetForm} className="w-9 h-9 bg-white border border-gray-200 text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center transition"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                    {/* ── LEFT COLUMN ── */}
                                    <div className="space-y-6">
                                        {/* General Images */}
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ImageIcon size={14} /> Fotos Generales</label>
                                            <div className="grid gap-3 grid-cols-3">
                                                {form.previewImages.map((img, i) => (
                                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                                                        <img src={img} className="w-full h-full object-contain bg-gray-50" alt="" />
                                                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                                                    </div>
                                                ))}
                                                <label 
                                                    onDragOver={(e) => { e.preventDefault(); setDraggingGeneral(true); }}
                                                    onDragLeave={() => setDraggingGeneral(false)}
                                                    onDrop={handleGeneralDrop}
                                                    className={`aspect-square rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center cursor-pointer ${draggingGeneral ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30 text-gray-400 hover:text-blue-500'}`}>
                                                    <Plus size={24} /><span className="text-xs font-bold mt-1 text-center px-2">Añadir o<br/>Soltar</span>
                                                    <input type="file" onChange={handleFilesSelect} accept="image/*" multiple className="hidden" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Colors */}
                                        <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl">
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Palette size={14} /> Colores disponibles</label>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {form.colors.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                                                        <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c.hex }} />
                                                        <span className="text-sm font-bold">{c.name}</span>
                                                        <button type="button" onClick={() => removeColor(i)} className="text-gray-300 hover:text-red-500 ml-1"><X size={14} /></button>
                                                    </div>
                                                ))}
                                                {form.colors.length === 0 && <span className="text-xs text-gray-400 bg-white px-3 py-2 rounded-xl border border-gray-100">Sin colores aún</span>}
                                            </div>
                                            <div className="flex gap-2 bg-white p-2 rounded-xl border border-gray-200">
                                                <button type="button" onClick={pickColor} title="Cuentagotas (Seleccionar de foto)" className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"><Palette size={16} /></button>
                                                <input type="color" value={colorInput.hex} onChange={e => setColorInput(p => ({ ...p, hex: e.target.value }))} className="w-10 h-10 rounded-lg border-none cursor-pointer p-0" />
                                                <input type="text" placeholder="Nombre del color..." value={colorInput.name} onChange={e => setColorInput(p => ({ ...p, name: e.target.value }))} className="flex-1 text-sm font-bold bg-transparent outline-none px-2" />
                                                <button type="button" onClick={addColor} className="bg-gray-900 text-white text-sm font-black px-4 rounded-lg hover:bg-blue-600 transition">+</button>
                                            </div>
                                        </div>

                                        {/* Color-specific images */}
                                        {form.colorImages.length > 0 && (
                                            <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl">
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ImageIcon size={14} /> Fotos por Color</label>
                                                <div className="flex gap-2 mb-4 flex-wrap">
                                                    {form.colorImages.map((ci, i) => (
                                                        <button key={i} type="button" onClick={() => setActiveColorImg(activeColorImg === i ? null : i)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition ${activeColorImg === i ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                                                            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: ci.colorHex }} />{ci.colorName}
                                                        </button>
                                                    ))}
                                                </div>
                                                {activeColorImg !== null && form.colorImages[activeColorImg] && (
                                                    <div>
                                                        <div className="grid gap-2 grid-cols-3">
                                                            {form.colorImages[activeColorImg].images.map((img, i) => (
                                                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                                                    <img src={img} className="w-full h-full object-contain bg-white" alt="" />
                                                                    <button type="button" onClick={() => removeColorImage(activeColorImg, i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><X size={10} /></button>
                                                                </div>
                                                            ))}
                                                            <label 
                                                                onDragOver={(e) => { e.preventDefault(); setDraggingColorIdx(activeColorImg); }}
                                                                onDragLeave={() => setDraggingColorIdx(null)}
                                                                onDrop={(e) => handleColorDrop(activeColorImg, e)}
                                                                className={`aspect-square rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center cursor-pointer ${draggingColorIdx === activeColorImg ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30 text-gray-400'}`}>
                                                                <Plus size={20} /><span className="text-[10px] font-bold mt-0.5 text-center px-1 leading-tight">Añadir o<br/>Soltar</span>
                                                                <input type="file" onChange={(e) => handleColorFiles(activeColorImg, e)} accept="image/*" multiple className="hidden" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* ── RIGHT COLUMN ── */}
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nombre del Producto *</label>
                                            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ej: ALEJANDRO" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 px-5 py-3.5 rounded-2xl font-black text-lg outline-none transition" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Marca</label>
                                                <input type="text" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} placeholder="Palazzo" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 px-4 py-3 rounded-2xl font-bold outline-none transition text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Categoría *</label>
                                                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 px-4 py-3 rounded-2xl font-bold outline-none transition text-sm appearance-none">
                                                    <option value="monturas">Montura</option>
                                                    <option value="lentes">Lente Solar</option>
                                                    <option value="accesorios">Accesorio</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Público</label>
                                                <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 px-4 py-3 rounded-2xl font-bold outline-none transition text-sm appearance-none">
                                                    <option value="unisex">Unisex</option>
                                                    <option value="hombre">Caballeros</option>
                                                    <option value="mujer">Damas</option>
                                                    <option value="ninos">Niños</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Forma</label>
                                                <select value={form.frameShape} onChange={e => setForm(p => ({ ...p, frameShape: e.target.value }))} className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 px-4 py-3 rounded-2xl font-bold outline-none transition text-sm appearance-none">
                                                    <option value="">Seleccionar...</option>
                                                    {FRAME_SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Material</label>
                                            <input type="text" value={form.material} onChange={e => setForm(p => ({ ...p, material: e.target.value }))} placeholder="Ej: Acetato, Metal, TR90..." className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 px-4 py-3 rounded-2xl font-bold outline-none transition text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Descripción</label>
                                            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descripción del producto, características principales..." rows="3" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 px-4 py-3 rounded-2xl font-semibold outline-none transition resize-none text-sm leading-relaxed" />
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Tag size={12} /> Etiquetas</label>
                                            <div className="flex flex-wrap gap-2">
                                                {TAG_OPTIONS.map(tag => (
                                                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition capitalize ${form.tags.includes(tag) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-400'}`}>{tag}</button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Specifications */}
                                        <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl">
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Especificaciones Técnicas</label>
                                            {form.specifications.length > 0 && (
                                                <div className="mb-4 space-y-2">
                                                    {form.specifications.map(([k, v], i) => (
                                                        <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 text-sm">
                                                            <span className="font-black text-gray-700 min-w-[100px]">{k}:</span>
                                                            <span className="text-gray-600 flex-1">{v}</span>
                                                            <button type="button" onClick={() => removeSpec(i)} className="text-gray-300 hover:text-red-500"><X size={14} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Clave (ej: Material)" value={specInput.key} onChange={e => setSpecInput(p => ({ ...p, key: e.target.value }))} className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-bold outline-none focus:border-blue-400" />
                                                <input type="text" placeholder="Valor (ej: Acetato)" value={specInput.value} onChange={e => setSpecInput(p => ({ ...p, value: e.target.value }))} className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-semibold outline-none focus:border-blue-400" />
                                                <button type="button" onClick={addSpec} className="bg-gray-900 text-white px-3 py-2 rounded-xl font-black text-sm hover:bg-blue-600 transition">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Footer */}
                                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                                    <button type="button" onClick={resetForm} className="px-7 py-3.5 font-black rounded-2xl text-gray-500 hover:bg-gray-100 transition">Cancelar</button>
                                    <button type="submit" disabled={isLoading} className="px-10 py-3.5 font-black rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition disabled:opacity-50 flex gap-2 items-center">
                                        {isLoading ? <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={20} />}
                                        {editingId ? 'Guardar Cambios' : 'Crear Producto'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
