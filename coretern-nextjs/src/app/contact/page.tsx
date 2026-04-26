'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, MapPin, Send, Loader2, ExternalLink, Globe } from 'lucide-react';
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

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.85rem 1.25rem',
        borderRadius: '14px',
        background: 'var(--background)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.5px',
        paddingLeft: '4px',
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '5rem', background: 'var(--background)' }}>
            <Navbar />

            {/* Hero */}
            <section style={{ padding: '4rem 0 3rem', background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08), transparent 70%)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="outfit"
                        style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}
                    >
                        Get in <span className="gradient-text">Touch</span>
                    </motion.h1>
                    <p style={{ maxWidth: '600px', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 auto' }}>
                        Have questions about our internships or facing issues with your account? Our team is here to help you 24/7.
                    </p>
                </div>
            </section>

            {/* Main */}
            <main className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem', marginBottom: '5rem', alignItems: 'start', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }} className="contact-grid-wrap">
                    
                    {/* Info Card */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <h2 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Contact Information</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0' }}>Feel free to reach out via any of these channels.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                {[
                                    { icon: Mail, label: 'Email Us', value: 'coreterndev@gmail.com' },
                                    { icon: Phone, label: 'Call Us', value: '+91 98765 43210' },
                                    { icon: MapPin, label: 'Location', value: 'Innovation Hub, Bangalore' },
                                    { icon: MessageCircle, label: 'Working Hours', value: 'Mon-Sat, 10am-6pm IST' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '0.5rem 0' }}>
                                        <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 700 }}>{item.label}</h3>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div style={{ marginTop: '2.5rem' }}>
                                <h4 className="outfit" style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1rem' }}>Connect with us</h4>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {[ExternalLink, ExternalLink, ExternalLink, Globe].map((Icon, i) => (
                                        <motion.a key={i} whileHover={{ y: -5 }} href="#"
                                            style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', transition: 'all 0.3s ease' }}>
                                            <Icon size={18} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ padding: '2rem', borderRadius: '24px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="contact-form-row">
                                    <div>
                                        <label style={labelStyle}>Full Name <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" placeholder="John Doe" required style={inputStyle}
                                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Phone Number <span style={{ color: 'red' }}>*</span></label>
                                        <input type="tel" placeholder="10-digit number" required maxLength={10} style={inputStyle}
                                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Email Address <span style={{ color: 'red' }}>*</span></label>
                                    <input type="email" placeholder="john@example.com" required style={inputStyle}
                                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Subject <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" placeholder="e.g., Website, App Development" required style={inputStyle}
                                        value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                                </div>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Your Message <span style={{ color: 'red' }}>*</span></label>
                                    <textarea rows={5} placeholder="Write your message here..." required
                                        style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                                </div>
                                <button type="submit" disabled={loading} className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 700 }}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
