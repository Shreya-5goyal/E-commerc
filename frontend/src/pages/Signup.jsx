import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const { signup } = useAuth();
    const [userData, setUserData] = useState({ username: '', email: '', password: '', role: ['user'] });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setUserData({ ...userData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (userData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        const res = await signup(userData);
        setLoading(false);
        if (res.success) navigate('/login');
        else setError(res.message || 'Registration failed. Please try again.');
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                    <ShoppingBag size={24} color="#f59e0b" />
                    <span className="auth-logo" style={{ margin: 0 }}>Gusto</span>
                </Link>
                <h1 className="auth-title">Create account</h1>
                <p className="auth-sub">Join millions of happy Gusto customers</p>

                {error && <div className="alert alert-error" id="signup-error">{error}</div>}

                <form onSubmit={handleSubmit} id="signup-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-group">
                        <label htmlFor="signup-username">Username</label>
                        <input
                            id="signup-username"
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Choose a username"
                            value={userData.username}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="your@email.com"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="signup-password"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                className="form-control"
                                placeholder="At least 6 characters"
                                value={userData.password}
                                onChange={handleChange}
                                required
                                style={{ paddingRight: 44 }}
                            />
                            <button
                                type="button"
                                id="toggle-signup-password"
                                onClick={() => setShowPwd(v => !v)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
                            >
                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        id="signup-submit"
                        type="submit"
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: 4, padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" id="goto-login" style={{ color: 'var(--secondary)', fontWeight: 500 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
