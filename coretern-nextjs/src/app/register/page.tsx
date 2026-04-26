'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader2, ShieldCheck, RefreshCw, UserCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '', email: '', password: '',
        phone: '', gender: '', agreedToTerms: false, agreedToPrivacy: false
    });
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [resending, setResending] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        let value: any = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        if (target.name === 'phone') value = value.replace(/\D/g, '');
        setForm({ ...form, [target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.agreedToTerms || !form.agreedToPrivacy) {
            return toast.error('Please agree to Terms and Privacy Policy');
        }
        setLoading(true);
        try {
            await authAPI.register(form);
            toast.success('OTP sent to your email!');
            setShowOtp(true);
        } catch (err: any) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authAPI.verifyOtp({ email: form.email, otp });
            localStorage.setItem('token', data.token);
            toast.success('Account verified!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        try {
            await authAPI.resendOtp({ email: form.email });
            toast.success('New OTP sent!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            const data = await authAPI.google({ tokenId: credentialResponse.credential });
            localStorage.setItem('token', data.token);
            toast.success('Signed up with Google!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Google signup failed');
        } finally {
            setLoading(false);
        }
    };

    const s = {
        page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative' as const, overflow: 'hidden' as const, background: 'var(--background)' },
        backLink: { alignSelf: 'flex-start' as const, padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem', textDecoration: 'none' },
        blob: { position: 'fixed' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', maxWidth: '800px', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.1, zIndex: -1, pointerEvents: 'none' as const },
        card: { width: '100%', maxWidth: '460px', borderRadius: 'var(--radius-xl)', background: 'var(--surface)', border: '1px solid var(--border)', position: 'relative' as const, zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' },
        header: { textAlign: 'center' as const, marginBottom: '2rem' },
        title: { fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)', letterSpacing: '-0.02em' },
        subtitle: { fontSize: '0.95rem', color: 'var(--text-muted)' },
        formGroup: { marginBottom: '1.1rem' },
        formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' },
        label: { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.6rem', textTransform: 'uppercase' as const, letterSpacing: '0.03em' },
        inputWrap: { position: 'relative' as const, display: 'flex', alignItems: 'center' },
        input: { width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s' },
        select: { width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s', appearance: 'none' as const, cursor: 'pointer' },
        inputIcon: { position: 'absolute' as const, left: '1rem', color: 'var(--text-muted)', pointerEvents: 'none' as const },
        checkbox: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' },
        btn: { width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', letterSpacing: '0.02em', transition: 'all 0.3s', marginTop: '1.5rem' },
        divider: { display: 'flex', alignItems: 'center', margin: '1.5rem 0' },
        dividerLine: { flex: 1, height: '1px', background: 'var(--border)' },
        dividerText: { padding: '0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 },
        googleWrap: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', width: '100%' },
        termsText: { fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' as const },
        footer: { textAlign: 'center' as const, marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' },
        resendWrap: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0 0.5rem' },
        resendBtn: { background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    };

    return (
        <div style={s.page}>
            <div style={{ width: '100%', maxWidth: '460px' }}>
                <Link href="/" style={s.backLink}>
                    <span style={{ fontSize: '1.1rem' }}>←</span> Back to Home
                </Link>
            </div>
            <div style={s.blob} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ ...s.card, padding: '3rem 2.5rem' }}
                className="auth-card"
            >
                <header style={s.header}>
                    <h1 style={s.title} className="outfit">
                        {showOtp ? 'Verify Email' : 'Create Account'}
                    </h1>
                    <p style={s.subtitle}>
                        {showOtp ? `We've sent a 6-digit code to ${form.email}` : 'Start your journey with CoreTern today'}
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {showOtp ? (
                        <motion.div
                            key="otp-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <form onSubmit={handleVerifyOtp}>
                                <div style={s.formGroup}>
                                    <label style={s.label}>Verification Code</label>
                                    <div style={s.inputWrap}>
                                        <input
                                            type="text" style={{ ...s.input, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 800 }}
                                            placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required
                                        />
                                        <ShieldCheck style={s.inputIcon} size={18} />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Register'}
                                </button>
                            </form>
                            <div style={s.resendWrap}>
                                <button onClick={handleResendOtp} disabled={resending} style={s.resendBtn}>
                                    {resending ? <RefreshCw className="animate-spin" size={14} /> : 'Resend Code'}
                                </button>
                                <button onClick={() => setShowOtp(false)} style={s.resendBtn}>
                                    Change Email
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div style={s.formGroup}>
                                    <label style={s.label}>Full Name <span style={{color: '#ef4444'}}>*</span></label>
                                    <div style={s.inputWrap}>
                                        <input type="text" name="name" style={s.input} placeholder="John Doe"
                                            value={form.name} onChange={handleChange} required />
                                        <User style={s.inputIcon} size={18} />
                                    </div>
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.label}>Gender <span style={{color: '#ef4444'}}>*</span></label>
                                    <div style={s.inputWrap}>
                                        <select name="gender" style={s.select} value={form.gender} onChange={handleChange} required>
                                            <option value="" disabled>Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <UserCircle style={{ ...s.inputIcon, pointerEvents: 'none' }} size={18} />
                                    </div>
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.label}>Phone Number <span style={{color: '#ef4444'}}>*</span></label>
                                    <div style={s.inputWrap}>
                                        <input type="tel" name="phone" style={s.input} placeholder="10-digit number"
                                            value={form.phone} onChange={handleChange} required maxLength={10} minLength={10} pattern="[0-9]{10}" title="Please enter exactly 10 digits" />
                                        <Phone style={s.inputIcon} size={18} />
                                    </div>
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.label}>Email Address <span style={{color: '#ef4444'}}>*</span></label>
                                    <div style={s.inputWrap}>
                                        <input type="email" name="email" style={s.input} placeholder="name@example.com"
                                            value={form.email} onChange={handleChange} required />
                                        <Mail style={s.inputIcon} size={18} />
                                    </div>
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.label}>Password <span style={{color: '#ef4444'}}>*</span></label>
                                    <div style={s.inputWrap}>
                                        <input type="password" name="password" style={s.input} placeholder="••••••••"
                                            value={form.password} onChange={handleChange} required minLength={6} />
                                        <Lock style={s.inputIcon} size={18} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '0.5rem' }}>
                                    <label style={s.checkbox}>
                                        <input type="checkbox" name="agreedToTerms" checked={form.agreedToTerms}
                                            onChange={handleChange} style={{ marginTop: '2px', accentColor: 'var(--color-primary)', cursor: 'pointer', width: '16px', height: '16px' }} />
                                        <span>I agree to the <Link href="/terms" style={{ color: 'var(--color-primary)' }}>Terms of Service</Link></span>
                                    </label>
                                    <label style={s.checkbox}>
                                        <input type="checkbox" name="agreedToPrivacy" checked={form.agreedToPrivacy}
                                            onChange={handleChange} style={{ marginTop: '2px', accentColor: 'var(--color-primary)', cursor: 'pointer', width: '16px', height: '16px' }} />
                                        <span>I agree to the <Link href="/privacy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link></span>
                                    </label>
                                </div>

                                <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                                </button>
                            </form>

                            <div style={s.divider}>
                                <div style={s.dividerLine} />
                                <span style={s.dividerText}>OR</span>
                                <div style={s.dividerLine} />
                            </div>

                            <div style={s.googleWrap}>
                                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google signup failed')}
                                    theme="filled_blue" shape="pill" />
                                <p style={s.termsText}>
                                    By continuing, you agree to our{' '}
                                    <Link href="/terms" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Terms</Link>
                                    {' '}&{' '}
                                    <Link href="/privacy" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={s.footer}>
                    <p>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
