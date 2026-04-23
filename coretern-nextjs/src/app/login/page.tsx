'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <Navbar />
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] mx-4"
            >
                <div className="glass rounded-[var(--radius-xl)] p-10 border border-[var(--border)] shadow-[var(--shadow-lg)]">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-[image:var(--grad-primary)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[var(--shadow-primary)]">
                            <Sparkles className="text-white" size={26} />
                        </div>
                        <h1 className="text-[2rem] font-extrabold mb-2 font-[family-name:var(--font-outfit)]">Welcome Back</h1>
                        <p className="text-[var(--text-muted)] text-[0.95rem]">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="form-group">
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email" className="auth-input" placeholder="Email address"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'} className="auth-input !pr-12"
                                    placeholder="Password" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] bg-transparent border-none cursor-pointer hover:text-[var(--text)]"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end -mt-2">
                            <Link href="/forgot-password" className="text-[0.85rem] text-[var(--color-primary)] font-medium hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full !py-[0.85rem] !text-base">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-[var(--border)]" />
                        <span className="text-[var(--text-muted)] text-[0.8rem] font-medium">OR</span>
                        <div className="flex-1 h-px bg-[var(--border)]" />
                    </div>

                    {/* Google Login */}
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google login failed')}
                            theme="filled_black"
                            shape="pill"
                            size="large"
                            width="100%"
                        />
                    </div>

                    <p className="text-center text-[var(--text-muted)] text-[0.9rem] mt-8">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
