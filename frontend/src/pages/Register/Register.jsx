import React, { useState } from 'react';
import SEO from '../../Components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        agreedToTerms: false,
        agreedToPrivacy: false
    });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Register, 2: OTP
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
            toast.success(data.message || 'OTP sent to your email!');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                email: formData.email,
                otp
            });
            localStorage.setItem('token', data.token);
            toast.success('Email verified! Registration successful');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, {
                email: formData.email
            });
            toast.success(data.message || 'OTP resent successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                tokenId: credentialResponse.credential
            });
            localStorage.setItem('token', data.token);
            toast.success('Logged in with Google!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Google Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <SEO title="Create Account" noindex={true} />
            <Link to="/" className="auth-back-home glass">
                <motion.div whileHover={{ x: -4 }} className="flex items-center gap-2">
                    <span className="text-xl">←</span> Back to Home
                </motion.div>
            </Link>
            <div className="auth-bg-blob"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="auth-card register-card glass"
            >
                <header className="auth-header">
                    <h1 className="outfit">{step === 1 ? 'Create Account' : 'Verify Email'}</h1>
                    <p className="text-text-muted">
                        {step === 1
                            ? 'Start your journey with CoreTern today'
                            : `We've sent a 6-digit code to ${formData.email}`}
                    </p>
                </header>

                <AnimatePresence mode='wait'>
                    {step === 1 ? (
                        <motion.div
                            key="register-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text" required
                                                className="auth-input"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <User className="input-icon" size={18} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text" required
                                                className="auth-input"
                                                placeholder="+91..."
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                            <Phone className="input-icon" size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email" required
                                            className="auth-input"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <Mail className="input-icon" size={18} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password" required
                                            className="auth-input"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <Lock className="input-icon" size={18} />
                                    </div>
                                </div>

                                <div className="legal-checkboxes">
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="agreedToTerms"
                                            required
                                            checked={formData.agreedToTerms}
                                            onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                        />
                                        <label htmlFor="agreedToTerms">
                                            I agree to the <Link to="/terms" target="_blank">Terms of Service</Link>
                                        </label>
                                    </div>
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="agreedToPrivacy"
                                            required
                                            checked={formData.agreedToPrivacy}
                                            onChange={(e) => setFormData({ ...formData, agreedToPrivacy: e.target.checked })}
                                        />
                                        <label htmlFor="agreedToPrivacy">
                                            I agree to the <Link to="/privacy" target="_blank">Privacy Policy</Link>
                                        </label>
                                    </div>
                                </div>

                                <button disabled={loading} className="btn btn-primary auth-btn">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                                </button>
                            </form>

                            <div className="auth-divider">
                                <span>OR</span>
                            </div>

                            <div className="google-login-container">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => toast.error('Google Login Failed')}
                                    useOneTap
                                    theme="filled_blue"
                                    shape="pill"
                                />

                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
                                    By continuing, you agree to our <Link to="/terms" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms</Link> & <Link to="/privacy" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <form onSubmit={handleVerifyOtp}>
                                <div className="form-group">
                                    <label className="form-label">Verification Code</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            required
                                            maxLength="6"
                                            className="auth-input otp-input"
                                            placeholder="123456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <ShieldCheck className="input-icon" size={18} />
                                    </div>
                                </div>

                                <button disabled={loading} className="btn btn-primary auth-btn">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Verify & Register'}
                                </button>
                            </form>

                            <div className="resend-container">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="resend-btn"
                                >
                                    {resending ? (
                                        <RefreshCw className="animate-spin" size={14} />
                                    ) : (
                                        'Resend Code'
                                    )}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="change-email-btn"
                                >
                                    Change Email
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
