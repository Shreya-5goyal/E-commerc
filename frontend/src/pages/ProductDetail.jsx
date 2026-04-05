import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SkeletonLoader from '../components/SkeletonLoader';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Heart, Star, ShieldCheck, Globe, RotateCcw, Percent, Gift, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [toast, setToast] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedImg, setSelectedImg] = useState(0);

    const wishlisted = isWishlisted(Number(id));

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [prodRes, revRes] = await Promise.all([
                    api.get(`/public/products/${id}`),
                    api.get(`/public/products/${id}/reviews`)
                ]);
                setProduct(prodRes.data);
                
                const relRes = await api.get(`/public/categories/${prodRes.data.category?.categoryId}/products?pageSize=4`);
                setRelated(relRes.data.content?.filter(p => p.productId !== Number(id)) || []);
            } catch {
                console.error("Fetch detail error");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
        window.scrollTo(0,0);
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        setAdding(true);
        const res = await addToCart(id, 1);
        if (res.success) {
            setToast('Item added to your bag.');
            setTimeout(() => setToast(null), 3000);
        }
        setAdding(false);
    };

    if (loading) return <SkeletonLoader type="detail" />;
    if (!product) return null;

    const originalPrice = product.price || 0;
    const currentPrice = product.specialPrice || originalPrice;
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    const gallery = [
        product.imageUrl || product.image,
        'https://picsum.photos/seed/a1/800/800',
        'https://picsum.photos/seed/a2/800/800',
        'https://picsum.photos/seed/a3/800/800'
    ];

    return (
        <div style={{ background: '#fff', padding: '150px 0 80px' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.7fr)', gap: 80 }}>
                    
                    {/* ── IMAGE GALLERY (AJIO STYLE GRID/THUMBS) ── */}
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {gallery.map((img, i) => (
                                <button key={i} onClick={() => setSelectedImg(i)} style={{ width: 70, height: 90, border: selectedImg === i ? '1px solid #111' : '1px solid #eee', overflow: 'hidden' }}>
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src='https://picsum.photos/seed/t/70/90'} />
                                </button>
                            ))}
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <img src={gallery[selectedImg]} style={{ width: '100%', height: 750, objectFit: 'cover' }} onError={e => e.target.src='https://picsum.photos/seed/main/800/800'} />
                        </div>
                    </div>

                    {/* ── PRODUCT CONTENT (AJIO DENSITY) ── */}
                    <div>
                        <div style={{ marginBottom: 30 }}>
                            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#333', textTransform: 'uppercase', marginBottom: 12 }}>{product.category?.categoryName || 'Indie Brand'}</h4>
                            <h1 style={{ fontSize: 24, fontWeight: 400, color: '#666', marginBottom: 16 }}>{product.productName}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 24, border: '1px solid #ffba00', padding: '4px 10px', borderRadius: 40, width: 'fit-content', background: '#fff8e1' }}>
                                 4.2 <Star size={12} fill="#ffba00" color="#ffba00" /> <span style={{ color: '#999', borderLeft: '1px solid #ddd', paddingLeft: 6 }}>128 Ratings</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                                <span style={{ fontSize: 24, fontWeight: 800 }}>₹{currentPrice}</span>
                                {discount > 0 && (
                                    <>
                                        <span style={{ fontSize: 16, color: '#999', textDecoration: 'line-through' }}>MRP ₹{originalPrice}</span>
                                        <span style={{ fontSize: 16, fontWeight: 800, color: '#ff905a' }}>({discount}% OFF)</span>
                                    </>
                                )}
                            </div>
                            <p style={{ fontSize: 11, color: '#31b147', fontWeight: 800 }}>Price inclusive of all taxes</p>
                        </div>

                        {/* OFFERS (AJIO STYLE) */}
                        <div style={{ border: '1px dashed #ddd', padding: 20, borderRadius: 8, marginBottom: 40, background: '#f9fafb' }}>
                            <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Percent size={14} color="#ff905a" /> Applicable Offers
                            </h4>
                            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <p>● Use Code: <b>AJIOMANIA</b> to get Flat 15% OFF (Min Order ₹2490)</p>
                                <p>● Pay via Mobikwik to get up to 10% Cashback</p>
                            </div>
                        </div>

                        {/* SIZE SELECTOR */}
                        <div style={{ marginBottom: 40 }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                 <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Select Size</h4>
                                 <button style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>SIZE CHART</button>
                             </div>
                             <div style={{ display: 'flex', gap: 12 }}>
                                 {['S', 'M', 'L', 'XL'].map(s => (
                                     <button 
                                        key={s} 
                                        onClick={() => setSelectedSize(s)}
                                        style={{ width: 50, height: 50, borderRadius: '50%', border: selectedSize === s ? '2px solid #111' : '1px solid #ddd', background: selectedSize === s ? '#111' : '#fff', color: selectedSize === s ? '#fff' : '#111', fontSize: 13, fontWeight: 700, transition: '0.2s' }}
                                     >
                                         {s}
                                     </button>
                                 ))}
                             </div>
                        </div>

                        {/* CTA */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 60 }}>
                            <button onClick={handleAddToCart} style={{ flex: 1, height: 56, background: '#111', color: '#fff', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, disabled: adding }}>
                                {adding ? 'Processing...' : 'Add to Bag'}
                            </button>
                            <button 
                                onClick={() => { if(!user) navigate('/login'); else (wishlisted ? removeFromWishlist(id) : addToWishlist(id)) }}
                                style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #111', color: wishlisted ? '#ff4081' : '#111' }}
                            >
                                <Heart size={20} fill={wishlisted ? '#ff4081' : 'none'} />
                            </button>
                        </div>

                        {/* DETAILS (EXPANDABLE STYLE) */}
                        <div style={{ borderTop: '1px solid #eee', paddingTop: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Product Details</h4>
                                <ChevronDown size={14} />
                            </div>
                            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {related.length > 0 && (
                    <div style={{ marginTop: 100, borderTop: '1px solid #eee', paddingTop: 60 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, textTransform: 'uppercase', marginBottom: 40 }}>Customers Also Liked</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                            {related.map(p => <ProductCard key={p.productId} product={p} />)}
                        </div>
                    </div>
                )}
            </div>

            {/* TOAST PANEL */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="toast-ajio">
                       <Check size={18} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetail;
