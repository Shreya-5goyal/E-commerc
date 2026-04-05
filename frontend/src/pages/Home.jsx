import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Globe, Zap, Gift, ChevronRight, TrendingUp, Sparkles, Percent } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // AJIO BANNERS (Simulated Carousel)
    const [activeBanner, setActiveBanner] = useState(0);
    const banners = [
        "https://assets.ajio.com/cms/AJIO/WEB/D-1.0-UHP-21012024-Z11-Main-P1-Nike-Adidas-Min50.jpg", // Simulated AJIO URL style
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
    ];

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [prodRes, dealRes] = await Promise.all([
                    api.get('/public/products?pageSize=12'),
                    api.get('/public/products/deals?pageSize=8')
                ]);
                setProducts(prodRes.data.content || []);
                setDeals(dealRes.data.content || []);
            } catch (err) {
                console.error("Home fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
        const t = setInterval(() => setActiveBanner(prev => (prev + 1) % banners.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <div style={{ background: '#fff', paddingTop: 110 }}>
            {/* ── AJIO BANNER CAROUSEL ── */}
            <section style={{ position: 'relative', height: 480, overflow: 'hidden', background: '#f5f5f5' }}>
                <AnimatePresence mode='wait'>
                    <motion.img 
                        key={activeBanner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        src={banners[activeBanner]} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.src='https://picsum.photos/seed/h1/1920/480'}
                    />
                </AnimatePresence>
                <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
                    {banners.map((_, i) => (
                        <div key={i} onClick={() => setActiveBanner(i)} style={{ width: 40, height: 4, background: activeBanner === i ? '#2C4152' : '#ccc', cursor: 'pointer', transition: '0.3s' }} />
                    ))}
                </div>
            </section>

            {/* ── CATEGORY CHIPS: AJIO DENSITY ── */}
            <section className="container" style={{ margin: '40px auto' }}>
                <div style={{ display: 'flex', gap: 15, overflowX: 'auto', paddingBottom: 10 }}>
                    {['Men', 'Women', 'Kids', 'Accessories', 'Gifts', 'Sale'].map(c => (
                        <button key={c} onClick={() => navigate(`/search?keyword=${c}`)} className="chip">{c}</button>
                    ))}
                </div>
            </section>

            {/* ── DEAL OF THE DAY (AJIO STYLE BANNER) ── */}
            <section className="container" style={{ marginBottom: 60 }}>
                <div style={{ background: '#ffeadb', padding: '30px 40px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ color: '#d32f2f', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={16} fill="#d32f2f" /> DEAL OF THE DAY
                        </p>
                        <h2 style={{ fontSize: 28, color: '#333' }}>Save up to 70% on New Season</h2>
                        <p style={{ color: '#555', marginTop: 8 }}>Available for selected items only. Limited period offer.</p>
                    </div>
                    <button onClick={() => navigate('/search')} className="btn-ajio">SHOP NOW</button>
                </div>
            </section>

            {/* ── TRENDING: Dense Grid (4 Cols) ── */}
            <section className="section container" style={{ paddingTop: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                    <TrendingUp size={24} style={{ color: '#111' }} />
                    <h2 style={{ fontSize: 22, textTransform: 'uppercase', letterSpacing: 0.5 }}>Trending Now</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                    {loading ? (
                        [...Array(4)].map((_, i) => <SkeletonLoader key={i} />)
                    ) : (
                        products.map(prod => <ProductCard key={prod.productId} product={prod} />)
                    )}
                </div>
            </section>

            {/* ── SECONDARY PROMO BAR ── */}
            <section style={{ background: '#2C4152', padding: '15px 0', margin: '40px 0' }}>
               <div className="container" style={{ display: 'flex', justifyContent: 'space-around', color: '#fff', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Percent size={14} /> Get EXTRA 10% Off on ₹2990+</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Gift size={14} /> Free Gift on Your First Purchase</span>
               </div>
            </section>

            {/* ── DEALS SECTION ── */}
            <section className="section container" style={{ paddingTop: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                    <Sparkles size={24} style={{ color: '#111' }} />
                    <h2 style={{ fontSize: 22, textTransform: 'uppercase', letterSpacing: 0.5 }}>Best Sellers</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                    {loading ? (
                        [...Array(4)].map((_, i) => <SkeletonLoader key={i} />)
                    ) : (
                        deals.map(prod => <ProductCard key={prod.productId} product={prod} />)
                    )}
                </div>
            </section>

            {/* ── FOOTER: Content Heavy ── */}
            <footer style={{ background: '#F9FAFB', padding: '60px 0 40px', borderTop: '1px solid #eee' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
                    <div>
                        <h4 style={{ marginBottom: 24, fontSize: 13, textTransform: 'uppercase', color: '#333' }}>GUSTO ONLINE</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, color: '#666' }}>
                            <Link to="/search">Gusto Luxury</Link>
                            <Link to="/search">Registry</Link>
                            <Link to="/profile">Joining Bonus</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: 24, fontSize: 13, textTransform: 'uppercase', color: '#333' }}>SERVICE</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, color: '#666' }}>
                             <a href="#">Order Tracking</a>
                             <a href="#">Returns & Returns</a>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: 24, fontSize: 13, textTransform: 'uppercase', color: '#333' }}>EXPERIENCE GUSTO APP</h4>
                        <div style={{ display: 'flex', gap: 12 }}>
                           <div style={{ background: '#eee', padding: '8px 12px', fontSize: 10, borderRadius: 4, textAlign: 'center' }}>GOOGLE PLAY</div>
                           <div style={{ background: '#eee', padding: '8px 12px', fontSize: 10, borderRadius: 4, textAlign: 'center' }}>APP STORE</div>
                        </div>
                    </div>
                </div>
                <div className="container" style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid #eee', fontSize: 11, color: '#999', textAlign: 'center' }}>
                    <p>© 2026 GUSTO GLOBAL. INDIA'S PREMIUM FASHION DESTINATION.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;