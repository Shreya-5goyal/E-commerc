import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
    const full = Math.round(rating || 0);
    return (
        <span className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i}>{i <= full ? '★' : '☆'}</span>
            ))}
        </span>
    );
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const wishlisted = isWishlisted(product.productId);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        await addToCart(product.productId, 1);
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        if (wishlisted) await removeFromWishlist(product.productId);
        else await addToWishlist(product.productId);
    };

    const price = product.specialPrice > 0 ? product.specialPrice : product.price;
    const discountPct = product.discount > 0 ? Math.round(product.discount) : 0;

    return (
        <div className="product-card animate-in">
            <Link to={`/product/${product.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                    src={product.image?.startsWith('http') ? product.image : `/api/images/${product.image || 'placeholder.jpg'}`}
                    alt={product.productName}
                    className="product-image"
                    loading="lazy"
                />
                <div className="product-body">
                    <p className="product-title">{product.productName}</p>
                    <div className="product-rating">
                        <StarRating rating={4} />
                        <span>(4.0)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                        <span className="product-price">₹{price.toFixed(2)}</span>
                        {discountPct > 0 && (
                            <>
                                <span className="product-price-old">₹{product.price.toFixed(2)}</span>
                                <span className="product-discount">-{discountPct}%</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
            <div className="product-card-actions">
                <button
                    id={`add-to-cart-${product.productId}`}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.82rem', padding: '8px 10px' }}
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={14} /> Add to Cart
                </button>
                <button
                    id={`wishlist-btn-${product.productId}`}
                    className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                    onClick={handleWishlist}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart size={16} fill={wishlisted ? '#ef4444' : 'none'} color={wishlisted ? '#ef4444' : '#64748b'} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
