'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Wallet, BookOpen, Loader2, CheckCircle2, X, Shield, GraduationCap, Users, Award } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { internshipAPI, enrollmentAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function InternshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [internship, setInternship] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: '', gender: '', collegeRegNumber: '', collegeName: '',
        course: '', branch: '', startDate: '', endDate: '',
        whatsappNumber: '', email: '', agreedToRefundPolicy: false
    });

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const data = await internshipAPI.getById(id);
                setInternship(data.data);
            } catch (err) {
                toast.error('Internship not found');
                router.push('/internships');
            } finally {
                setLoading(false);
            }
        };
        fetchInternship();
    }, [id, router]);

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }
        if (!form.agreedToRefundPolicy) { toast.error('Please agree to the refund policy'); return; }

        setEnrolling(true);
        try {
            const formData = new FormData();
            formData.append('internshipId', id);
            Object.entries(form).forEach(([key, val]) => formData.append(key, String(val)));

            const data = await enrollmentAPI.enroll(formData);

            if (data.payment_session_id) {
                // Redirect to Cashfree payment
                const cashfree = (window as any).Cashfree?.({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox' });
                if (cashfree) {
                    cashfree.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
                } else {
                    toast.error('Payment gateway not loaded. Please refresh and try again.');
                }
            }
        } catch (err: any) {
            toast.error(err.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} style={{ color: 'var(--color-primary)' }} />
            </div>
        );
    }

    if (!internship) return null;

    const imageUrl = internship.image?.startsWith('http') ? internship.image : `/uploads/${internship.image}`;

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-muted)',
        marginBottom: '6px',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        background: 'var(--background)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    return (
        <div>
            <Navbar />

            <section style={{ minHeight: '100vh', paddingTop: '6.5rem', paddingBottom: '3rem' }}>
                <div className="container" style={{ maxWidth: '960px' }}>

                    {/* Back Link */}
                    <Link href="/internships" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                        <ArrowLeft size={18} /> Back to Internships
                    </Link>

                    {/* Hero Banner */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="intern-detail-hero">
                        <img src={imageUrl} alt={internship.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 2.5rem', zIndex: 1 }}>
                            <span style={{ display: 'inline-block', padding: '0.35rem 0.9rem', borderRadius: '8px', background: 'rgba(99,102,241,0.25)', backdropFilter: 'blur(10px)', color: '#a5b4fc', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', border: '1px solid rgba(99,102,241,0.3)' }}>
                                {internship.domain}
                            </span>
                            <h1 className="outfit" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.15 }}>
                                {internship.title}
                            </h1>
                        </div>
                    </motion.div>

                    {/* Meta Info Cards */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="intern-detail-meta">
                        {[
                            { icon: Wallet, label: 'Fee', value: `₹${internship.fee}`, gradient: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))' },
                            { icon: Clock, label: 'Duration', value: internship.duration, gradient: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.05))' },
                            { icon: BookOpen, label: 'Domain', value: internship.domain, gradient: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: item.gradient, border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                                <item.icon size={28} style={{ margin: '0 auto 0.5rem', color: 'var(--color-primary)', opacity: 0.8 }} />
                                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{item.label}</p>
                                <p className="outfit" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{item.value}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Description / About */}
                    {internship.details && internship.details !== 'na' && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="intern-detail-about">
                            <h2 className="outfit" style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={22} style={{ color: 'var(--color-primary)' }} /> About This Internship
                            </h2>
                            <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: internship.details }} />
                        </motion.div>
                    )}

                    {/* Curriculum */}
                    {internship.curriculum && internship.curriculum.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="intern-detail-about">
                            <h2 className="outfit" style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <GraduationCap size={22} style={{ color: 'var(--color-primary)' }} /> What You'll Learn
                            </h2>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {internship.curriculum.map((item: string, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < internship.curriculum.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                        <div style={{ width: '24px', height: '24px', minWidth: '24px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                                            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)' }} />
                                        </div>
                                        <span style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Highlights */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="intern-detail-highlights">
                        {[
                            { icon: Award, title: 'Verified Certificate', desc: 'Industry-recognized certification upon completion' },
                            { icon: Users, title: 'WhatsApp Community', desc: 'Join an exclusive group for daily guidance' },
                            { icon: Shield, title: 'Dashboard Access', desc: 'Track your progress with a private dashboard' },
                        ].map((item, i) => (
                            <div key={i} className="intern-highlight-card">
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                    <item.icon size={22} style={{ color: 'var(--color-primary)' }} />
                                </div>
                                <div>
                                    <h3 className="outfit" style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.25rem' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}                    
                    </motion.div>

                    {/* Enroll CTA */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="intern-detail-cta">
                        <h2 className="outfit" style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                            Ready to Start Your Journey?
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            Enroll now and begin building your career with hands-on experience.
                        </p>
                        <button onClick={() => setShowEnrollForm(true)} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 800, borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            Enrol Now — ₹{internship.fee} <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Enrollment Form Modal */}
            <AnimatePresence>
                {showEnrollForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: '1rem', backdropFilter: 'blur(8px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) setShowEnrollForm(false); }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="intern-modal-card">

                            {/* Header */}
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)', flexShrink: 0 }}>
                                <div>
                                    <h3 className="outfit" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Enrollment Form</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 600 }}>{internship.title} • ₹{internship.fee}</p>
                                </div>
                                <button onClick={() => setShowEnrollForm(false)} style={{ background: 'var(--background)', border: '1px solid var(--border)', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Form Content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                                <form id="enroll-form" onSubmit={handleEnroll}>
                                    <div className="intern-form-grid">
                                        <div>
                                            <label style={labelStyle}>Full Name <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" placeholder="John Doe" required style={inputStyle}
                                                value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email <span style={{ color: 'red' }}>*</span></label>
                                            <input type="email" placeholder="john@example.com" required style={inputStyle}
                                                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>WhatsApp Number <span style={{ color: 'red' }}>*</span></label>
                                            <input type="tel" placeholder="10-digit number" required maxLength={10} minLength={10} pattern="[0-9]{10}" title="Please enter exactly 10 digits" style={inputStyle}
                                                value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, '') })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Gender <span style={{ color: 'red' }}>*</span></label>
                                            <select required style={{ ...inputStyle, cursor: 'pointer' }}
                                                value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>College Name</label>
                                            <input type="text" placeholder="e.g., IIT Delhi" style={inputStyle}
                                                value={form.collegeName} onChange={(e) => setForm({ ...form, collegeName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Reg / Roll Number</label>
                                            <input type="text" placeholder="e.g., 21CSE045" style={inputStyle}
                                                value={form.collegeRegNumber} onChange={(e) => setForm({ ...form, collegeRegNumber: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Course</label>
                                            <input type="text" placeholder="e.g., B.Tech" style={inputStyle}
                                                value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Branch</label>
                                            <input type="text" placeholder="e.g., CSE" style={inputStyle}
                                                value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Start Date <span style={{ color: 'red' }}>*</span></label>
                                            <input type="date" required style={{ ...inputStyle, cursor: 'pointer' }}
                                                value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>End Date <span style={{ color: 'red' }}>*</span></label>
                                            <input type="date" required style={{ ...inputStyle, cursor: 'pointer' }}
                                                value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* Refund Policy Checkbox */}
                                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1.25rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                        <input type="checkbox" checked={form.agreedToRefundPolicy}
                                            onChange={(e) => setForm({ ...form, agreedToRefundPolicy: e.target.checked })}
                                            style={{ marginTop: '3px', accentColor: 'var(--color-primary)', width: '18px', height: '18px', minWidth: '18px', flexShrink: 0, cursor: 'pointer', appearance: 'auto' }} />
                                        <span>I have read and agree to the <Link href="/refund-policy" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Refund Policy</Link></span>
                                    </label>
                                </form>
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface-1)', flexShrink: 0 }}>
                                <button type="submit" form="enroll-form" disabled={enrolling} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 800, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    {enrolling ? <Loader2 className="animate-spin" size={20} /> : <>Proceed to Pay ₹{internship.fee} <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />

            {/* Cashfree SDK Script */}
            <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async />


        </div>
    );
}
