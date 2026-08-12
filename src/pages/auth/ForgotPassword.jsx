import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ThemeToggle from '../../components/ThemeToggle';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
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
                    <p className="auth-subtitle text-[15px] text-subtle">
                        {sent ? 'Check your email' : 'Reset your password'}
                    </p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                {sent ? (
                    <div className="text-center">
                        <p style={{ marginBottom: '1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                            If an account exists for <strong>{email}</strong>, we've sent a link to reset your password.
                            The link expires in 1 hour.
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary btn-block btn-lg"
                            onClick={() => setSent(false)}
                        >
                            Send another link
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Enter your account email and we'll send you a link to reset your password.
                        </p>
                        <div className="form-group">
                            <label className="form-label text-sm font-medium text-dim mb-1" htmlFor="forgot-email">Email</label>
                            <input id="forgot-email" type="email" className="form-input" value={email}
                                onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required autoFocus />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="auth-footer mt-6 text-center text-sm text-subtle">
                    Remembered it? <Link to="/login" className="text-accent font-semibold hover:underline">Back to sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
