import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await login(credentials);
        setLoading(false);
        if (res.success) navigate('/');
        else setError(res.message || 'Invalid username or password.');
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                    <ShoppingBag size={24} color="#f59e0b" />
                    <span className="auth-logo" style={{ margin: 0 }}>Gusto</span>
                </Link>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-sub">Sign in to your account to continue</p>

                {error && <div className="alert alert-error" id="login-error">{error}</div>}

                <form onSubmit={handleSubmit} id="login-form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-group">
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Enter your username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="login-password"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                style={{ paddingRight: 44 }}
                            />
                            <button
                                type="button"
                                id="toggle-password"
                                onClick={() => setShowPwd(v => !v)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
                            >
                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        id="login-submit"
                        type="submit"
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: 4, padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    New to Gusto?{' '}
                    <Link to="/signup" id="goto-signup" style={{ color: 'var(--secondary)', fontWeight: 500 }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
