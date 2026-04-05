import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const [adding, setAdding] = useState(false);

    const wishlisted = isWishlisted(product.productId);

    // FINAL SCHEMA MAPPING
    const originalPrice = product.price || 0;
    const currentPrice = product.specialPrice || originalPrice;
    const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    const imageUrl = product.imageUrl || 'https://picsum.photos/seed/a/400/500';

    const handleAddToCart = async (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        setAdding(true);
        await addToCart(product.productId, 1);
        setAdding(false);
    };

    const handleWishlist = async (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        if (wishlisted) await removeFromWishlist(product.productId);
        else await addToWishlist(product.productId);
    };

    return (
        <div 
            className="card-ajio" 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
            style={{ position: 'relative', background: '#fff', transition: '0.3s' }}
        >
            <Link to={`/product/${product.productId}`}>
                {/* ── IMAGE AREA (AJIO ASPECT RATIO 3:4) ── */}
                <div style={{ position: 'relative', aspectRatio: '3 / 4', width: '100%', overflow: 'hidden', background: '#f8f8f8' }}>
                    <motion.img 
                        src={imageUrl} 
                        alt={product.productName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        animate={{ scale: hover ? 1.05 : 1 }}
                        transition={{ duration: 0.4 }}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://picsum.photos/seed/placeholder/400/500'; }}
                    />
                    
                    <button 
                        onClick={handleWishlist} 
                        style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                    >
                        <Heart size={18} fill={wishlisted ? '#ff4081' : 'none'} color={wishlisted ? '#ff4081' : '#333'} />
                    </button>
                    
                    {/* QUICK ADD OVERLAY */}
                    <AnimatePresence>
                        {hover && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 20 }}>
                                <button onClick={handleAddToCart} className="btn-ajio" style={{ width: '100%', height: 44, borderRadius: 4, background: 'rgba(255,255,255,0.95)', color: '#111', fontWeight: 800, border: '1px solid #ddd' }} disabled={adding}>
                                    {adding ? 'ADDING...' : 'ADD TO BAG'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── INFO AREA (AJIO DENSITY) ── */}
                <div style={{ padding: '12px 0' }}>
                    {/* BRAND: Promiscuously displayed above name */}
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#333', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{product.brand || 'Luxury Design'}</h4>
                    <h5 style={{ fontSize: 13, fontWeight: 400, color: '#777', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8 }}>{product.productName}</h5>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#000' }}>₹{currentPrice}</span>
                        {discountPercent > 0 && (
                            <>
                                <span style={{ fontSize: 12, color: '#999', textTransform: 'line-through' }}>₹{originalPrice}</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#ff905a' }}>({discountPercent}% OFF)</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
