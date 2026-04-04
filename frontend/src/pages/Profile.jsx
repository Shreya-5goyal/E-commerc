import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, User as UserIcon, MapPin, Settings, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

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

        fetchProfileData();
    }, [user, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) return (
        <div className="loading-wrapper"><div className="spinner"></div><p>Loading profile info...</p></div>
    );

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div className="section-header">
                <h1 className="section-title">Your Account</h1>
            </div>

            <div className="cart-layout">
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="card" style={{ padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 800, fontSize: '1.5rem' }}>
                                {user.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user.username}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Client ID: #{user.id}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <button 
                                onClick={() => setActiveTab('orders')}
                                className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                                style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}
                            >
                                <Package size={18} /> Orders
                            </button>
                            <button 
                                onClick={() => setActiveTab('addresses')}
                                className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                                style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}
                            >
                                <MapPin size={18} /> Addresses
                            </button>
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                                style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}
                            >
                                <Settings size={18} /> Settings
                            </button>
                        </div>
                        <div className="divider" />
                        <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%', textAlign: 'left', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 12 }}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="cart-main">
                    {activeTab === 'orders' && (
                        <div className="animate-in">
                            <h2 style={{ marginBottom: 20, fontSize: '1.3rem' }}>Your Orders</h2>
                            {orders.length === 0 ? (
                                <div className="empty-state">
                                    <ShoppingBag size={48} />
                                    <h3>No orders yet</h3>
                                    <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Start Shopping</Link>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.orderId} className="order-card" id={`order-${order.orderId}`}>
                                        <div className="order-card-header">
                                            <div style={{ display: 'flex', gap: 24 }}>
                                                <div>
                                                    <span className="label">Order Placed</span>
                                                    <span className="value">{new Date(order.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <div>
                                                    <span className="label">Total</span>
                                                    <span className="value">₹{order.totalAmount.toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span className="label">Ship To</span>
                                                    <span className="value">{order.addressId ? `Addr ID: ${order.addressId}` : 'Main Address'}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="label">Order # {order.orderId}</span>
                                                <span className="badge badge-info" style={{ display: 'block', marginTop: 4 }}>{order.orderStatus}</span>
                                            </div>
                                        </div>
                                        <div className="order-card-body">
                                            {order.orderItems?.map(item => (
                                                <div key={item.orderItemId} style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                                    <div style={{ flex: 1, display: 'flex', gap: 12 }}>
                                                        <div style={{ width: 64, height: 64, background: 'var(--surface-3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyCenter: 'center', overflow: 'hidden' }}>
                                                            {item.product?.image ? <img src={`/api/images/${item.product.image}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={24} color="var(--text-muted)" />}
                                                        </div>
                                                        <div>
                                                            <Link to={item.product ? `/product/${item.product.productId}` : '#'} style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.9rem' }}>
                                                                {item.product?.productName || 'Product Info Unavailable'}
                                                            </Link>
                                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Buy it again</button>
                                                        {item.product && <Link to={`/product/${item.product.productId}`} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Rate product</Link>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="animate-in">
                            <div className="section-header">
                                <h2 style={{ fontSize: '1.3rem' }}>Your Addresses</h2>
                                <button className="btn btn-secondary">+ Add New</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
                                {addresses.map(addr => (
                                    <div key={addr.addressId} className="card" style={{ padding: 20 }}>
                                        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{addr.buildingName}</div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{addr.street}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{addr.country}</p>
                                        <div className="divider" />
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button className="btn-ghost" style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>Edit</button>
                                            <button className="btn-ghost" style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="card animate-in" style={{ padding: 32 }}>
                            <h3>Profile Settings</h3>
                            <div className="divider" />
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label>Username</label>
                                <input className="form-control" value={user.username} readOnly />
                            </div>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label>Email address</label>
                                <input className="form-control" placeholder="Update your email" />
                            </div>
                            <button className="btn btn-secondary">Save Changes</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
