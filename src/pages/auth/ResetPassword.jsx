import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { setAuthData } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/auth/reset-password', { token, password });

            // Log in the user automatically
            setAuthData(data.data);

            navigate('/app/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
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
                    <p className="auth-subtitle text-[15px] text-subtle">Choose a new password for your account.</p>
                </div>

                {error && <div className="error-msg" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        disabled={loading}
                        style={{ marginTop: '1rem' }}
                    >
                        {loading ? <div className="spinner spinner-sm"></div> : 'Reset Password & Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
