import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { user } = useAuth();
    const { cart, loading, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    if (!user) return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <ShoppingBag size={64} color="#94a3b8" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ marginBottom: 12 }}>Please sign in to view your cart</h2>
            <Link to="/login" className="btn btn-secondary" id="cart-signin-btn">Sign In</Link>
        </div>
    );

    if (loading && !cart) return (
        <div className="loading-wrapper"><div className="spinner"></div><p>Loading cart…</p></div>
    );

    if (!cart || !cart.products || cart.products.length === 0) return (
        <div className="container" style={{ padding: '80px 0' }}>
            <div className="empty-state">
                <ShoppingBag size={72} />
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet.</p>
                <Link to="/" id="continue-shopping-btn" className="btn btn-secondary" style={{ marginTop: 24 }}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );

    const subtotal = cart.totalPrice || 0;
    const itemCount = cart.products.reduce((acc, p) => acc + p.quantity, 0);

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 28 }}>
                Shopping Cart
            </h1>

            <div className="cart-layout">
                {/* Cart items */}
                <div className="cart-main">
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {cart.products.map((product, idx) => (
                            <div
                                key={product.productId}
                                id={`cart-item-${product.productId}`}
                                style={{
                                    display: 'flex', gap: 20, padding: 20,
                                    borderBottom: idx < cart.products.length - 1 ? '1px solid var(--border)' : 'none',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {/* Image */}
                                <Link to={`/product/${product.productId}`}>
                                    <img
                                        src={product.image ? `/api/images/${product.image}` : 'https://placehold.co/100x100/f8fafc/94a3b8?text=Img'}
                                        alt={product.productName}
                                        style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 8, background: 'var(--surface-3)', padding: 8 }}
                                    />
                                </Link>

                                {/* Details */}
                                <div style={{ flex: 1 }}>
                                    <Link to={`/product/${product.productId}`} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--secondary)', marginBottom: 4, display: 'block' }}>
                                        {product.productName}
                                    </Link>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>In Stock</p>

                                    {/* Qty controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                            <button
                                                id={`decrease-qty-${product.productId}`}
                                                onClick={() => updateQuantity(product.productId, 'delete')}
                                                disabled={loading || product.quantity <= 1}
                                                style={{ padding: '6px 12px', background: 'var(--surface-3)', borderRight: '1px solid var(--border)', fontSize: '1rem' }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span id={`qty-display-${product.productId}`} style={{ padding: '6px 16px', fontWeight: 600 }}>{product.quantity}</span>
                                            <button
                                                id={`increase-qty-${product.productId}`}
                                                onClick={() => updateQuantity(product.productId, 'add')}
                                                disabled={loading}
                                                style={{ padding: '6px 12px', background: 'var(--surface-3)', borderLeft: '1px solid var(--border)', fontSize: '1rem' }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            id={`remove-item-${product.productId}`}
                                            onClick={() => removeFromCart(cart.cartId, product.productId)}
                                            disabled={loading}
                                            style={{ background: 'none', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                                        ₹{((product.specialPrice > 0 ? product.specialPrice : product.price) * product.quantity).toFixed(2)}
                                    </p>
                                    {product.quantity > 1 && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            ₹{(product.specialPrice > 0 ? product.specialPrice : product.price).toFixed(2)} each
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar summary */}
                <div className="cart-sidebar">
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                            Order Summary
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>Items ({itemCount})</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>Delivery</span>
                                <span className="text-success">{subtotal >= 499 ? 'FREE' : '₹49'}</span>
                            </div>
                            <div className="divider" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                                <span>Total</span>
                                <span>₹{(subtotal >= 499 ? subtotal : subtotal + 49).toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            id="checkout-btn"
                            className="btn btn-secondary"
                            style={{ width: '100%', padding: '13px' }}
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout <ArrowRight size={16} />
                        </button>
                        <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: '0.85rem', color: 'var(--secondary)' }}>
                            ← Continue Shopping
                        </Link>
                    </div>
                    {subtotal < 499 && (
                        <div className="alert alert-info" style={{ marginTop: 12 }}>
                            Add ₹{(499 - subtotal).toFixed(2)} more for FREE delivery!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
