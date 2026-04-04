import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const keyword = query.get('keyword') || '';

    const fetchResults = async (page = 0, append = false) => {
        if (page === 0) setLoading(true);
        else setLoadingMore(true);
        
        setError(null);
        try {
            let response;
            const size = 20;
            // Map our local sort state to API sort parameters
            let sortApi = 'productId';
            let orderApi = 'asc';
            
            if (sortBy === 'price-asc') { sortApi = 'price'; orderApi = 'asc'; }
            else if (sortBy === 'price-desc') { sortApi = 'price'; orderApi = 'desc'; }
            else if (sortBy === 'name-asc') { sortApi = 'productName'; orderApi = 'asc'; }

            if (keyword.trim() === '') {
                response = await api.get(`/public/products?pageNumber=${page}&pageSize=${size}&sortBy=${sortApi}&sortOrder=${orderApi}`);
            } else {
                response = await api.get(`/public/products/keyword/${keyword}?pageNumber=${page}&pageSize=${size}&sortBy=${sortApi}&sortOrder=${orderApi}`);
            }
            
            const newItems = response.data.content || [];
            const filteredItems = newItems.filter(p => {
                const pPrice = p.specialPrice || p.price;
                if (priceMin && pPrice < Number(priceMin)) return false;
                if (priceMax && pPrice > Number(priceMax)) return false;
                return true;
            });

            setProducts(prev => append ? [...prev, ...filteredItems] : filteredItems);
            setTotalPages(response.data.totalPages || 1);
            setPageNumber(page);
        } catch (err) {
            console.error(err);
            if (err.response?.status !== 404) {
                setError('An error occurred while fetching products.');
            } else if (page === 0) {
                setProducts([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchResults(0, false);
    }, [keyword, sortBy]); // Refetch when keyword or sort changes

    const handleLoadMore = () => {
        if (pageNumber < totalPages - 1) {
            fetchResults(pageNumber + 1, true);
        }
    };

    const applyFilters = () => {
        fetchResults(0, false);
    };

    const clearFilters = () => {
        setPriceMin('');
        setPriceMax('');
        setSortBy('default');
        // fetchResults will trigger via sortBy change
    };

    if (loading) return (
        <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Searching for items…</p>
        </div>
    );

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Search size={20} color="var(--text-muted)" />
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                        {keyword ? `Results for "${keyword}"` : 'All Premium Products'}
                    </h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Showing {products.length} of our expansive collection
                </p>
            </div>

            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                {/* Sidebar Filters */}
                <div style={{
                    width: 240,
                    flexShrink: 0,
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    padding: 20,
                    position: 'sticky',
                    top: 90,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
                            <SlidersHorizontal size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                            Filters
                        </h3>
                        {(priceMin || priceMax || sortBy !== 'default') && (
                            <button onClick={clearFilters} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--danger)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
                                <X size={12} /> Clear
                            </button>
                        )}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 10 }}>Sort By</label>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="form-control"
                            style={{ fontSize: '0.875rem' }}
                        >
                            <option value="default">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 10 }}>Price Range (₹)</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min"
                                value={priceMin}
                                onChange={e => setPriceMin(e.target.value)}
                                style={{ fontSize: '0.85rem' }}
                            />
                            <span style={{ color: 'var(--text-muted)' }}>–</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max"
                                value={priceMax}
                                onChange={e => setPriceMax(e.target.value)}
                                style={{ fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                        onClick={applyFilters}
                    >
                        Apply Filters
                    </button>
                </div>

                {/* Products */}
                <div style={{ flex: 1 }}>
                    {error && <div className="alert alert-error">{error}</div>}

                    {products.length === 0 ? (
                        <div className="empty-state animate-in">
                            <Search size={64} />
                            <h3>No products found</h3>
                            <p>Try a different keyword or check your filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="product-grid">
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.productId}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: (index % 20) * 0.02 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                            
                            {pageNumber < totalPages - 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        style={{ padding: '12px 40px' }}
                                    >
                                        {loadingMore ? 'Loading more products…' : 'Load More Products'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
