'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1=email, 2=otp+password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.forgotPassword({ email });
            toast.success('Reset OTP sent to your email');
            setStep(2);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            const data = await authAPI.resetPassword({ email, otp, password });
            localStorage.setItem('token', data.token);
            toast.success('Password reset successful!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Navbar />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px] mx-4">
                <div className="glass rounded-[var(--radius-xl)] p-10 border border-[var(--border)] shadow-[var(--shadow-lg)]">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-[image:var(--grad-primary)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[var(--shadow-primary)]">
                            <ShieldCheck className="text-white" size={26} />
                        </div>
                        <h1 className="text-2xl font-extrabold mb-2 font-[family-name:var(--font-outfit)]">
                            {step === 1 ? 'Reset Password' : 'Enter New Password'}
                        </h1>
                        <p className="text-[var(--text-muted)] text-[0.95rem]">
                            {step === 1 ? 'Enter your email to receive a reset OTP' : 'Enter the OTP and your new password'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input type="email" className="auth-input" placeholder="Email address"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary w-full !py-[0.85rem]">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send OTP <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input type="text" className="auth-input" placeholder="Enter 6-digit OTP"
                                    value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
                            </div>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input type="password" className="auth-input" placeholder="New Password (min 6 chars)"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary w-full !py-[0.85rem]">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
