import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search as SearchIcon, User as UserIcon, LogOut, Package, Shield, Settings, ChevronDown, Heart, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    
    const [searchKeyword, setSearchKeyword] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    
    const menuRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (kw) => {
        if (!kw.trim() || kw.length < 2) { setSuggestions([]); return; }
        try {
            const res = await api.get(`/public/products/keyword/${kw}?pageSize=5`);
            setSuggestions(res.data.content || []);
        } catch {}
    };

    const handleSearchSubmit = (e) => { e.preventDefault(); if (searchKeyword.trim()) navigate(`/search?keyword=${searchKeyword}`); };

    return (
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#fff' }}>
            {/* ── TOP UTILITY ── */}
            <div style={{ background: '#2C4152', color: '#fff', fontSize: 10, padding: '8px 40px', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                <span>Free Delivery on orders above ₹799</span>
                <div style={{ display: 'flex', gap: 24 }}>
                    <Link to="/search">Gusto Luxury</Link>
                    <Link to="/profile">Join Gusto Rewards</Link>
                </div>
            </div>

            {/* ── MAIN NAV ── */}
            <nav style={{ height: 80, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', transition: '0.3s' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 60, width: '100%' }}>
                    
                    {/* ── LOGO ── */}
                    <Link to="/" style={{ color: '#2C4152', fontSize: 24, fontWeight: 800, letterSpacing: -1, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Store size={28} /> GUSTO
                    </Link>

                    {/* ── AJIO CATEGORIES ── */}
                    <div style={{ display: 'flex', gap: 32, fontSize: 13, fontWeight: 800, color: '#333', textTransform: 'uppercase' }}>
                        <Link to="/search?keyword=Men">MEN</Link>
                        <Link to="/search?keyword=Women">WOMEN</Link>
                        <Link to="/search?keyword=Kids">KIDS</Link>
                        <Link to="/search?keyword=Brands" style={{ color: '#ff4081' }}>INDIE</Link>
                    </div>

                    {/* ── SEARCH ── */}
                    <div style={{ flex: 1, position: 'relative' }} ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                            <input 
                                value={searchKeyword} 
                                onChange={(e) => { setSearchKeyword(e.target.value); fetchSuggestions(e.target.value); }}
                                placeholder="Search GUSTO Archive..." 
                                style={{ width: '100%', height: 44, background: '#F0F0F0', border: '1px solid #ddd', borderRadius: 40, padding: '0 50px 0 20px', fontSize: 13, outline: 'none' }}
                            />
                            <button style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
                                <SearchIcon size={18} />
                            </button>
                        </form>
                    </div>

                    {/* ── ACTIONS ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, color: '#2C4152' }}>
                        <Link to="/wishlist" style={{ color: 'inherit' }} title="Wishlist"><Heart size={24} strokeWidth={1.5} /></Link>
                        <Link to="/cart" style={{ position: 'relative', color: 'inherit' }} title="Bag">
                            <ShoppingBag size={24} strokeWidth={1.5} />
                            {cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -8, background: '#D93B3B', color: '#fff', fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
                        </Link>
                        <div style={{ position: 'relative' }} ref={menuRef}>
                            <button onClick={() => setShowMenu(!showMenu)} style={{ color: 'inherit' }}><UserIcon size={24} strokeWidth={1.5} /></button>
                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', top: '100%', right: -10, marginTop: 12, width: 220, background: '#fff', border: '1px solid #eee', borderRadius: 8, zIndex: 3000, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px 0' }}>
                                        {user ? (
                                            <>
                                                <div style={{ padding: '8px 24px 16px', borderBottom: '1px solid #eee', marginBottom: 8 }}><p style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>Hello {user.username}</p></div>
                                                <Link to="/profile" onClick={() => setShowMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontSize: 13, color: '#555' }}><Package size={16} /> My Orders</Link>
                                                <Link to="/wishlist" onClick={() => setShowMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontSize: 13, color: '#555' }}><Heart size={16} /> Wishlist</Link>
                                                <div style={{ height: 1, background: '#eee', margin: '8px 0' }} />
                                                <button onClick={() => { logout(); setShowMenu(false); navigate('/login'); }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontSize: 13, color: '#D93B3B' }}>Sign Out</button>
                                            </>
                                        ) : (
                                            <div style={{ padding: '8px 16px' }}>
                                                <button onClick={() => navigate('/login')} style={{ width: '100%', height: 40, background: '#2C4152', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 4 }}>SIGN IN</button>
                                                <Link to="/signup" onClick={() => setShowMenu(false)} style={{ display: 'block', textAlign: 'center', fontSize: 11, color: '#999', marginTop: 12 }}>New to Gusto? Join Now</Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
