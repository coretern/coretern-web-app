'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, MessageSquare, User, Loader2, Clock, ArrowRight, LogOut, Phone, Calendar, Mail, UserCircle, Save, Download, ExternalLink, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, enrollmentAPI, certificateAPI, ticketAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import jsPDF from 'jspdf';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('enrollments');
    const [certPreviewUrl, setCertPreviewUrl] = useState<string | null>(null);
    const [certPreviewData, setCertPreviewData] = useState<any>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [isAdminViewing, setIsAdminViewing] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsAdminViewing(!!localStorage.getItem('admin_token'));
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }
            try {
                const userData = await authAPI.me();
                setUser(userData.data);
                const [enrolRes, certRes, ticketRes] = await Promise.allSettled([
                    enrollmentAPI.getMy(), certificateAPI.getMy(), ticketAPI.getMy()
                ]);
                setEnrollments(enrolRes.status === 'fulfilled' ? (enrolRes.value?.data || []) : []);
                setCertificates(certRes.status === 'fulfilled' ? (certRes.value?.data || []) : []);
                setTickets(ticketRes.status === 'fulfilled' ? (ticketRes.value?.data || []) : []);
                const orderId = searchParams.get('order_id');
                if (orderId) {
                    try {
                        await enrollmentAPI.verify(orderId);
                        toast.success('Payment verified!');
                        const refreshed = await enrollmentAPI.getMy();
                        setEnrollments(refreshed?.data || []);
                    } catch (err: any) { toast.error(err.message || 'Verification failed'); }
                    window.history.replaceState({}, '', '/dashboard');
                }
            } catch { localStorage.removeItem('token'); router.push('/login'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [router, searchParams]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={40} />
        </div>
    );

    const paidEnrollments = enrollments.filter((e: any) => e.paymentStatus === 'paid');

    const downloadCertificate = async (certId: string) => {
        toast.loading('Generating certificate...', { id: 'cert-dl' });
        try {
            const res = await fetch(`/api/certificates/download/${certId}`);
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            const d = json.data;

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = '/CoreTern_internship_Certificate.png';
            await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;  // 6250
            canvas.height = img.height; // 4419
            const ctx = canvas.getContext('2d')!;
            
            // Fill white background (necessary for JPEG compression)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            const W = canvas.width;
            const H = canvas.height;

            // ===== CERTIFICATE ID top-right (gold text) =====
            ctx.fillStyle = '#c4973b';
            ctx.font = 'bold 70px Arial, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`CERTIFICATE ID: ${d.certificateId}`, W - 180, 200);

            // ===== RECIPIENT NAME (centered, bold, large) =====
            ctx.fillStyle = '#1a1a2e';
            ctx.font = 'bold 200px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText(d.recipientName || '', W / 2, 2540);

            // ===== Details paragraph line 1 =====
            ctx.font = '80px Arial, sans-serif';
            ctx.fillStyle = '#333';
            const course = d.course || '';
            const branch = d.branch || '';
            const rollNo = d.collegeRegNumber || '';
            const college = d.collegeName || '';
            const line1 = `Student of ${course} (${branch}), bearing Roll no. ${rollNo} of ${college}.`;
            ctx.fillText(line1, W / 2, 2810);

            // ===== Details paragraph line 2 =====
            const dur = d.duration || '';
            const sd = d.startDate ? new Date(d.startDate).toLocaleDateString('en-GB') : '';
            const ed = d.endDate ? new Date(d.endDate).toLocaleDateString('en-GB') : '';
            const internTitle = d.internshipTitle || '';
            const line2 = `Has successfully completed ${dur} (${sd} to ${ed}) internship on ${internTitle}.`;
            ctx.fillText(line2, W / 2, 2940);

            // ===== Issue date (bottom-left, near signature) =====
            ctx.textAlign = 'left';
            ctx.font = 'bold 65px Arial, sans-serif';
            ctx.fillStyle = '#1a5276';
            const issueDateStr = d.issueDate ? new Date(d.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
            ctx.fillText(`Issued on: ${issueDateStr}`, 1050, 4050);

            // ===== QR Code (bottom-right) =====
            const qrSize = 420;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=https://www.coretern.com/verify?id=${d.certificateId}`;
            const qrImg = new Image();
            qrImg.crossOrigin = 'anonymous';
            qrImg.src = qrUrl;
            await new Promise((resolve) => { qrImg.onload = resolve; qrImg.onerror = resolve; });
            if (qrImg.complete && qrImg.naturalWidth > 0) {
                ctx.drawImage(qrImg, W - 820, H - 720, qrSize, qrSize);
            }

            // Set preview data using compressed JPEG for a 1-4MB PDF size
            setCertPreviewUrl(canvas.toDataURL('image/jpeg', 0.8));
            setCertPreviewData(d);

            toast.success('Certificate generated successfully!', { id: 'cert-dl' });
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate certificate', { id: 'cert-dl' });
        }
    };

    const downloadAsPdf = () => {
        if (!certPreviewUrl || !certPreviewData) return;
        setGeneratingPdf(true);
        try {
            // Create PDF (landscape, mm, A4 defaults to 297x210)
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // A4 dimensions in mm: 297 x 210
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Add image to fill the A4 page using JPEG format for optimal size
            pdf.addImage(certPreviewUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${certPreviewData.certificateId}_Certificate.pdf`);
            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download PDF');
        } finally {
            setGeneratingPdf(false);
        }
    };

    // Helper: find certificate for a given enrollment
    const getCertForEnrollment = (enrol: any) => {
        return certificates.find((c: any) => !c.isManual && (
            (c.internship?._id || c.internship) === (enrol.internship?._id || enrol.internship)
        ));
    };

    const sidebarItems = [
        { id: 'enrollments', label: 'Enrollments', value: paidEnrollments.length, icon: BookOpen, bg: 'rgba(99,102,241,0.1)', color: '#6366f1', border: 'rgba(99,102,241,0.2)', clickable: true },
        { id: 'achievements', label: 'Achievements', value: certificates.length, icon: Award, bg: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: 'rgba(6,182,212,0.2)', clickable: false },
        { id: 'tickets', label: 'Support Tickets', value: tickets.length, icon: MessageSquare, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)', clickable: true },
        { id: 'profile', label: 'Profile', value: null, icon: User, bg: 'rgba(99,102,241,0.1)', color: '#6366f1', border: 'rgba(99,102,241,0.2)', clickable: true },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <div className="container" style={{ maxWidth: '1200px', paddingTop: '7rem', paddingBottom: '4rem' }}>
                {isAdminViewing && (
                    <div style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Shield size={20} />
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Admin View: You are currently impersonating {user?.name}.</span>
                        </div>
                        <button onClick={() => {
                            const adminToken = localStorage.getItem('admin_token');
                            if (adminToken) {
                                localStorage.setItem('token', adminToken);
                                localStorage.removeItem('admin_token');
                                router.push('/admin/users');
                                toast.success('Returned to Admin Panel');
                            }
                        }} style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--color-primary)', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                            Return to Admin Panel
                        </button>
                    </div>
                )}
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 2.5rem', padding: '1.5rem 2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', position: 'relative', overflow: 'hidden', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', boxShadow: '0 12px 24px rgba(99,102,241,0.3)', flexShrink: 0 }} className="outfit">
                            {user?.name?.[0]}
                        </div>
                        <div>
                            <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 700, marginBottom: '0.2rem' }} className="outfit">
                                Hello, {user?.name?.split(' ')[0]} 👋
                            </h1>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{user?.email}</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {user?.phone && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                        <Phone size={12} style={{ color: 'var(--color-primary)' }} /> {user.phone}
                                    </span>
                                )}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                    <Calendar size={12} style={{ color: 'var(--color-secondary)' }} /> Joined {new Date(user?.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', zIndex: 1 }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }} className="dash-grid">
                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'sticky', top: '7rem' }} className="dash-sidebar">
                        {sidebarItems.map((item) => (
                            <div key={item.id} onClick={() => item.clickable ? setActiveTab(item.id) : null}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '16px', border: activeTab === item.id && item.clickable ? '1px solid var(--color-primary)' : '1px solid var(--border)', background: activeTab === item.id && item.clickable ? 'linear-gradient(90deg, rgba(99,102,241,0.08) 0%, transparent 100%)' : 'var(--surface)', textAlign: 'left' as const, cursor: item.clickable ? 'pointer' : 'default', transition: 'all 0.3s', boxShadow: activeTab === item.id && item.clickable ? 'inset 3px 0 0 var(--color-primary)' : 'none', opacity: item.clickable ? 1 : 0.85 }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.bg, color: item.color, border: `1px solid ${item.border}`, flexShrink: 0 }}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</h3>
                                    {item.value !== null && <p style={{ fontSize: '1.1rem', fontWeight: 800 }} className="outfit">{item.value}</p>}
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '0.5rem', padding: '1.25rem', borderRadius: '16px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => router.push('/internships')}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800 }} className="outfit">New Programs</h4>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 500, marginTop: '0.2rem' }}>Explore internships</p>
                            <ArrowRight size={18} style={{ marginTop: '0.75rem' }} />
                        </div>
                    </aside>

                    {/* Main */}
                    <main>
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

                                {activeTab === 'enrollments' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }} className="outfit">My Internships</h2>
                                        {paidEnrollments.length === 0 ? (
                                            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '20px', border: '2px dashed var(--border)' }}>
                                                <BookOpen size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.4, display: 'block' }} />
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }} className="outfit">No active enrollments</h3>
                                                <Link href="/internships" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1rem' }}>Start your career today →</Link>
                                            </div>
                                        ) : paidEnrollments.map((enrol: any) => (
                                            <div key={enrol._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 1.75rem', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '1rem', flexWrap: 'wrap', transition: 'all 0.3s' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                        {enrol.internship?.image ? (
                                                            <img src={enrol.internship.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{enrol.internship?.title?.[0]}</span>
                                                        )}
                                                    </div>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }} className="outfit">{enrol.internship?.title}</h3>
                                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: enrol.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(99,102,241,0.1)', color: enrol.status === 'completed' ? '#22c55e' : '#6366f1', border: `1px solid ${enrol.status === 'completed' ? 'rgba(34,197,94,0.3)' : 'rgba(99,102,241,0.3)'}` }}>
                                                                {enrol.status}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {enrol.internship?.duration}</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={14} /> Enrolled {new Date(enrol.enrolledAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {enrol.internship?.whatsappGroup && (
                                                        <a href={enrol.internship.whatsappGroup} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: '10px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>WhatsApp</a>
                                                    )}
                                                    <button onClick={() => router.push(`/lectures/${enrol.internship?._id}`)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>View Lectures</button>
                                                    {(() => { const cert = getCertForEnrollment(enrol); return cert ? (
                                                        <button onClick={() => downloadCertificate(cert.certificateId)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem', borderRadius: '10px', background: 'var(--color-secondary)', color: 'white', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}><Download size={14} /> Certificate</button>
                                                    ) : null; })()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}



                                {activeTab === 'tickets' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }} className="outfit">Support Center</h2>
                                        {tickets.length === 0 ? (
                                            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                                <MessageSquare size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.3, display: 'block' }} />
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }} className="outfit">Need Help?</h3>
                                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>Create a ticket and our team will respond.</p>
                                                <button onClick={() => router.push('/contact')} style={{ padding: '0.7rem 2rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer' }}>New Support Ticket</button>
                                            </div>
                                        ) : tickets.map((ticket: any) => (
                                            <div key={ticket._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '0.75rem', transition: 'all 0.3s' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                                                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }} className="outfit">{ticket.subject}</h3>
                                                        <span style={{ padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', background: ticket.status === 'open' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', color: ticket.status === 'open' ? '#f59e0b' : '#22c55e' }}>{ticket.status}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>#{ticket.ticketId} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }} className="outfit">Profile Settings</h2>
                                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }} className="outfit">Personal Information</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                                                {[
                                                    { label: 'Full Name', value: user?.name, icon: User, disabled: false },
                                                    { label: 'Email', value: user?.email, icon: Mail, disabled: true },
                                                    { label: 'Phone', value: user?.phone || '', icon: Phone, disabled: false },
                                                    { label: 'Gender', value: user?.gender || '', icon: UserCircle, disabled: true },
                                                ].map((field) => (
                                                    <div key={field.label}>
                                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>{field.label}</label>
                                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                            <field.icon size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                                            <input type="text" defaultValue={field.value} disabled={field.disabled}
                                                                style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: field.disabled ? 'var(--border)' : 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', opacity: field.disabled ? 0.7 : 1 }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}><Save size={16} /> Save Changes</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
            <Footer />

            {/* Certificate Preview Modal */}
            <AnimatePresence>
                {certPreviewUrl && certPreviewData && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ background: 'var(--surface)', borderRadius: '24px', overflow: 'hidden', width: '100%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        >
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }} className="outfit">Certificate Preview</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {certPreviewData.certificateId}</p>
                                </div>
                                <button onClick={() => { setCertPreviewUrl(null); setCertPreviewData(null); }} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.05)' }}>
                                <img src={certPreviewUrl} alt="Certificate Preview" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                            </div>
                            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--surface)', gap: '1rem' }}>
                                <button
                                    onClick={() => { setCertPreviewUrl(null); setCertPreviewData(null); }}
                                    style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    Close
                                </button>
                                <button
                                    onClick={downloadAsPdf}
                                    disabled={generatingPdf}
                                    style={{ padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', background: 'var(--color-secondary)', color: 'white', fontWeight: 700, cursor: generatingPdf ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: generatingPdf ? 0.7 : 1 }}
                                >
                                    {generatingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                    {generatingPdf ? 'Generating PDF...' : 'Download as PDF'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
