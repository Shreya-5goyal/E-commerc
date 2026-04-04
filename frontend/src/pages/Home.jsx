import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Tag, TrendingUp, ShieldCheck } from 'lucide-react';



import Carousel from '../components/Carousel';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [deals, setDeals] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Timer for flash sale (mock)
    const [timeLeft, setTimeLeft] = useState({ h: 12, m: 34, s: 56 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch individually to avoid one failure blocking all
                const fetchProducts = async () => {
                    try {
                        const res = await api.get('/public/products?pageSize=8');
                        setProducts(res.data.content || []);
                    } catch (e) { console.error('Products fetch error', e); }
                };

                const fetchCategories = async () => {
                    try {
                        const res = await api.get('/public/categories');
                        setCategories(res.data.content || []);
                    } catch (e) { console.error('Categories fetch error', e); }
                };

                const fetchDeals = async () => {
                    try {
                        const res = await api.get('/public/products/deals?pageSize=4');
                        setDeals(res.data.content || []);
                    } catch (e) { console.error('Deals fetch error', e); }
                };

                const fetchNew = async () => {
                    try {
                        const res = await api.get('/public/products/new?pageSize=4');
                        setNewArrivals(res.data.content || []);
                    } catch (e) { console.error('New Arrivals fetch error', e); }
                };

                await Promise.all([fetchProducts(), fetchCategories(), fetchDeals(), fetchNew()]);

                // Only show global error if EVERYTHING failed (unlikely if backend is up)
                // But we check if products failed as a baseline
            } catch (err) {
                console.error(err);
                setError('Failed to load products. Make sure the backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Gathering the best products for you…</p>
        </div>
    );

    if (error) return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger)', fontSize: '1.2rem', marginBottom: 20 }}>{error}</p>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Retry</button>
        </div>
    );

    return (
        <div className="home-page">
            {/* ── Featured Carousel ────────────────────────────────── */}
            <div className="container" style={{ paddingTop: 20 }}>
                <Carousel />
            </div>

            <div className="container" style={{ paddingTop: 0 }}>
                {/* ── Benefits ────────────────────────────────────────── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 24,
                    marginBottom: 64,
                    marginTop: -40,
                    position: 'relative',
                    zIndex: 20
                }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="benefit-card" onClick={() => navigate('/search?keyword=')} style={{ cursor: 'pointer' }}>
                        <div className="benefit-icon">🚚</div>
                        <h4 style={{ marginBottom: 8, fontSize: '1.1rem' }}>Free Shipping</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Free express delivery on all orders above ₹999 within 2 days.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="benefit-card" onClick={() => navigate('/search?keyword=')} style={{ cursor: 'pointer' }}>
                        <div className="benefit-icon">🛡️</div>
                        <h4 style={{ marginBottom: 8, fontSize: '1.1rem' }}>Secure Payment</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Advanced SSL encryption and trusted gateways for safe checkout.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="benefit-card" onClick={() => navigate('/search?keyword=')} style={{ cursor: 'pointer' }}>
                        <div className="benefit-icon">💫</div>
                        <h4 style={{ marginBottom: 8, fontSize: '1.1rem' }}>Premium Quality</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Every product is handpicked and verified by our quality experts.</p>
                    </motion.div>
                </div>

                {/* ── Flash Deals ─────────────────────────────────────── */}
                {deals.length > 0 && (
                    <section id="flash-deals" style={{ marginBottom: 64 }}>
                        <div className="deal-card" onClick={() => navigate('/search?keyword=sale')} style={{ cursor: 'pointer' }}>
                            <div>
                                <span className="badge badge-warning" style={{ color: '#92400e', background: '#fef3c7', marginBottom: 12 }}>Limited Time Offer</span>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Flash Sale is Live! ⚡</h2>
                                <p style={{ opacity: .9, marginTop: 8 }}>Get up to 60% off on your favorite electronics and fashion items.</p>

                                <div className="timer-container">
                                    <div className="timer-box"><span className="timer-val">{String(timeLeft.h).padStart(2, '0')}</span><span className="timer-label">Hrs</span></div>
                                    <div className="timer-box"><span className="timer-val">{String(timeLeft.m).padStart(2, '0')}</span><span className="timer-label">Min</span></div>
                                    <div className="timer-box"><span className="timer-val">{String(timeLeft.s).padStart(2, '0')}</span><span className="timer-label">Sec</span></div>
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ background: '#fff', color: '#ef4444', padding: '14px 32px' }}>
                                Shop Now
                            </button>
                        </div>

                        <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                            {deals.map((p, i) => (
                                <motion.div key={p.productId} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Categories ────────────────────────────────────── */}
                {categories.length > 0 && (
                    <section style={{ marginBottom: 64 }}>
                        <div className="section-header">
                            <h2 className="section-title">Global Categories</h2>
                            <Link to="/search?keyword=" style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.9rem' }}>See All →</Link>
                        </div>
                        <div className="category-grid">
                            {categories.slice(0, 4).map((cat, i) => (
                                <div key={cat.categoryId} className="category-card" onClick={() => navigate(`/search?keyword=${cat.categoryName}`)}>
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000}?auto=format&fit=crop&w=600&q=80`} alt={cat.categoryName} className="category-card-img" />
                                    <div className="category-card-body">
                                        <h3>{cat.categoryName}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>Explore premium {cat.categoryName.toLowerCase()} products selected for you.</p>
                                        <span style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.85rem' }}>Browse Now</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── New Arrivals ───────────────────────────────────── */}
                {newArrivals.length > 0 && (
                    <section style={{ marginBottom: 64 }}>
                        <div className="section-header">
                            <h2 className="section-title">New Arrivals</h2>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Just added to our catalog</p>
                        </div>
                        <div className="product-grid">
                            {newArrivals.map((p, i) => (
                                <div key={p.productId} style={{ position: 'relative' }}>
                                    <span className="badge-new">NEW</span>
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Newsletter ───────────────────────────────────────── */}
                <section className="newsletter animate-in">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <h2>Join the Gusto Family</h2>
                        <p>Subscribe to our newsletter and get 10% off your first order plus exclusive early access to major sales.</p>
                        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
                            <input className="form-control" type="email" placeholder="Enter your email address" style={{ height: 50, border: 'none' }} required />
                            <button className="btn btn-secondary" style={{ padding: '0 32px' }}>Subscribe</button>
                        </form>
                        <p style={{ marginTop: 24, fontSize: '0.75rem', opacity: .6 }}>By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default Home;