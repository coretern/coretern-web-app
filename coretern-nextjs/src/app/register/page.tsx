'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Loader2, UserPlus, ChevronDown } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        phone: '', gender: '', agreedToTerms: false, agreedToPrivacy: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setForm({ ...form, [target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
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
        try {
            await authAPI.resendOtp({ email: form.email });
            toast.success('New OTP sent!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to resend OTP');
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

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-24">
            <Navbar />
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[480px] mx-4"
            >
                <div className="glass rounded-[var(--radius-xl)] p-10 border border-[var(--border)] shadow-[var(--shadow-lg)]">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-[image:var(--grad-primary)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[var(--shadow-primary)]">
                            <UserPlus className="text-white" size={26} />
                        </div>
                        <h1 className="text-[2rem] font-extrabold mb-2 font-[family-name:var(--font-outfit)]">
                            {showOtp ? 'Verify Email' : 'Create Account'}
                        </h1>
                        <p className="text-[var(--text-muted)] text-[0.95rem]">
                            {showOtp ? 'Enter the OTP sent to your email' : 'Join CoreTern to start your journey'}
                        </p>
                    </div>

                    {showOtp ? (
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input type="text" className="auth-input" placeholder="Enter 6-digit OTP"
                                        value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary w-full !py-[0.85rem]">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify OTP'}
                            </button>
                            <button type="button" onClick={handleResendOtp} className="btn btn-outline w-full">
                                Resend OTP
                            </button>
                        </form>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input type="text" name="name" className="auth-input" placeholder="Full Name"
                                        value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={18} />
                                    <input type="email" name="email" className="auth-input" placeholder="Email address"
                                        value={form.email} onChange={handleChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="input-wrapper">
                                        <Phone className="input-icon" size={18} />
                                        <input type="tel" name="phone" className="auth-input" placeholder="Phone"
                                            value={form.phone} onChange={handleChange} />
                                    </div>
                                    <div className="relative">
                                        <select name="gender" className="auth-input !pl-4 w-full appearance-none cursor-pointer"
                                            value={form.gender} onChange={handleChange} required>
                                            <option value="">Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input type={showPassword ? 'text' : 'password'} name="password" className="auth-input !pr-12"
                                        placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required minLength={6} />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] bg-transparent border-none cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input type="password" name="confirmPassword" className="auth-input"
                                        placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
                                </div>

                                <div className="flex flex-col gap-3 mt-2">
                                    <label className="flex items-start gap-3 cursor-pointer text-[0.85rem] text-[var(--text-muted)]">
                                        <input type="checkbox" name="agreedToTerms" checked={form.agreedToTerms}
                                            onChange={handleChange} className="mt-1 accent-[var(--color-primary)]" />
                                        <span>I agree to the <Link href="/terms" className="text-[var(--color-primary)]">Terms of Service</Link></span>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer text-[0.85rem] text-[var(--text-muted)]">
                                        <input type="checkbox" name="agreedToPrivacy" checked={form.agreedToPrivacy}
                                            onChange={handleChange} className="mt-1 accent-[var(--color-primary)]" />
                                        <span>I agree to the <Link href="/privacy" className="text-[var(--color-primary)]">Privacy Policy</Link></span>
                                    </label>
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-primary w-full !py-[0.85rem] !text-base mt-2">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
                                </button>
                            </form>

                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-[var(--border)]" />
                                <span className="text-[var(--text-muted)] text-[0.8rem] font-medium">OR</span>
                                <div className="flex-1 h-px bg-[var(--border)]" />
                            </div>

                            <div className="flex justify-center">
                                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google signup failed')}
                                    theme="filled_black" shape="pill" size="large" />
                            </div>
                        </>
                    )}

                    <p className="text-center text-[var(--text-muted)] text-[0.9rem] mt-8">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
