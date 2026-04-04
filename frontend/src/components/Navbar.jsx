import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, ShoppingCart, Heart, User as UserIcon, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart, fetchCart, clearCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const accountRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) fetchCart();
        else clearCart();
    }, [user, fetchCart, clearCart]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (accountRef.current && !accountRef.current.contains(e.target)) {
                setAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
            setMobileOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        clearCart();
        setAccountOpen(false);
        navigate('/login');
    };

    const cartCount = cart?.products?.reduce((acc, p) => acc + p.quantity, 0) || 0;

    return (
        <nav className="navbar">
            <div className="navbar-top container" style={{ maxWidth: '100%', padding: '12px 24px' }}>
                {/* Logo */}
                <Link to="/" className="logo" id="nav-logo">
                    <ShoppingBag size={28} color="var(--secondary)" strokeWidth={2.5} />
                    <span className="logo-text">Gus<span>to</span></span>
                </Link>

                {/* Search */}
                <form className="search-bar" onSubmit={handleSearch} id="search-form" style={{ margin: '0 20px', display: mobileOpen ? 'none' : 'flex' }}>
                    <input
                        id="search-input"
                        type="text"
                        className="search-input"
                        placeholder="Search products, categories…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-btn" id="search-submit-btn">
                        <Search size={20} color="#0f172a" />
                    </button>
                </form>

                {/* Right nav */}
                <div className="nav-links">
                    {/* Account dropdown */}
                    <div ref={accountRef} style={{ position: 'relative' }}>
                        <div
                            className="nav-item"
                            id="account-menu-btn"
                            onClick={() => setAccountOpen(!accountOpen)}
                        >
                            <span className="nav-label">Hello, {user ? user.username : 'Sign in'}</span>
                            <span className="nav-value" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                Account <ChevronDown size={12} />
                            </span>
                        </div>
                        {accountOpen && (
                            <div id="account-dropdown" style={{
                                position: 'absolute', top: '110%', right: 0,
                                background: '#fff', borderRadius: '10px',
                                boxShadow: '0 8px 32px rgba(0,0,0,.18)',
                                border: '1px solid #e2e8f0',
                                minWidth: '200px', zIndex: 200,
                                overflow: 'hidden'
                            }}>
                                {user ? (
                                    <>
                                        <Link to="/profile" id="profile-link" onClick={() => setAccountOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', fontSize: '0.875rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
                                            <UserIcon size={15} /> My Profile
                                        </Link>
                                        <Link to="/wishlist" id="wishlist-link" onClick={() => setAccountOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', fontSize: '0.875rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
                                            <Heart size={15} /> Wishlist
                                        </Link>
                                        <button id="signout-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', fontSize: '0.875rem', color: '#ef4444', width: '100%', textAlign: 'left', background: 'none' }}>
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" id="signin-link" onClick={() => setAccountOpen(false)} style={{ display: 'block', padding: '12px 18px', fontSize: '0.875rem', color: '#1d4ed8', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Sign In</Link>
                                        <Link to="/signup" id="signup-link" onClick={() => setAccountOpen(false)} style={{ display: 'block', padding: '12px 18px', fontSize: '0.875rem', color: '#0f172a' }}>Create Account</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Wishlist */}
                    <Link to="/wishlist" id="nav-wishlist" className="nav-item" style={{ alignItems: 'center' }}>
                        <Heart size={22} color="var(--text-secondary)" />
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" id="nav-cart" className="nav-item cart-icon">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                        <span className="nav-value">Cart</span>
                    </Link>

                    {/* Mobile toggle */}
                    <button className="btn-ghost" id="mobile-menu-btn" style={{ display: 'none', color: '#fff', padding: '6px' }} onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Bottom nav strip */}
            <div className="navbar-bottom">
                <Link to="/" id="nav-home">🏠 Home</Link>
                <Link to="/search?keyword=electronics" id="nav-electronics">Electronics</Link>
                <Link to="/search?keyword=fashion" id="nav-fashion">Fashion</Link>
                <Link to="/search?keyword=books" id="nav-books">Books</Link>
                <Link to="/search?keyword=sports" id="nav-sports">Sports</Link>
                <Link to="/search?keyword=home" id="nav-home-decor">Home & Garden</Link>
                {user && <Link to="/profile" id="nav-orders">📦 My Orders</Link>}
            </div>

            {/* Mobile Navigation Tray */}
            {mobileOpen && (
                <div className="mobile-nav-tray" id="mobile-nav">
                    <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none' }}>
                        <X size={30} color="#0f172a" />
                    </button>
                    <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                    <Link to="/search?keyword=electronics" onClick={() => setMobileOpen(false)}>Electronics</Link>
                    <Link to="/search?keyword=fashion" onClick={() => setMobileOpen(false)}>Fashion</Link>
                    <Link to="/search?keyword=books" onClick={() => setMobileOpen(false)}>Books</Link>
                    <Link to="/search?keyword=sports" onClick={() => setMobileOpen(false)}>Sports</Link>
                    <Link to="/cart" onClick={() => setMobileOpen(false)}>My Cart</Link>
                    {user ? (
                        <Link to="/profile" onClick={() => setMobileOpen(false)}>My Profile</Link>
                    ) : (
                        <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
