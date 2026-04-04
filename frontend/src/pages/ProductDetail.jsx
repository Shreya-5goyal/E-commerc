import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Heart, ArrowLeft, Star, Send } from 'lucide-react';

const StarRating = ({ rating }) => {
    const full = Math.round(rating || 0);
    return (
        <span className="stars" style={{ fontSize: '1.1rem' }}>
            {[1, 2, 3, 4, 5].map(i => <span key={i}>{i <= full ? '★' : '☆'}</span>)}
        </span>
    );
};

const StarInput = ({ value, onChange }) => (
    <div className="star-input">
        {[1, 2, 3, 4, 5].map(i => (
            <button key={i} type="button" onClick={() => onChange(i)} id={`star-${i}`}>
                <span style={{ color: i <= value ? '#f59e0b' : '#cbd5e1' }}>★</span>
            </button>
        ))}
    </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [toast, setToast] = useState(null);

    // Review form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const wishlisted = isWishlisted(Number(id));

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [prodRes, revRes] = await Promise.all([
                    api.get(`/public/products/${id}`),
                    api.get(`/public/products/${id}/reviews`)
                ]);
                setProduct(prodRes.data);
                setReviews(revRes.data || []);
            } catch {
                setError('Product not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        setAdding(true);
        const res = await addToCart(id, quantity);
        if (res.success) showToast('Added to cart!');
        else showToast(res.message, 'error');
        setAdding(false);
    };

    const handleBuyNow = async () => {
        if (!user) { navigate('/login'); return; }
        setAdding(true);
        const res = await addToCart(id, quantity);
        setAdding(false);
        if (res.success) navigate('/checkout');
        else showToast(res.message, 'error');
    };

    const handleWishlist = async () => {
        if (!user) { navigate('/login'); return; }
        if (wishlisted) await removeFromWishlist(Number(id));
        else await addToWishlist(Number(id));
        showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        if (!comment.trim()) { showToast('Please write a comment.', 'error'); return; }
        setSubmittingReview(true);
        try {
            await api.post(`/products/${id}/reviews`, { rating, comment });
            const revRes = await api.get(`/public/products/${id}/reviews`);
            setReviews(revRes.data || []);
            setComment('');
            setRating(5);
            showToast('Review submitted!');
        } catch (err) {
            showToast(err.response?.data?.message || 'Could not submit review.', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="loading-wrapper"><div className="spinner"></div><p>Loading product…</p></div>
    );
    if (error) return (
        <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
            <p className="text-danger">{error}</p>
            <Link to="/" className="btn btn-secondary" style={{ marginTop: 16 }}>Back to Home</Link>
        </div>
    );
    if (!product) return null;

    const price = product.specialPrice > 0 ? product.specialPrice : product.price;
    const discountPct = product.discount > 0 ? Math.round(product.discount) : 0;
    const avgRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="container" style={{ padding: '32px 0' }}>
            {/* Toast */}
            {toast && (
                <div className={`alert ${toast.type === 'error' ? 'alert-error' : 'alert-success'}`}
                    style={{ position: 'fixed', top: 80, right: 24, zIndex: 999, maxWidth: 320, animation: 'fadeInUp .3s ease' }}>
                    {toast.msg}
                </div>
            )}

            <Link to="/" id="back-to-home" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--secondary)', marginBottom: 24, fontSize: '0.875rem' }}>
                <ArrowLeft size={16} /> Back to products
            </Link>

            <div className="product-detail-layout">
                {/* Image */}
                <div className="product-detail-img-wrap">
                    <img
                        src={product.image ? `/api/images/${product.image}` : 'https://placehold.co/500x500/f8fafc/94a3b8?text=No+Image'}
                        alt={product.productName}
                        className="product-detail-img"
                        id="product-main-image"
                    />
                </div>

                {/* Info */}
                <div className="product-detail-info">
                    <h1 id="product-name" style={{ fontSize: '1.7rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 12 }}>{product.productName}</h1>

                    {/* Rating summary */}
                    {avgRating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                            <StarRating rating={Math.round(avgRating)} />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                            </span>
                        </div>
                    )}

                    <div className="divider" />

                    {/* Price */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                            <span id="product-price" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                ₹{price.toFixed(2)}
                            </span>
                            {discountPct > 0 && (
                                <>
                                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                    <span className="badge badge-success" id="discount-badge">-{discountPct}% off</span>
                                </>
                            )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Inclusive of all taxes</p>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.95rem' }}>
                        {product.description}
                    </p>

                    {/* Stock */}
                    <div style={{ marginBottom: 20 }}>
                        {product.quantity > 0
                            ? <span className="badge badge-success" id="stock-badge">✓ In Stock ({product.quantity} available)</span>
                            : <span className="badge badge-danger">Out of Stock</span>}
                    </div>

                    {/* Quantity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Qty:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                            <button id="qty-minus" onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '8px 14px', background: 'var(--surface-3)', fontSize: '1rem', borderRight: '1px solid var(--border)' }}>−</button>
                            <span id="qty-value" style={{ padding: '8px 18px', fontWeight: 600 }}>{quantity}</span>
                            <button id="qty-plus" onClick={() => setQuantity(q => Math.min(product.quantity || 10, q + 1))} style={{ padding: '8px 14px', background: 'var(--surface-3)', fontSize: '1rem', borderLeft: '1px solid var(--border)' }}>+</button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                        <button id="add-to-cart-btn" className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart} disabled={adding || product.quantity === 0}>
                            <ShoppingCart size={16} />
                            {adding ? 'Adding…' : 'Add to Cart'}
                        </button>
                        <button id="buy-now-btn" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleBuyNow} disabled={adding || product.quantity === 0}>
                            Buy Now
                        </button>
                        <button
                            id="wishlist-toggle-btn"
                            onClick={handleWishlist}
                            style={{
                                width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                background: wishlisted ? '#fee2e2' : 'var(--surface-3)',
                                transition: 'all .2s',
                            }}
                        >
                            <Heart size={20} fill={wishlisted ? '#ef4444' : 'none'} color={wishlisted ? '#ef4444' : '#64748b'} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews section */}
            <div style={{ marginTop: 56 }}>
                <div className="section-header">
                    <h2 className="section-title">Customer Reviews</h2>
                    {reviews.length > 0 && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                    )}
                </div>

                {/* Write review */}
                {user && (
                    <div className="card" style={{ padding: 24, marginBottom: 28 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Write a Review</h3>
                        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Your Rating</label>
                                <StarInput value={rating} onChange={setRating} />
                            </div>
                            <div className="form-group">
                                <label>Your Review</label>
                                <textarea
                                    id="review-comment"
                                    className="form-control"
                                    rows={3}
                                    placeholder="Share your experience with this product…"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <button id="submit-review-btn" type="submit" className="btn btn-secondary" disabled={submittingReview}>
                                    <Send size={14} /> {submittingReview ? 'Submitting…' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Review list */}
                {reviews.length === 0 ? (
                    <div className="empty-state">
                        <Star size={48} />
                        <h3>No reviews yet</h3>
                        <p>Be the first to review this product!</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '8px 24px' }}>
                        {reviews.map(r => (
                            <div key={r.reviewId} className="review-item">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                                            {r.username?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="review-author">{r.username}</p>
                                            <StarRating rating={r.rating} />
                                        </div>
                                    </div>
                                    <span className="review-date">{new Date(r.reviewDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <p className="review-comment">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
