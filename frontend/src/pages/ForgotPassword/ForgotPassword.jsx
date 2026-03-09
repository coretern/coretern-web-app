import React, { useState } from 'react';
import SEO from '../../Components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Lock, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../Login/Login.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Reset (OTP + New Password)
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
            toast.success('Reset OTP sent to your email!');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send reset OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                email,
                otp,
                password: newPassword
            });
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
            toast.success('New OTP sent to email.');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="auth-page">
            <SEO title="Forgot Password" noindex={true} />
            <Link to="/login" className="auth-back-home glass">
                <motion.div whileHover={{ x: -4 }} className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Login
                </motion.div>
            </Link>
            <div className="auth-bg-blob"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="auth-card glass"
            >
                <header className="auth-header">
                    <h1 className="outfit">{step === 1 ? 'Forgot Password' : 'Reset Password'}</h1>
                    <p className="text-text-muted">
                        {step === 1
                            ? "Enter your email to receive a password reset code"
                            : `Enter the code sent to ${email} and your new password`}
                    </p>
                </header>

                <AnimatePresence mode='wait'>
                    {step === 1 ? (
                        <motion.div
                            key="email-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <form onSubmit={handleSendOtp}>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email" required
                                            className="auth-input"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Mail className="input-icon" size={18} />
                                    </div>
                                </div>

                                <button disabled={loading} className="btn btn-primary auth-btn">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Send Reset OTP'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reset-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label className="form-label">Verification Code</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text" required maxLength="6"
                                            className="auth-input otp-input"
                                            placeholder="123456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <ShieldCheck className="input-icon" size={18} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password" required minLength="6"
                                            className="auth-input"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <Lock className="input-icon" size={18} />
                                    </div>
                                </div>

                                <button disabled={loading} className="btn btn-primary auth-btn">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                                </button>
                            </form>

                            <div className="resend-container">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="resend-btn"
                                >
                                    {resending ? <RefreshCw className="animate-spin" size={14} /> : 'Resend Code'}
                                </button>
                                <button onClick={() => setStep(1)} className="change-email-btn">
                                    Change Email
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
