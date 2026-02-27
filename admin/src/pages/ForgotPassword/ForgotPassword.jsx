import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Lock, Loader2, ArrowLeft, RefreshCw, Shield } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ForgotPassword.css';

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
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            toast.success('Admin reset OTP sent to your email!');
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
            await axios.put('http://localhost:5000/api/auth/reset-password', {
                email,
                otp,
                password: newPassword
            });
            toast.success('Password updated! Redirecting to command center...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            toast.success('New OTP sent to admin email.');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="admin-login-page">
            <Link to="/login" className="admin-back-btn glass">
                <ArrowLeft size={18} /> Back to Login
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card admin-login-card glass"
            >
                <header className="admin-login-header">
                    <div className="admin-shield-icon">
                        <Shield size={32} />
                    </div>
                    <h1 className="admin-login-title outfit">
                        {step === 1 ? 'Credential Recovery' : 'Reset Protocol'}
                    </h1>
                    <p className="admin-login-subtitle">
                        {step === 1
                            ? "Initiate secure password recovery for admin access"
                            : `Authorized code sent to ${email}`}
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
                                <div className="admin-form-group">
                                    <label className="admin-label">Admin Email</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email" required
                                            className="admin-input"
                                            placeholder="admin@techstart.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Mail className="input-icon" size={18} />
                                    </div>
                                </div>

                                <button disabled={loading} className="btn btn-primary admin-login-btn justify-center">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Send Recovery Code'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reset-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <form onSubmit={handleResetPassword}>
                                <div className="admin-form-group">
                                    <label className="admin-label">Verification Code</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text" required maxLength="6"
                                            className="admin-input"
                                            placeholder="Enter 6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <ShieldCheck className="input-icon" size={18} />
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">New Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password" required minLength="6"
                                            className="admin-input"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <Lock className="input-icon" size={18} />
                                    </div>
                                </div>

                                <button disabled={loading} className="btn btn-primary admin-login-btn justify-center">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Update Credentials'}
                                </button>
                            </form>

                            <div className="admin-resend-container">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="admin-resend-btn"
                                >
                                    {resending ? <RefreshCw className="animate-spin" size={14} /> : 'Resend Code'}
                                </button>
                                <button onClick={() => setStep(1)} className="admin-change-email-btn">
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
