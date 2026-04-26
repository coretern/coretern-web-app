'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Wallet, Calendar, BookOpen, Loader2, CheckCircle2 } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
            </div>
        );
    }

    if (!internship) return null;

    const imageUrl = internship.image?.startsWith('http') ? internship.image : `/uploads/${internship.image}`;

    return (
        <div>
            <Navbar />
            <section className="min-h-screen pt-28 pb-20">
                <div className="container max-w-[900px]">
                    <Link href="/internships" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] mb-8 transition-colors">
                        <ArrowLeft size={18} /> Back to Internships
                    </Link>

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-[var(--radius-xl)] overflow-hidden mb-10 h-[350px] max-md:h-[220px]">
                        <img src={imageUrl} alt={internship.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 z-10">
                            <span className="badge badge-primary mb-3">{internship.domain}</span>
                            <h1 className="text-3xl font-extrabold text-white mb-3 font-[family-name:var(--font-outfit)] max-md:text-2xl">{internship.title}</h1>
                        </div>
                    </motion.div>

                    {/* Meta Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-10 max-sm:grid-cols-1">
                        {[
                            { icon: Wallet, label: 'Fee', value: `₹${internship.fee}`, color: 'var(--color-primary)' },
                            { icon: Clock, label: 'Duration', value: internship.duration, color: 'var(--color-secondary)' },
                            { icon: BookOpen, label: 'Domain', value: internship.domain, color: 'var(--color-success)' },
                        ].map((item, i) => (
                            <div key={i} className="glass p-5 rounded-2xl border border-[var(--border)] text-center">
                                <item.icon size={24} className="mx-auto mb-2" style={{ color: item.color }} />
                                <p className="text-[var(--text-muted)] text-xs uppercase font-semibold mb-1">{item.label}</p>
                                <p className="text-xl font-bold font-[family-name:var(--font-outfit)]">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    {internship.details && internship.details !== 'na' && (
                        <div className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] mb-10">
                            <h2 className="text-xl font-bold mb-4 font-[family-name:var(--font-outfit)]">About This Internship</h2>
                            <div className="text-[var(--text-muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: internship.details }} />
                        </div>
                    )}

                    {/* Curriculum */}
                    {internship.curriculum && internship.curriculum.length > 0 && (
                        <div className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)] mb-10">
                            <h2 className="text-xl font-bold mb-4 font-[family-name:var(--font-outfit)]">Curriculum</h2>
                            <div className="grid gap-3">
                                {internship.curriculum.map((item: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                                        <span className="text-[var(--text)]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enroll CTA */}
                    {!showEnrollForm ? (
                        <div className="text-center">
                            <button onClick={() => setShowEnrollForm(true)} className="btn btn-primary !py-4 !px-10 !text-lg">
                                Enrol Now — ₹{internship.fee} <ArrowRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <motion.form onSubmit={handleEnroll} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass p-8 rounded-[var(--radius-xl)] border border-[var(--border)]">
                            <h2 className="text-xl font-bold mb-6 font-[family-name:var(--font-outfit)]">Enrollment Form</h2>
                            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                                {[
                                    { key: 'fullName', placeholder: 'Full Name', type: 'text', required: true },
                                    { key: 'email', placeholder: 'Email', type: 'email', required: true },
                                    { key: 'whatsappNumber', placeholder: 'WhatsApp Number', type: 'tel', required: true, pattern: '[0-9]{10}', title: 'Please enter exactly 10 digits', maxLength: 10, minLength: 10 },
                                    { key: 'collegeName', placeholder: 'College Name', type: 'text' },
                                    { key: 'collegeRegNumber', placeholder: 'Reg/Roll Number', type: 'text' },
                                    { key: 'course', placeholder: 'Course (e.g. B.Tech)', type: 'text' },
                                    { key: 'branch', placeholder: 'Branch (e.g. CSE)', type: 'text' },
                                    { key: 'startDate', placeholder: 'Start Date', type: 'date', required: true },
                                    { key: 'endDate', placeholder: 'End Date', type: 'date', required: true },
                                ].map(({ key, placeholder, type, required, pattern, title, maxLength, minLength }: any) => (
                                    <div key={key}>
                                        <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">{placeholder}</label>
                                        <input type={type} placeholder={placeholder} required={required} pattern={pattern} title={title} maxLength={maxLength} minLength={minLength}
                                            className="admin-input !mb-0"
                                            value={(form as any)[key]}
                                            onChange={(e) => {
                                                // If it's the phone number, only allow numbers
                                                if (key === 'whatsappNumber') {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setForm({ ...form, [key]: val });
                                                } else {
                                                    setForm({ ...form, [key]: e.target.value });
                                                }
                                            }} />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-muted)] mb-1 block">Gender</label>
                                    <select className="admin-select !mb-0" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 mt-6 cursor-pointer text-[0.85rem] text-[var(--text-muted)]">
                                <input type="checkbox" checked={form.agreedToRefundPolicy}
                                    onChange={(e) => setForm({ ...form, agreedToRefundPolicy: e.target.checked })}
                                    className="mt-1 accent-[var(--color-primary)]" />
                                <span>I agree to the <Link href="/refund-policy" className="text-[var(--color-primary)]">Refund Policy</Link></span>
                            </label>

                            <button type="submit" disabled={enrolling} className="btn btn-primary w-full !py-3 !text-base mt-6">
                                {enrolling ? <Loader2 className="animate-spin" size={20} /> : <>Proceed to Pay ₹{internship.fee} <ArrowRight size={18} /></>}
                            </button>
                        </motion.form>
                    )}
                </div>
            </section>
            <Footer />

            {/* Cashfree SDK Script */}
            <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async />
        </div>
    );
}
