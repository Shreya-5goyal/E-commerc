import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, User as UserIcon, MapPin, Settings, ChevronRight, ShoppingBag, Trash2, Edit2, X, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Address Modal/Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        buildingName: '', street: '', city: '', state: '', country: '', pincode: ''
    });

    const showMsg = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProfileData = async () => {
        try {
            const [ordersRes, addrRes] = await Promise.all([
                api.get('/users/orders'),
                api.get('/users/addresses')
            ]);
            setOrders(ordersRes.data || []);
            setAddresses(addrRes.data || []);
        } catch (err) {
            console.error("Error fetching profile data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfileData();
    }, [user, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddressId) {
                await api.put(`/addresses/${editingAddressId}`, addressForm);
                showMsg('Address updated successfully');
            } else {
                await api.post('/addresses', addressForm);
                showMsg('Address added successfully');
            }
            setShowAddressForm(false);
            setEditingAddressId(null);
            setAddressForm({ buildingName: '', street: '', city: '', state: '', country: '', pincode: '' });
            fetchProfileData();
        } catch (err) {
            showMsg('Failed to save address', 'error');
        }
    };

    const handleEditAddress = (addr) => {
        setAddressForm({
            buildingName: addr.buildingName,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            pincode: addr.pincode
        });
        setEditingAddressId(addr.addressId);
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Delete this address?')) return;
        try {
            await api.delete(`/addresses/${id}`);
            showMsg('Address deleted');
            fetchProfileData();
        } catch (err) {
            showMsg('Failed to delete address', 'error');
        }
    };

    if (loading) return (
        <div className="loading-wrapper"><div className="spinner"></div><p>Loading profile info...</p></div>
    );

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            {toast && (
                <div className={`alert ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`} 
                     style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, boxShadow: 'var(--shadow-lg)' }}>
                    {toast.msg}
                </div>
            )}

            <div className="section-header">
                <h1 className="section-title">Account Center</h1>
                <p className="text-secondary">Manage your orders and preferences</p>
            </div>

            <div className="cart-layout">
                {/* Sidebar */}
                <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                            <div style={{ 
                                width: 56, height: 56, borderRadius: '16px', 
                                background: 'linear-gradient(135deg, var(--secondary) 0%, #3b82f6 100%)', 
                                color: '#fff', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem',
                                boxShadow: '0 4px 12px rgba(29,78,216,0.2)'
                            }}>
                                {user.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2 }}>{user.username}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>ID: {user.id}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button 
                                onClick={() => setActiveTab('orders')}
                                className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                                style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: activeTab === 'orders' ? 'var(--surface-3)' : 'transparent', borderBottom: 'none' }}
                            >
                                <Package size={18} /> Orders
                            </button>
                            <button 
                                onClick={() => setActiveTab('addresses')}
                                className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                                style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: activeTab === 'addresses' ? 'var(--surface-3)' : 'transparent', borderBottom: 'none' }}
                            >
                                <MapPin size={18} /> Addresses
                            </button>
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                                style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: activeTab === 'settings' ? 'var(--surface-3)' : 'transparent', borderBottom: 'none' }}
                            >
                                <Settings size={18} /> Profile Settings
                            </button>
                        </div>
                        <div className="divider" style={{ margin: '20px 0' }} />
                        <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%', textAlign: 'left', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 8 }}>
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="cart-main">
                    {/* ── ORDERS TAB ────────────────────────────────────────── */}
                    {activeTab === 'orders' && (
                        <div className="animate-in">
                            <h2 style={{ marginBottom: 24, fontSize: '1.4rem', fontWeight: 700 }}>Orders History</h2>
                            {orders.length === 0 ? (
                                <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                                    <ShoppingBag size={64} color="var(--border-strong)" style={{ margin: '0 auto 24px' }} />
                                    <h3 style={{ marginBottom: 12 }}>No orders placed yet</h3>
                                    <p className="text-secondary" style={{ marginBottom: 32 }}>Your recent purchases will appear here.</p>
                                    <Link to="/" className="btn btn-secondary">Explore Products</Link>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.orderId} className="order-card" id={`order-${order.orderId}`}>
                                        <div className="order-card-header">
                                            <div style={{ display: 'flex', gap: 32 }}>
                                                <div>
                                                    <span className="label">Order Placed</span>
                                                    <span className="value" style={{ display: 'block', marginTop: 4 }}>
                                                        {new Date(order.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="label">Total Amount</span>
                                                    <span className="value" style={{ display: 'block', marginTop: 4, color: 'var(--text-primary)', fontWeight: 700 }}>
                                                        ₹{order.totalAmount.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="label">Order # {order.orderId}</span>
                                                <div style={{ marginTop: 6 }}>
                                                    <span className="badge badge-info">{order.orderStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="order-card-body">
                                            {order.orderItems?.map(item => (
                                                <div key={item.orderItemId} style={{ display: 'flex', gap: 20, marginBottom: 16, pb: 16, borderBottom: '1px solid var(--surface-3)' }}>
                                                    <div style={{ 
                                                        width: 72, height: 72, background: 'var(--surface-2)', 
                                                        borderRadius: 10, display: 'flex', alignItems: 'center', 
                                                        justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border)' 
                                                    }}>
                                                        <img 
                                                            src={item.product?.image ? `/api/images/${item.product.image}` : 'https://picsum.photos/seed/prod/100/100'} 
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} 
                                                            onError={(e) => { e.target.src = 'https://picsum.photos/seed/fallback/100/100'; }}
                                                        />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <Link to={item.product ? `/product/${item.product.productId}` : '#'} 
                                                              style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', display: 'block', marginBottom: 4 }}>
                                                            {item.product?.productName || 'Global Product'}
                                                        </Link>
                                                        <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                            <span>Qty: <strong>{item.quantity}</strong></span>
                                                            <span>Price: <strong>₹{item.orderedProductPrice.toFixed(2)}</strong></span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Link to={item.product ? `/product/${item.product.productId}` : '#'} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '8px 16px' }}>
                                                            Buy it again
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ── ADDRESSES TAB ─────────────────────────────────────── */}
                    {activeTab === 'addresses' && (
                        <div className="animate-in">
                            <div className="section-header" style={{ borderBottom: 'none', marginBottom: 20 }}>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Saved Addresses</h2>
                                <button className="btn btn-secondary" onClick={() => { setEditingAddressId(null); setShowAddressForm(true); }}>
                                    + Add New Address
                                </button>
                            </div>

                            {showAddressForm && (
                                <div className="card" style={{ padding: 28, marginBottom: 32, border: '1.5px solid var(--secondary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                        <h3 style={{ fontSize: '1.1rem' }}>{editingAddressId ? 'Update Address' : 'New Delivery Address'}</h3>
                                        <button onClick={() => setShowAddressForm(false)} className="btn-ghost" style={{ padding: 4 }}><X size={20} /></button>
                                    </div>
                                    <form onSubmit={handleAddressSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div className="form-group"><label>Building / House Name</label><input required className="form-control" value={addressForm.buildingName} onChange={e => setAddressForm({...addressForm, buildingName: e.target.value})} /></div>
                                        <div className="form-group"><label>Street / Locality</label><input required className="form-control" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} /></div>
                                        <div className="form-group"><label>City</label><input required className="form-control" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} /></div>
                                        <div className="form-group"><label>State</label><input required className="form-control" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} /></div>
                                        <div className="form-group"><label>Country</label><input required className="form-control" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} /></div>
                                        <div className="form-group"><label>Pincode</label><input required className="form-control" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} /></div>
                                        <div style={{ gridColumn: 'span 2', marginTop: 12 }}>
                                            <button type="submit" className="btn btn-secondary" style={{ width: '100%', height: 46 }}>
                                                {editingAddressId ? 'Save Changes' : 'Add Address'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {addresses.length === 0 && !showAddressForm ? (
                                <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                                    <MapPin size={48} color="var(--border-strong)" style={{ margin: '0 auto 16px' }} />
                                    <p className="text-secondary">No addresses saved.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                                    {addresses.map(addr => (
                                        <div key={addr.addressId} className="card" style={{ padding: 24, position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{addr.buildingName}</div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={() => handleEditAddress(addr)} className="btn-ghost" style={{ padding: 4, color: 'var(--secondary)' }} title="Edit"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteAddress(addr.addressId)} className="btn-ghost" style={{ padding: 4, color: 'var(--danger)' }} title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p style={{ fontWeight: 600, marginTop: 4 }}>{addr.country}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SETTINGS TAB ──────────────────────────────────────── */}
                    {activeTab === 'settings' && (
                        <div className="animate-in">
                            <h2 style={{ marginBottom: 24, fontSize: '1.4rem', fontWeight: 700 }}>Profile Security</h2>
                            <div className="card" style={{ padding: 32 }}>
                                <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: 280 }}>
                                        <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>Personal Information</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                            <div className="form-group">
                                                <label>Username (used for login)</label>
                                                <div className="form-control" style={{ background: 'var(--surface-2)', cursor: 'not-allowed' }}>{user.username}</div>
                                            </div>
                                            <div className="form-group">
                                                <label>Public Name</label>
                                                <input className="form-control" defaultValue={user.username} />
                                            </div>
                                            <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>Update Profile</button>
                                        </div>
                                    </div>
                                    <div style={{ width: '1px', background: 'var(--border)', margin: '0 10px' }} />
                                    <div style={{ flex: 1, minWidth: 280 }}>
                                        <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>Security</h4>
                                        <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                                For your security, we recommend changing your password regularily.
                                            </p>
                                            <button className="btn btn-outline" style={{ width: '100%' }}>Change Password</button>
                                        </div>
                                        <div style={{ marginTop: 24, padding: 20, background: '#fee2e2', borderRadius: 12 }}>
                                            <h5 style={{ color: '#991b1b', marginBottom: 8 }}>Danger Zone</h5>
                                            <button className="btn btn-danger" style={{ width: '100%', border: 'none' }}>Delete Account</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
