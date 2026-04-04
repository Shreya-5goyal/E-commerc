import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Wishlist = () => {
    const { wishlist, loading } = useWishlist();

    if (loading) return (
        <div className="loading-wrapper"><div className="spinner"></div><p>Loading your wishlist...</p></div>
    );

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div className="section-header">
                <h1 className="section-title"><Heart size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--danger)' }} /> Your Wishlist</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="empty-state animate-in">
                    <Heart size={64} color="#94a3b8" style={{ margin: '0 auto 24px' }} />
                    <h2 style={{ marginBottom: 12 }}>Your wishlist is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Save items you like and come back to them later.</p>
                    <Link to="/" className="btn btn-secondary">Go Shopping</Link>
                </div>
            ) : (
                <div className="product-grid">
                    {wishlist.map((product, index) => (
                        <motion.div
                            key={product.productId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="divider" style={{ marginTop: 60 }} />
            
            <div style={{ padding: '40px', borderRadius: 'var(--radius)', background: 'white', textAlign: 'center' }}>
                <h3>Looking for something else?</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                    <Link to="/search?keyword=sale" className="btn btn-outline">Check Deals</Link>
                    <Link to="/search?keyword=bestseller" className="btn btn-ghost">View Bestsellers</Link>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
