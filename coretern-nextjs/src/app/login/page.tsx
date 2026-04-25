'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authAPI.login({ email, password });
            localStorage.setItem('token', data.token);
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            const data = await authAPI.google({ tokenId: credentialResponse.credential });
            localStorage.setItem('token', data.token);
            toast.success('Google login successful!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const s = {
        page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative' as const, overflow: 'hidden' as const, background: 'var(--background)' },
        backLink: { alignSelf: 'flex-start' as const, padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem', textDecoration: 'none' },
        blob: { position: 'fixed' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', maxWidth: '800px', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.1, zIndex: -1, pointerEvents: 'none' as const },
        card: { width: '100%', maxWidth: '460px', borderRadius: 'var(--radius-xl)', background: 'var(--surface)', border: '1px solid var(--border)', position: 'relative' as const, zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' },
        header: { textAlign: 'center' as const, marginBottom: '2.5rem' },
        title: { fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)', letterSpacing: '-0.02em' },
        subtitle: { fontSize: '0.95rem', color: 'var(--text-muted)' },
        formGroup: { marginBottom: '1.25rem' },
        label: { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.6rem', textTransform: 'uppercase' as const, letterSpacing: '0.03em' },
        inputWrap: { position: 'relative' as const, display: 'flex', alignItems: 'center' },
        input: { width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s' },
        inputIcon: { position: 'absolute' as const, left: '1rem', color: 'var(--text-muted)', pointerEvents: 'none' as const },
        forgotLink: { textAlign: 'right' as const, marginTop: '-0.5rem', marginBottom: '1.5rem' },
        btn: { width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', letterSpacing: '0.02em', transition: 'all 0.3s' },
        divider: { display: 'flex', alignItems: 'center', margin: '1.5rem 0' },
        dividerLine: { flex: 1, height: '1px', background: 'var(--border)' },
        dividerText: { padding: '0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 },
        googleWrap: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', width: '100%' },
        termsText: { fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' as const },
        footer: { textAlign: 'center' as const, marginTop: '2.5rem', fontSize: '0.95rem', color: 'var(--text-muted)', paddingTop: '2rem', borderTop: '1px solid var(--border)' },
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
                    <h1 style={s.title} className="outfit">Welcome Back</h1>
                    <p style={s.subtitle}>Access your personalized dashboard</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div style={s.formGroup}>
                        <label style={s.label}>Email Address</label>
                        <div style={s.inputWrap}>
                            <input
                                type="email" style={s.input} placeholder="name@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                            <Mail style={s.inputIcon} size={18} />
                        </div>
                    </div>

                    <div style={s.formGroup}>
                        <label style={s.label}>Password</label>
                        <div style={s.inputWrap}>
                            <input
                                type="password" style={s.input} placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                            <Lock style={s.inputIcon} size={18} />
                        </div>
                    </div>

                    <div style={s.forgotLink}>
                        <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <div style={s.divider}>
                    <div style={s.dividerLine} />
                    <span style={s.dividerText}>OR</span>
                    <div style={s.dividerLine} />
                </div>

                <div style={s.googleWrap}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error('Google login failed')}
                        theme="filled_blue"
                        shape="pill"
                    />
                    <p style={s.termsText}>
                        By continuing, you agree to our{' '}
                        <Link href="/terms" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Terms</Link>
                        {' '}&{' '}
                        <Link href="/privacy" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
                    </p>
                </div>

                <div style={s.footer}>
                    <p>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 700, padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Sign Up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
