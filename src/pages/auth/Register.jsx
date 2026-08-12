import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', organisationName: '' });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const { initiateRegister, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Step 1: Submit registration form → sends OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await initiateRegister(form);
            setStep(2);
            startResendCooldown();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Submit OTP → verify and create account
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await verifyOtp(form.email, otp);
            navigate('/app/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP with 60s cooldown
    const handleResendOtp = async () => {
        setError('');
        setLoading(true);
        try {
            await initiateRegister(form);
            setOtp('');
            startResendCooldown();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="auth-page relative">
            <div className="fixed top-8 right-8 z-50">
                <ThemeToggle className="bg-surface border border-line" />
            </div>
            <div className="auth-card card max-w-lg w-full animate-fade-in">
                <div className="auth-header mb-8 text-center flex flex-col items-center">
                    <Link to="/" aria-label="SINA People home">
                        <img src="/sina-people.svg" alt="SINA People" className="w-12 h-12 rounded-2xl mb-4 hover:scale-105 transition-transform" />
                    </Link>
                    <h1 className="auth-logo text-xl font-bold tracking-tighter text-bright mb-2">SINA People</h1>
                    <p className="auth-subtitle text-[15px] text-subtle">
                        {step === 1 ? 'Create your organisation' : 'Verify your email'}
                    </p>
                </div>
                {error && <div className="error-msg p-3 bg-error/10 text-error rounded-xl mb-6 text-sm text-center">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label className="form-label text-sm font-medium text-dim mb-1" htmlFor="reg-org">Organisation Name</label>
                            <input id="reg-org" name="organisationName" className="form-input" value={form.organisationName}
                                onChange={handleChange} placeholder="Your Company" required />
                        </div>
                        <div className="form-group mb-4">
                            <label className="form-label text-sm font-medium text-dim mb-1" htmlFor="reg-name">Your Name</label>
                            <input id="reg-name" name="name" className="form-input" value={form.name}
                                onChange={handleChange} placeholder="John Doe" required />
                        </div>
                        <div className="form-group mb-4">
                            <label className="form-label text-sm font-medium text-dim mb-1" htmlFor="reg-email">Email</label>
                            <input id="reg-email" name="email" type="email" className="form-input" value={form.email}
                                onChange={handleChange} placeholder="admin@company.com" required />
                        </div>
                        <div className="form-group mb-6">
                            <label className="form-label text-sm font-medium text-dim mb-1" htmlFor="reg-password">Password</label>
                            <input id="reg-password" name="password" type="password" className="form-input" value={form.password}
                                onChange={handleChange} placeholder="Min 6 characters" required minLength={6} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Create Organisation'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-dim)' }}>
                            We've sent a 6-digit code to <strong>{form.email}</strong>
                        </p>
                        <div className="form-group">
                            <label className="form-label" htmlFor="reg-otp">Verification Code</label>
                            <input
                                id="reg-otp"
                                className="form-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit code"
                                required
                                maxLength={6}
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading || otp.length !== 6}>
                            {loading ? 'Verifying...' : 'Verify & Create Account'}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0 || loading}
                                style={{ fontSize: '0.875rem' }}
                            >
                                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                            </button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => { setStep(1); setOtp(''); setError(''); }}
                                style={{ fontSize: '0.875rem' }}
                            >
                                ← Back to registration
                            </button>
                        </div>
                    </form>
                )}

                <div className="auth-footer mt-6 text-center text-sm text-subtle">
                    Already have an account? <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
