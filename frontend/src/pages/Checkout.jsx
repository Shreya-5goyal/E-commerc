import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, CreditCard, ChevronRight, CheckCircle, Package } from 'lucide-react';

const Checkout = () => {
    const { cart, fetchCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const [orderDone, setOrderDone] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAddresses();
    }, [user, navigate]);

    const fetchAddresses = async () => {
        try {
            const res = await api.get('/users/addresses');
            setAddresses(res.data || []);
            if (res.data?.length > 0) {
                setSelectedAddress(res.data[0].addressId);
            }
        } catch (err) {
            console.error("Error fetching addresses:", err);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) return;
        setLoading(true);
        try {
            const orderRequest = {
                addressId: selectedAddress,
                pgName: "GustoGateway",
                pgPaymentId: "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
                pgStatus: "SUCCESS",
                pgResponseMessage: "Payment processed successfully"
            };

            const res = await api.post(`/order/users/payments/${paymentMethod}`, orderRequest);
            setOrderDone(res.data);
            await fetchCart(); // Clear local cart
        } catch (err) {
            console.error("Error placing order:", err);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (orderDone) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <div className="card animate-in" style={{ padding: '60px 40px', maxWidth: '600px', margin: '0 auto' }}>
                    <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 24px' }} />
                    <h1 style={{ marginBottom: 16 }}>Order Placed!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
                        Your order <strong>#{orderDone.orderId}</strong> has been successfully placed.
                        We'll send you a confirmation email shortly.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <button onClick={() => navigate('/profile')} className="btn btn-secondary">View Orders</button>
                        <button onClick={() => navigate('/')} className="btn btn-outline">Continue Shopping</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || cart.products.length === 0) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h3>Your cart is empty</h3>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: 20 }}>Go Shopping</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ marginBottom: 32, fontFamily: 'Outfit, sans-serif' }}>Checkout</h1>

            <div className="checkout-steps">
                <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
                    1. Address
                </div>
                <div className={`step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
                    2. Payment
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    3. Review
                </div>
            </div>

            <div className="cart-layout">
                <div className="cart-main">
                    {step === 1 && (
                        <div className="card animate-in" style={{ padding: 24 }}>
                            <div className="section-header">
                                <h2 className="section-title">Select Delivery Address</h2>
                                <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>+ Add New</button>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginTop: 20 }}>
                                {addresses.map(addr => (
                                    <div 
                                        key={addr.addressId} 
                                        className={`address-card ${selectedAddress === addr.addressId ? 'selected' : ''}`}
                                        onClick={() => setSelectedAddress(addr.addressId)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontWeight: 700 }}>{addr.buildingName}</span>
                                            {selectedAddress === addr.addressId && <CheckCircle size={18} color="var(--secondary)" />}
                                        </div>
                                        <p>{addr.street}</p>
                                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                        <p>{addr.country}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 32, textAlign: 'right' }}>
                                <button 
                                    className="btn btn-secondary" 
                                    disabled={!selectedAddress}
                                    onClick={() => setStep(2)}
                                >
                                    Use this address <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="card animate-in" style={{ padding: 24 }}>
                            <h2 className="section-title" style={{ marginBottom: 24 }}>Select Payment Method</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {['UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'].map(method => (
                                    <div 
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        style={{ 
                                            padding: '16px 20px', 
                                            borderRadius: 'var(--radius)', 
                                            border: '1.5px solid',
                                            borderColor: paymentMethod === method ? 'var(--secondary)' : 'var(--border)',
                                            background: paymentMethod === method ? '#eff6ff' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 16,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ 
                                            width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--secondary)',
                                            display: 'flex', alignItems: 'center', justifyCenter: 'center'
                                        }}>
                                            {paymentMethod === method && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--secondary)' }} />}
                                        </div>
                                        <CreditCard size={20} />
                                        <span style={{ fontWeight: 600 }}>{method}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                                <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                                <button className="btn btn-secondary" onClick={() => setStep(3)}>
                                    Continue to Review <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="card animate-in" style={{ padding: 24 }}>
                            <h2 className="section-title" style={{ marginBottom: 24 }}>Review Your Order</h2>
                            
                            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Delivery Address</h4>
                                    {addresses.find(a => a.addressId === selectedAddress) && (
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <p style={{ fontWeight: 600 }}>{addresses.find(a => a.addressId === selectedAddress).buildingName}</p>
                                            <p>{addresses.find(a => a.addressId === selectedAddress).street}</p>
                                            <p>{addresses.find(a => a.addressId === selectedAddress).city}, {addresses.find(a => a.addressId === selectedAddress).pincode}</p>
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Payment Method</h4>
                                    <p style={{ fontWeight: 600 }}>{paymentMethod}</p>
                                </div>
                            </div>

                            <div className="divider" />

                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>Items in your order</h4>
                            {cart.products.map(item => (
                                <div key={item.productId} style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                    <img src={item.image ? `/api/images/${item.image}` : 'https://placehold.co/50x50'} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem' }}>{item.productName}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                                    </div>
                                    <span style={{ fontWeight: 600 }}>₹{item.specialPrice.toFixed(2)}</span>
                                </div>
                            ))}

                            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                                <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                                <button className="btn btn-primary" id="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                                    {loading ? 'Processing...' : 'Place Your Order'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="cart-sidebar">
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>Items:</span>
                                <span>₹{cart.totalPrice.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>Delivery:</span>
                                <span style={{ color: 'var(--success)' }}>FREE</span>
                            </div>
                            <div className="divider" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
                                <span>Order Total:</span>
                                <span>₹{cart.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 16 }}>
                            By placing your order, you agree to Gusto's conditions of use and privacy notice.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
