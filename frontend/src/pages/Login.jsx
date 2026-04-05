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
                <Link to="/" className="auth-logo">
                    GUSTO
                </Link>
                
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-sub">Sign in to your account</p>

                {error && <div className="alert alert-error" id="login-error">{error}</div>}

                <form onSubmit={handleSubmit} id="login-form">
                    <div className="form-group">
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Username"
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
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                style={{ paddingRight: 44 }}
                            />
                            <button
                                type="button"
                                id="toggle-password"
                                onClick={() => setShowPwd(v => !v)}
                                style={{ 
                                    position: 'absolute', 
                                    right: 12, 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: '#666' 
                                }}
                            >
                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <button
                        id="login-submit"
                        type="submit"
                        className="btn-ajio"
                        style={{ width: '100%', marginTop: '12px', border: 'none', cursor: 'pointer' }}
                        disabled={loading}
                    >
                        {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 32, fontSize: '13px' }}>
                    <span className="text-muted">Not registered?</span>{' '}
                    <Link to="/signup" id="goto-signup" style={{ color: '#000', fontWeight: 700, borderBottom: '1px solid #000' }}>
                        Join Gusto
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
