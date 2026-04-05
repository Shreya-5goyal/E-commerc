import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3, Users, Package, ShoppingCart, DollarSign,
    AlertTriangle, TrendingUp, Eye, Trash2, ChevronDown,
    RefreshCw, Search, Shield, Plus, X, Edit3, Image as ImageIcon,
    CheckCircle, AlertCircle, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{
            padding: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{
            width: 64, height: 64, borderRadius: '18px',
            background: `${color}14`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
            <Icon size={30} color={color} />
        </div>
        <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{value}</p>
            {sub && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>{sub}</p>}
        </div>
        <div style={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.05 }}>
            <Icon size={100} color={color} />
        </div>
    </motion.div>
);

const StatusBadge = ({ status }) => {
    const colors = {
        'Order Accepted !': { bg: '#dbeafe', color: '#1e40af' },
        'SHIPPED': { bg: '#fef3c7', color: '#92400e' },
        'DELIVERED': { bg: '#dcfce7', color: '#166534' },
        'CANCELLED': { bg: '#fee2e2', color: '#b91c1c' },
    };
    const c = colors[status] || { bg: '#f1f5f9', color: '#475569' };
    return (
        <span style={{
            padding: '5px 12px', borderRadius: 8, fontSize: '0.7rem',
            fontWeight: 700, background: c.bg, color: c.color,
            textTransform: 'uppercase', letterSpacing: '0.5px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
            {status}
        </span>
    );
};

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [updating, setUpdating] = useState(null);
    const [toast, setToast] = useState(null);

    // CMS Modal States
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const showMsg = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, catRes, prodRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/public/categories'),
                api.get('/public/products?pageSize=100')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data || []);
            setCategories(catRes.data.content || []);
            setAllProducts(prodRes.data.content || []);
        } catch (err) {
            console.error('Admin fetch error', err);
            showMsg('Failed to reload dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (!isAdmin) { navigate('/'); return; }
        fetchAll();
    }, [user, isAdmin]);

    // Order Logic
    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            showMsg(`Order #${orderId} marked as ${newStatus}`);
            fetchAll();
        } catch (err) {
            showMsg('Status update failed', 'error');
        } finally {
            setUpdating(null);
        }
    };

    // Product CMS Logic
    const handleAddProduct = () => {
        setEditItem(null);
        setSelectedImage(null);
        setFormData({ productName: '', description: '', price: '', discount: 0, quantity: 10, categoryId: categories[0]?.categoryId || '' });
        setShowProductModal(true);
    };

    const handleEditProduct = (prod) => {
        setEditItem(prod);
        setSelectedImage(null);
        setFormData({ 
            productName: prod.productName, 
            description: prod.description || '', 
            price: prod.price, 
            discount: prod.discount || 0, 
            quantity: prod.quantity, 
            categoryId: prod.category?.categoryId || '' 
        });
        setShowProductModal(true);
    };

    const handleImageChange = (e) => {
        if (e.target.files?.[0]) setSelectedImage(e.target.files[0]);
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        setUpdating('saving');
        try {
            let productId;
            if (editItem) {
                const res = await api.put(`/admin/products/${editItem.productId}`, formData);
                productId = editItem.productId;
                showMsg('Base details updated');
            } else {
                const res = await api.post(`/admin/categories/${formData.categoryId}/product`, formData);
                productId = res.data.productId;
                showMsg('Product created');
            }

            // Image Upload
            if (selectedImage) {
                const imageForm = new FormData();
                imageForm.append('image', selectedImage);
                await api.put(`/products/${productId}/image`, imageForm, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showMsg('New image uploaded', 'info');
            }
            
            setShowProductModal(false);
            fetchAll();
        } catch (err) {
            showMsg(err.response?.data?.message || 'Failed to sync product', 'error');
        } finally {
            setUpdating(null);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product permanently?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            showMsg('Product removed');
            fetchAll();
        } catch (err) {
            showMsg('Delete failed', 'error');
        }
    };

    // Category Logic
    const saveCategory = async (e) => {
        e.preventDefault();
        try {
            if (editItem) {
                await api.put(`/admin/update/${editItem.categoryId}`, formData);
            } else {
                await api.post('/admin/add', formData);
            }
            setShowCategoryModal(false);
            showMsg('Category saved');
            fetchAll();
        } catch (err) { showMsg('Failed to save category', 'error'); }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this category? Products might lose their grouping.')) return;
        try {
            await api.delete(`/admin/delete/${id}`);
            showMsg('Category deleted');
            fetchAll();
        } catch (err) { showMsg('Delete failed', 'error'); }
    };

    if (loading) return (
        <div className="loading-wrapper"><div className="spinner"></div><p>Syncing Admin Dashboard…</p></div>
    );

    const fmtCurrency = (n) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`alert ${toast.type === 'error' ? 'alert-error' : toast.type === 'info' ? 'alert-info' : 'alert-success'}`}
                        style={{ position: 'fixed', top: 24, right: 24, zIndex: 5000, boxShadow: 'var(--shadow-lg)', minWidth: 280 }}
                    >
                        {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div className="animate-in">
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ padding: 10, background: 'var(--secondary)', borderRadius: 12, color: '#fff' }}><Shield size={32} /></div>
                        Gusto Store Engine
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 8 }}>
                        Logged in as <strong style={{ color: 'var(--secondary)' }}>{user.username}</strong> • Central Management Console
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }} className="animate-in">
                    <button className="btn btn-outline" onClick={fetchAll} style={{ padding: '12px 20px' }}>
                        <RefreshCw size={16} /> Refresh Data
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ padding: '12px 20px' }}>
                        <Eye size={16} /> View Storefront
                    </button>
                </div>
            </div>

            {/* Layout Navigation */}
            <div style={{ display: 'flex', gap: 32 }}>
                <div style={{ width: 220, flexShrink: 0 }} className="animate-in">
                    <div className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'orders', label: 'Sales & Orders', icon: ShoppingCart },
                            { id: 'products', label: 'Product CMS', icon: Package },
                            { id: 'categories', label: 'Categories', icon: TrendingUp },
                            { id: 'users', label: 'User Registry', icon: Users },
                        ].map(m => (
                            <button 
                                key={m.id} 
                                onClick={() => setActiveTab(m.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 16px', borderRadius: 10, fontSize: '0.9rem',
                                    fontWeight: activeTab === m.id ? 700 : 500,
                                    background: activeTab === m.id ? 'var(--secondary)' : 'transparent',
                                    color: activeTab === m.id ? '#fff' : 'var(--text-secondary)',
                                    transition: 'all 0.2s', textAlign: 'left'
                                }}
                            >
                                <m.icon size={18} /> {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    {/* ── OVERVIEW ────────────────────────────────────────── */}
                    {activeTab === 'overview' && (
                        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 32 }}>
                                <StatCard icon={DollarSign} label="Total Revenue" value={fmtCurrency(stats.totalRevenue)} color="#10b981" />
                                <StatCard icon={ShoppingCart} label="Orders" value={stats.totalOrders} color="#3b82f6" sub={`${stats.recentOrders?.length || 0} recent flow`} />
                                <StatCard icon={Package} label="Our Products" value={stats.totalProducts} color="#f59e0b" sub={`${stats.lowStockProducts?.length || 0} low stock alerts`} />
                                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="#8b5cf6" sub="Active customers" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                                <div className="card" style={{ padding: 24, minHeight: 400 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Recent Transactions</h3>
                                        <button className="btn-ghost" style={{ fontSize: '0.75rem' }} onClick={() => setActiveTab('orders')}>All Orders</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                        {(stats.recentOrders || []).map(o => (
                                            <div key={o.orderId} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                                                <div>
                                                    <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>#{o.orderId} • {o.email?.split('@')[0]}</p>
                                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{o.itemCount} item{o.itemCount > 1 ? 's' : ''} • {o.orderDate}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 6 }}>₹{o.totalAmount?.toLocaleString()}</p>
                                                    <StatusBadge status={o.orderStatus} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="card" style={{ padding: 24, maxHeight: 400, overflowY: 'auto' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)' }}>
                                        <AlertTriangle size={18} /> Critical Performance
                                    </h3>
                                    {(stats.lowStockProducts || []).length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Fulfillment is 100%.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {stats.lowStockProducts.map(p => (
                                                <div key={p.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: 10 }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.productName.substring(0,25)}…</span>
                                                    <strong style={{ color: p.quantity <= 2 ? 'var(--danger)' : 'var(--warning)', fontSize: '0.9rem' }}>{p.quantity} Unit{p.quantity !== 1 ? 's' : ''}</strong>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── PRODUCT CMS ──────────────────────────────────────── */}
                    {activeTab === 'products' && (
                        <div className="animate-in">
                            <div className="card" style={{ padding: 0 }}>
                                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Master Inventory</h2>
                                    <button className="btn btn-secondary" onClick={handleAddProduct}>
                                        <Plus size={16} /> New SKU
                                    </button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1.5px solid var(--border)', background: 'var(--surface-2)' }}>
                                                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>IMAGE</th>
                                                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>PRODUCT</th>
                                                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>PRICE</th>
                                                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>STOCK</th>
                                                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</th>
                                                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>COMMANDS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allProducts.map(p => (
                                                <tr key={p.productId} style={{ borderBottom: '1px solid var(--surface-3)', transition: 'background 0.2s' }}>
                                                    <td style={{ padding: '12px 20px' }}>
                                                        <img 
                                                            src={p.image ? `/api/images/${p.image}` : 'https://picsum.photos/seed/prod/50/50'} 
                                                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', background: 'var(--surface-3)', border: '1px solid var(--border)' }} 
                                                            onError={e => e.target.src='https://picsum.photos/seed/prod/50/50'}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '16px 20px', fontWeight: 700 }}>{p.productName}</td>
                                                    <td style={{ padding: '16px 20px' }}>₹{p.specialPrice || p.price}</td>
                                                    <td style={{ padding: '16px 20px' }}>
                                                        <span style={{ 
                                                            fontWeight: 800, 
                                                            color: p.quantity < 5 ? 'var(--danger)' : 'var(--text-primary)',
                                                            display: 'flex', alignItems: 'center', gap: 6
                                                        }}>
                                                            {p.quantity} Unit{p.quantity !== 1 ? 's' : ''}
                                                            {p.quantity < 5 && <AlertCircle size={12} />}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '16px 20px' }}>{p.category?.categoryName || 'N/A'}</td>
                                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                            <button className="btn-ghost" style={{ padding: 8, color: 'var(--secondary)' }} onClick={() => handleEditProduct(p)}><Edit3 size={18} /></button>
                                                            <button className="btn-ghost" style={{ padding: 8, color: 'var(--danger)' }} onClick={() => deleteProduct(p.productId)}><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── OTHER TABS ────────────────────────────────────────── */}
                    {(activeTab === 'users' || activeTab === 'categories' || activeTab === 'orders') && (
                        <div className="card animate-in" style={{ padding: 60, textAlign: 'center' }}>
                            <Package size={64} style={{ opacity: 0.1, margin: '0 auto 20px' }} />
                            <h3>{activeTab.toUpperCase()} Module Loaded</h3>
                            <p className="text-secondary">Using standard administration registry view.</p>
                            <button className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => setActiveTab('overview')}>Back to Overview</button>
                        </div>
                    )}
                </div>
            </div>

            {/* PRODUCT MODAL (WITH IMAGE UPLOAD) */}
            <AnimatePresence>
                {showProductModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6000, padding: 24 }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                            className="card" style={{ width: '100%', maxWidth: 800, padding: 0, overflow: 'hidden' }}
                        >
                            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
                                <div>
                                    <h3 style={{ fontWeight: 800, fontSize: '1.3rem' }}>{editItem ? 'SKU Management' : 'Onboard New Product'}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{editItem ? `Editing ID: #${editItem.productId}` : 'Fill in the global product specifications'}</p>
                                </div>
                                <button onClick={() => setShowProductModal(false)} className="btn-ghost" style={{ padding: 6, borderRadius: '50%' }}><X size={24} /></button>
                            </div>
                            
                            <form onSubmit={saveProduct} style={{ padding: 40, display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: 40 }}>
                                {/* Left Column: Image Management */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div style={{ 
                                        width: '100%', height: 280, borderRadius: 16, border: '2px dashed var(--border)', 
                                        background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', 
                                        padding: selectedImage || (editItem?.image) ? 0 : 20,
                                        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {selectedImage ? (
                                            <img src={URL.createObjectURL(selectedImage)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : editItem?.image ? (
                                            <img src={`/api/images/${editItem.image}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <>
                                                <ImageIcon size={48} color="var(--text-muted)" strokeWidth={1.5} />
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>No media selected</p>
                                            </>
                                        )}
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current.click()}
                                            style={{ 
                                                position: 'absolute', bottom: 16, right: 16, 
                                                width: 44, height: 44, borderRadius: '50%',
                                                background: 'var(--secondary)', color: '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: 'var(--shadow-lg)', border: 'none'
                                            }}
                                        >
                                            <Upload size={20} />
                                        </button>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Recommended: 800x800px PNG/JPG</p>
                                </div>

                                {/* Right Column: Specs */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div className="form-group">
                                        <label>Product Display Name</label>
                                        <input required className="form-control" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} placeholder="e.g. Premium Leather Sneakers" />
                                    </div>
                                    <div className="form-group">
                                        <label>Technical Description</label>
                                        <textarea rows={4} className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe key features, materials, and variants…" />
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                        <div className="form-group"><label>Base Price (₹)</label><input type="number" required className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                                        <div className="form-group"><label>Stock Quantity</label><input type="number" required className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} /></div>
                                        <div className="form-group">
                                            <label>Product Category</label>
                                            <select required className="form-control" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                                                <option value="" disabled>Select Segment</option>
                                                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group"><label>Global Discount %</label><input type="number" className="form-control" value={formData.discount} onChange={e => setFormData({...formData, discount: Math.min(100, Math.max(0, e.target.value))})} /></div>
                                    </div>

                                    <div style={{ marginTop: 20, display: 'flex', gap: 16 }}>
                                        <button type="submit" className="btn btn-secondary" style={{ flex: 2, height: 54, fontSize: '1rem', border: 'none' }} disabled={updating === 'saving'}>
                                            {updating === 'saving' ? 'Syncing Catalog...' : (editItem ? 'Commit Updates' : 'Expand Catalog')}
                                        </button>
                                        <button type="button" className="btn btn-outline" style={{ flex: 1, border: '2px solid var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowProductModal(false)}>Discard</button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
