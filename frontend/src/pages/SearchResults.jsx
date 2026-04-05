import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ShoppingBag, X, SlidersHorizontal, Star } from 'lucide-react';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // FILTERS (AJIO Style)
    const [priceRange, setPriceRange] = useState(200000);
    const [sortBy, setSortBy] = useState('specialPrice');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            // New Filtered Endpoint
            const res = await api.get(`/public/products/filter`, {
                params: {
                    keyword: keyword,
                    minPrice: 0,
                    maxPrice: priceRange,
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    pageSize: 24
                }
            });
            
            const catRes = await api.get('/public/categories');
            
            setProducts(res.data.content || []);
            setCategories(catRes.data.content || []);
        } catch (err) {
            console.error('Search error', err);
        } finally {
            setLoading(false);
        }
    }, [keyword, priceRange, sortBy, sortOrder]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return (
        <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 140 }}>
            <div className="container">
                
                {/* ── AJIO TOP BAR ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottom: '1px solid #eee', paddingBottom: 20 }}>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 800, textTransform: 'uppercase' }}>{keyword ? `Results for "${keyword}"` : 'The Collection'}</h1>
                        <p style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{products.length} Items found</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#666' }}>SORT BY:</span>
                            <select 
                                value={`${sortBy}-${sortOrder}`} 
                                onChange={e => {
                                    const [b, o] = e.target.value.split('-');
                                    setSortBy(b); setSortOrder(o);
                                }}
                                style={{ border: 'none', background: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer', outline: 'none' }}
                            >
                                <option value="specialPrice-asc">Price (Lowest)</option>
                                <option value="specialPrice-desc">Price (Highest)</option>
                                <option value="rating-desc">Customer Rating</option>
                                <option value="productId-desc">New Arrivals</option>
                            </select>
                        </div>
                        <button onClick={() => setShowMobileFilter(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800 }}><SlidersHorizontal size={14} /> FILTERS</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 60 }}>
                    
                    {/* ── SIDEBAR FILTERS ── */}
                    <aside className="desktop-filters">
                        <div style={{ marginBottom: 40 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginBottom: 20 }}>Refine By Price</h4>
                            <input 
                                type="range" min="0" max="200000" step="5000"
                                value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} 
                                style={{ width: '100%', accentColor: '#111' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 10, fontWeight: 700 }}>
                                <span>₹0</span>
                                <span>₹{priceRange.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: 40 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginBottom: 20 }}>Categories</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {categories.map(c => (
                                    <Link 
                                        key={c.categoryId} to={`/search?keyword=${c.categoryName}`}
                                        style={{ fontSize: 13, color: '#555', fontWeight: 500, transition: '0.2s' }}
                                    >
                                        {c.categoryName} <span style={{ fontSize: 10, opacity: 0.5 }}>(12)</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* ── PRODUCT GRID ── */}
                    <div>
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                                {[...Array(8)].map((_, i) => <SkeletonLoader key={i} />)}
                            </div>
                        ) : products.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed #ddd', borderRadius: 12 }}>
                                <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: 24 }} />
                                <h3>We couldn't find matches.</h3>
                                <button onClick={() => { setPriceRange(200000); }} style={{ color: '#ff905a', fontSize: 12, marginTop: 12, fontWeight: 800 }}>CLEAR ALL FILTERS</button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                                {products.map(p => <ProductCard key={p.productId} product={p} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
