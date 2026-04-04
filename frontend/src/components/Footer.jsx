import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <ShoppingBag size={22} color="#f59e0b" />
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: '#f59e0b' }}>Gusto</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7 }}>
                            India's favourite place to shop for everything you need, delivered fast.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Shop</h4>
                        <ul>
                            <li><Link to="/search?keyword=electronics">Electronics</Link></li>
                            <li><Link to="/search?keyword=fashion">Fashion</Link></li>
                            <li><Link to="/search?keyword=books">Books</Link></li>
                            <li><Link to="/search?keyword=sports">Sports</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Account</h4>
                        <ul>
                            <li><Link to="/profile">My Profile</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/login">Sign In</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Help</h4>
                        <ul>
                            <li><a href="#">Shipping Info</a></li>
                            <li><a href="#">Returns</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Gusto E-Commerce. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <a href="#" style={{ fontSize: '0.8rem', color: '#64748b' }}>Privacy Policy</a>
                        <a href="#" style={{ fontSize: '0.8rem', color: '#64748b' }}>Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
