import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/app/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page relative">
            <div className="fixed top-8 right-8 z-50">
                <ThemeToggle className="bg-surface border border-line" />
            </div>
            <div className="auth-card card max-w-md w-full animate-fade-in">
                <div className="auth-header mb-8 text-center flex flex-col items-center">
                    <Link to="/" aria-label="SINA People home">
                        <img src="/sina-people.svg" alt="SINA People" className="w-12 h-12 rounded-2xl mb-4 hover:scale-105 transition-transform" />
                    </Link>
                    <h1 className="auth-logo text-xl font-bold tracking-tighter text-bright mb-2">SINA People</h1>
                    <p className="auth-subtitle text-[15px] text-subtle">Sign in to your account</p>
                </div>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label text-sm font-medium text-dim mb-1" htmlFor="login-email">Email</label>
                        <input id="login-email" type="email" className="form-input" value={email}
                            onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
                    </div>
                    <div className="form-group mb-6">
                        <label className="form-label text-sm font-medium text-dim mb-1" htmlFor="login-password">Password</label>
                        <input id="login-password" type="password" className="form-input" value={password}
                            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                        <Link to="/forgot-password" className="text-xs text-subtle font-medium hover:text-accent hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </form>
                <div className="auth-footer mt-6 text-center text-sm text-subtle">
                    Don't have an account? <Link to="/register" className="text-accent font-semibold hover:underline">Register your organisation</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
