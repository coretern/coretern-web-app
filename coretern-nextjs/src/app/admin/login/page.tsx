'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function AdminLoginPage() {
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

            // Verify admin role
            const me = await authAPI.me();
            if (me.data.role !== 'admin') {
                localStorage.removeItem('token');
                toast.error('Admin access only');
                return;
            }

            toast.success('Welcome, Admin!');
            router.push('/admin');
        } catch (err: any) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--background)]">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px] mx-4">
                <div className="glass rounded-[var(--radius-xl)] p-10 border border-[var(--border)] shadow-[var(--shadow-lg)]">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-[image:var(--grad-primary)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[var(--shadow-primary)]">
                            <Shield className="text-white" size={26} />
                        </div>
                        <h1 className="text-2xl font-extrabold mb-2 font-[family-name:var(--font-outfit)]">Admin Panel</h1>
                        <p className="text-[var(--text-muted)] text-[0.95rem]">Sign in to the admin dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input type="email" className="auth-input" placeholder="Admin Email"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input type="password" className="auth-input" placeholder="Password"
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary w-full !py-[0.85rem] !text-base">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
