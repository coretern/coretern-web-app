'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, MessageSquare, Send, Loader2, MapPin, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { ticketAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ticketAPI.create(form);
            toast.success('Message sent! We\'ll get back to you soon.');
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err: any) {
            toast.error(err.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                        <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold mb-4 font-[family-name:var(--font-outfit)]">
                            Get in <span className="gradient-text">Touch</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-lg max-w-[600px] mx-auto">
                            Have a question or want to work with us? We&apos;d love to hear from you.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-[1fr_1.2fr] gap-12 max-[900px]:grid-cols-1">
                        {/* Info Cards */}
                        <div className="flex flex-col gap-6">
                            {[
                                { icon: Mail, title: 'Email Us', text: 'coreterndev@gmail.com', sub: 'We reply within 24 hours' },
                                { icon: Phone, title: 'Call Us', text: '+91 98765 43210', sub: 'Mon-Sat, 10am-6pm IST' },
                                { icon: MapPin, title: 'Visit Us', text: 'Innovation Hub, Bangalore', sub: 'By appointment only' },
                                { icon: Clock, title: 'Working Hours', text: '10:00 AM - 6:00 PM', sub: 'Monday to Saturday' }
                            ].map((card, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                    className="glass p-6 rounded-2xl border border-[var(--border)] flex items-start gap-5 hover:border-[rgba(99,102,241,0.3)] transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-[rgba(99,102,241,0.1)] flex items-center justify-center shrink-0">
                                        <card.icon size={22} className="text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[1.05rem] mb-1">{card.title}</h3>
                                        <p className="text-[var(--text)] text-[0.95rem]">{card.text}</p>
                                        <p className="text-[var(--text-muted)] text-[0.8rem] mt-1">{card.sub}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] flex flex-col gap-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[image:var(--grad-primary)] rounded-xl flex items-center justify-center">
                                    <Sparkles className="text-white" size={20} />
                                </div>
                                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Send a Message</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input type="text" className="auth-input" placeholder="Your Name" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={18} />
                                    <input type="email" className="auth-input" placeholder="Your Email" value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                                <div className="input-wrapper">
                                    <Phone className="input-icon" size={18} />
                                    <input type="tel" className="auth-input" placeholder="Phone" value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                                </div>
                                <div className="input-wrapper">
                                    <MessageSquare className="input-icon" size={18} />
                                    <input type="text" className="auth-input" placeholder="Subject" value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                                </div>
                            </div>
                            <textarea className="w-full p-4 bg-[var(--surface-light)] border border-[var(--border)] rounded-[var(--radius-lg)] text-[var(--text)] min-h-[140px] resize-y focus:outline-none focus:border-[var(--color-primary)]"
                                placeholder="Your message..." value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                            <button type="submit" disabled={loading} className="btn btn-primary w-full !py-3 !text-base">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Message</>}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
