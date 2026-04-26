'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, MessageSquare, User, Loader2, Clock, ArrowRight, LogOut, Phone, Calendar, Mail, UserCircle, Save, Download, ExternalLink, X, Shield, Pencil, Lock, Camera, ChevronDown, ChevronUp, Info } from 'lucide-react';
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
    const [mobileView, setMobileView] = useState<'profile' | 'internships'>('profile');
    
    // Accordion State
    const [expandedCards, setExpandedCards] = useState<string[]>([]);
    const toggleCard = (id: string) => setExpandedCards(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    
    // Enrollment Details Modal
    const [selectedEnrollmentDetails, setSelectedEnrollmentDetails] = useState<any>(null);
    
    // Ticket Modals
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    
    // Profile Forms
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', gender: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', otp: '' });
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordOtp, setShowPasswordOtp] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                setProfileForm({ name: userData.data.name || '', phone: userData.data.phone || '', gender: userData.data.gender || '' });
                
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
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <div className="container" style={{ maxWidth: '800px', paddingTop: '7rem', paddingBottom: '4rem' }}>
                <style>{`
                    @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                    .sk-box { background: var(--surface); border: 1px solid var(--border); animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                    .sk-text { background: var(--border); border-radius: 8px; animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                `}</style>
                {/* Tab Bar Skeleton */}
                <div className="sk-box" style={{ padding: '0.6rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', gap: '0.75rem' }}>
                    <div className="sk-text" style={{ flex: 1, height: '44px', borderRadius: '14px' }} />
                    <div className="sk-text" style={{ flex: 1, height: '44px', borderRadius: '14px' }} />
                </div>
                {/* Content Skeleton */}
                <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="sk-text" style={{ width: '180px', height: '28px', marginBottom: '0.5rem', borderRadius: '8px' }} />
                    {[1, 2].map(i => <div key={i} className="sk-box" style={{ height: '120px', borderRadius: '20px' }} />)}
                    <div className="sk-box" style={{ height: '80px', borderRadius: '20px', marginTop: '1rem' }} />
                </main>
            </div>
        </div>
    );

    const displayEnrollments = enrollments;

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

    const handleUpdateProfile = async () => {
        setUpdatingProfile(true);
        try {
            let res;
            if (avatarFile) {
                const formData = new FormData();
                formData.append('name', profileForm.name);
                formData.append('phone', profileForm.phone);
                formData.append('gender', profileForm.gender);
                formData.append('avatar', avatarFile);
                res = await authAPI.updateProfile(formData);
            } else {
                res = await authAPI.updateProfile(profileForm);
            }
            setUser(res.data);
            setAvatarFile(null);
            setAvatarPreview(null);
            toast.success('Profile updated successfully!');
        } catch (err: any) { toast.error(err.message || 'Failed to update profile'); }
        finally { setUpdatingProfile(false); }
    };

    const handleRequestPasswordOtp = async () => {
        setChangingPassword(true);
        try {
            await authAPI.requestSetPasswordOtp();
            toast.success('OTP sent to your email!');
            setShowPasswordOtp(true);
        } catch (err: any) { toast.error(err.message || 'Failed to send OTP'); }
        finally { setChangingPassword(false); }
    };

    const handleChangePassword = async () => {
        setChangingPassword(true);
        try {
            const res = await authAPI.changePassword(passwordForm);
            toast.success('Password updated successfully! Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (err: any) { toast.error(err.message || 'Failed to save password'); }
        finally { setChangingPassword(false); }
    };

    const sidebarItems = [
        { id: 'enrollments', label: 'Enrollments', value: displayEnrollments.length, icon: BookOpen, bg: 'rgba(99,102,241,0.1)', color: '#6366f1', border: 'rgba(99,102,241,0.2)', clickable: true, path: null },
        { id: 'tickets', label: 'Support Tickets', value: tickets.length, icon: MessageSquare, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)', clickable: true, path: '/dashboard/tickets' },
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
                {/* Modern Dashboard Layout */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Top Tab Bar Wrapper */}
                    <div style={{ position: 'sticky', top: '3.7rem', zIndex: 40, padding: '1rem 0', margin: '-1rem 0 1rem', background: 'var(--glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--surface)', padding: '0.6rem', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                            <button onClick={() => setActiveTab('enrollments')} style={{ flex: 1, padding: '0.85rem', borderRadius: '14px', background: activeTab === 'enrollments' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'enrollments' ? 'white' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: activeTab === 'enrollments' ? '0 8px 20px -6px rgba(99,102,241,0.4)' : 'none' }}>
                                <BookOpen size={18} /> Internships
                            </button>
                            <button onClick={() => setActiveTab('profile')} style={{ flex: 1, padding: '0.85rem', borderRadius: '14px', background: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'profile' ? 'white' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: activeTab === 'profile' ? '0 8px 20px -6px rgba(99,102,241,0.4)' : 'none' }}>
                                <User size={18} /> Profile
                            </button>
                        </div>
                    </div>

                    <main>
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

                                {activeTab === 'enrollments' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }} className="outfit">My Internships</h2>
                                        {displayEnrollments.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.1) 100%)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px -5px rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', transform: 'rotate(-5deg)' }}>
                                                    <BookOpen size={48} strokeWidth={1.5} />
                                                </div>
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }} className="outfit">Your Journey Begins Here</h3>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.6, fontWeight: 500 }}>You haven't enrolled in any internships yet. Discover world-class programs and kickstart your tech career today.</p>
                                                <Link href="/internships" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-primary)', color: 'white', padding: '0.85rem 2rem', borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 8px 20px -6px rgba(99,102,241,0.5)', transition: 'all 0.2s' }}>
                                                    Explore Programs <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        ) : displayEnrollments.map((enrol: any) => {
                                            const isExpanded = expandedCards.includes(enrol._id);
                                            return (
                                            <div key={enrol._id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', marginBottom: '1rem', overflow: 'hidden', transition: 'all 0.3s' }}>
                                                <div 
                                                    onClick={() => toggleCard(enrol._id)}
                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', cursor: 'pointer', gap: '1rem' }}
                                                >
                                                    <div className="enrollment-info">
                                                        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                            {enrol.internship?.image ? (
                                                                <img src={enrol.internship.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{enrol.internship?.title?.[0]}</span>
                                                            )}
                                                        </div>
                                                        <div style={{ minWidth: 0 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                                                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="outfit">
                                                                    <span>{enrol.internship?.title}</span>
                                                                    <button onClick={(e) => { e.stopPropagation(); setSelectedEnrollmentDetails(enrol); }} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} title="View details filled during enrollment">
                                                                        <Info size={12} />
                                                                    </button>
                                                                </h3>
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                                <span>Enrolled {new Date(enrol.enrolledAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()}</span>
                                                            </div>
                                                            <div>
                                                                {enrol.paymentStatus === 'paid' ? (
                                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: enrol.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(99,102,241,0.1)', color: enrol.status === 'completed' ? '#22c55e' : '#6366f1', border: `1px solid ${enrol.status === 'completed' ? 'rgba(34,197,94,0.3)' : 'rgba(99,102,241,0.3)'}` }}>
                                                                        {enrol.status}
                                                                    </span>
                                                                ) : (
                                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                                                                        Payment Pending
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-muted)' }}>
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            style={{ overflow: 'hidden' }}
                                                        >
                                                            <div style={{ padding: '0 1.5rem 1.25rem' }}>
                                                                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.25rem' }} />
                                                                <div className="enrollment-actions">
                                                                    {enrol.paymentStatus === 'paid' ? (
                                                                        <>
                                                                            {enrol.internship?.whatsappGroup && (
                                                                                <a href={enrol.internship.whatsappGroup} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '12px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>WhatsApp</a>
                                                                            )}
                                                                            <button onClick={() => router.push(`/lectures/${enrol.internship?._id}`)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>View Lectures</button>
                                                                            {(() => { const cert = getCertForEnrollment(enrol); return cert ? (
                                                                                <button onClick={() => downloadCertificate(cert.certificateId)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '12px', background: 'var(--color-secondary)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}><Download size={14} /> Certificate</button>
                                                                            ) : null; })()}
                                                                        </>
                                                                    ) : (
                                                                        <button onClick={async () => {
                                                                            toast.loading('Loading payment gateway...', { id: 'retry-pay' });
                                                                            try {
                                                                                const token = localStorage.getItem('token');
                                                                                const res = await fetch(`/api/enrollments/${enrol._id}/retry`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                                                                                const data = await res.json();
                                                                                if (!data.success) throw new Error(data.error);
                                                                                
                                                                                const cashfree = (window as any).Cashfree?.({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox' });
                                                                                if (cashfree) {
                                                                                    toast.dismiss('retry-pay');
                                                                                    cashfree.checkout({ paymentSessionId: data.data?.payment_session_id || data.payment_session_id, redirectTarget: '_self' });
                                                                                } else {
                                                                                    throw new Error('Payment gateway not loaded');
                                                                                }
                                                                            } catch (err: any) {
                                                                                toast.error(err.message || 'Failed to initialize payment', { id: 'retry-pay' });
                                                                            }
                                                                        }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', borderRadius: '12px', background: '#f59e0b', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                                                                            Pay Now (₹{enrol.internship?.fee})
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )})}
                                        
                                        <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '20px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 12px 25px -10px rgba(99,102,241,0.5)' }} onClick={() => router.push('/internships')}>
                                            <div style={{ zIndex: 1 }}>
                                                <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }} className="outfit">Discover New Programs</h4>
                                                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500, marginTop: '0.2rem' }}>Explore our latest hands-on internships</p>
                                            </div>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, backdropFilter: 'blur(4px)' }}>
                                                <ArrowRight size={24} />
                                            </div>
                                            <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {/* Header / Profile Card */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden', gap: '1.25rem', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                                            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                                            
                                            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                                                <div style={{ width: '100px', height: '100px', borderRadius: '30px', margin: '0 auto 1.25rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'white', boxShadow: '0 15px 30px rgba(99,102,241,0.3)', overflow: 'hidden' }} className="outfit">
                                                    {user?.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]}
                                                </div>
                                                
                                                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} className="outfit">
                                                    {user?.name}
                                                    <button onClick={() => setShowProfileModal(true)} title="Edit Profile" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
                                                        <Pencil size={14} />
                                                    </button>
                                                </h1>
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '1rem', display: 'block', marginBottom: '1.25rem' }}>{user?.email}</span>
                                                
                                                {user?.role === 'admin' && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                                                        {user?.phone && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.85rem', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                                                <Phone size={14} style={{ color: 'var(--color-primary)' }} /> {user.phone}
                                                            </span>
                                                        )}
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.85rem', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                                            <Calendar size={14} style={{ color: 'var(--color-secondary)' }} /> Joined {new Date(user?.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2.5rem', borderRadius: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', zIndex: 1, marginTop: '0.5rem' }}>
                                                <LogOut size={18} /> Logout
                                            </button>
                                        </div>

                                        {/* Support Tickets Section */}
                                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="outfit">
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <MessageSquare size={20} />
                                                    </div>
                                                    Support Tickets
                                                </h2>
                                                <button onClick={() => router.push('/dashboard/tickets')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    View All <ArrowRight size={16} />
                                                </button>
                                            </div>
                                            
                                            {tickets.length === 0 ? (
                                                <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--background)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                                                    <MessageSquare size={40} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.4, display: 'block' }} />
                                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }} className="outfit">No active tickets</h3>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Need help? Create a ticket in the support section.</p>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {tickets.slice(0, 3).map((t: any) => (
                                                        <div key={t._id} onClick={() => router.push(`/dashboard/tickets/${t._id}`)} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                                            <div>
                                                                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }} className="outfit">{t.subject}</h4>
                                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Ticket #{t._id.slice(-6).toUpperCase()}</span>
                                                            </div>
                                                            <span style={{ padding: '0.4rem 0.85rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', background: t.status === 'open' ? 'rgba(99,102,241,0.1)' : 'rgba(34,197,94,0.1)', color: t.status === 'open' ? '#6366f1' : '#22c55e', border: `1px solid ${t.status === 'open' ? 'rgba(99,102,241,0.2)' : 'rgba(34,197,94,0.2)'}` }}>{t.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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

            {/* Cashfree SDK Script */}
            <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async />

            {/* Profile Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5rem 1rem 2rem', overflowY: 'auto' }}
                        onClick={() => setShowProfileModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: 'var(--background)', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', margin: 'auto' }}
                        >
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
                                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }} className="outfit">Profile Settings</h2>
                                <button onClick={() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); }} style={{ background: 'var(--border)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div style={{ padding: '2rem', overflowY: 'auto' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }} className="outfit">Personal Information</h3>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white', boxShadow: '0 12px 24px rgba(99,102,241,0.2)', flexShrink: 0, overflow: 'hidden' }}>
                                        {(avatarPreview || user?.avatar) ? <img src={avatarPreview || user?.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]}
                                        <button onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, border: 'none', color: 'white', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                                            <Camera size={24} />
                                        </button>
                                        <input type="file" ref={fileInputRef} hidden accept="image/jpeg, image/png, .jpg, .jpeg, .png" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 3 * 1024 * 1024) {
                                                    toast.error('Image must be less than 3MB');
                                                    return;
                                                }
                                                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                                                    toast.error('Only JPG and PNG images are allowed');
                                                    return;
                                                }
                                                setAvatarFile(file);
                                                setAvatarPreview(URL.createObjectURL(file));
                                            }
                                        }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }} className="outfit">Profile Picture</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click the image to upload a new one. (Max 3MB, JPG/PNG)</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Full Name</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <User size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                            <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Email</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <Mail size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                            <input type="text" value={user?.email || ''} disabled style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', opacity: 0.7 }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Phone Number</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <Phone size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                            <input type="tel" maxLength={10} value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value.replace(/\D/g, '')})} style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Gender</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <UserCircle size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                            <select value={profileForm.gender} onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})} style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', appearance: 'none', transition: 'all 0.2s' }}>
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.25rem', marginTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                                    <button onClick={handleUpdateProfile} disabled={updatingProfile} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', opacity: updatingProfile ? 0.7 : 1 }}>
                                        {updatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                                    </button>
                                </div>

                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.25rem', marginTop: '2.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }} className="outfit">Security Settings</h3>
                                {user?.hasPassword ? (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Current Password</label>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <Lock size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                                    <input type="password" placeholder="••••••••" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>New Password</label>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <Lock size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                                    <input type="password" placeholder="••••••••" minLength={6} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.25rem', marginTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                                            <button onClick={handleChangePassword} disabled={changingPassword || !passwordForm.newPassword || !passwordForm.currentPassword} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', opacity: changingPassword || !passwordForm.newPassword || !passwordForm.currentPassword ? 0.7 : 1 }}>
                                                {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Update Password
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>New Password</label>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <Lock size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                                    <input type="password" placeholder="••••••••" minLength={6} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} disabled={showPasswordOtp} style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', opacity: showPasswordOtp ? 0.7 : 1 }} />
                                                </div>
                                            </div>
                                            {showPasswordOtp && (
                                                <div>
                                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Verification OTP</label>
                                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                        <Shield size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-primary)', opacity: 0.6, pointerEvents: 'none' }} />
                                                        <input type="text" placeholder="6-digit OTP" maxLength={6} value={passwordForm.otp} onChange={(e) => setPasswordForm({...passwordForm, otp: e.target.value.replace(/\D/g, '')})} style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', letterSpacing: '0.2rem' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.25rem', marginTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                                            {!showPasswordOtp ? (
                                                <button onClick={handleRequestPasswordOtp} disabled={changingPassword || passwordForm.newPassword.length < 6} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', opacity: changingPassword || passwordForm.newPassword.length < 6 ? 0.7 : 1 }}>
                                                    {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Request OTP to Set Password
                                                </button>
                                            ) : (
                                                <button onClick={handleChangePassword} disabled={changingPassword || passwordForm.otp.length !== 6} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', opacity: changingPassword || passwordForm.otp.length !== 6 ? 0.7 : 1 }}>
                                                    {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />} Verify & Set Password
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {showCreateTicket && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: '1.5rem', backdropFilter: 'blur(5px)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ background: 'var(--surface)', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border)' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }} className="outfit">Create Support Ticket</h3>
                                <button onClick={() => setShowCreateTicket(false)} style={{ background: 'var(--background)', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                            </div>
                            <form onSubmit={async (e: any) => {
                                e.preventDefault();
                                toast.loading('Creating ticket...', { id: 'create-t' });
                                try {
                                    await ticketAPI.create({
                                        subject: e.target.subject.value,
                                        message: e.target.message.value
                                    });
                                    toast.success('Ticket created successfully!', { id: 'create-t' });
                                    setShowCreateTicket(false);
                                    const refreshed = await ticketAPI.getMy();
                                    setTickets(refreshed.data || []);
                                } catch (err: any) {
                                    toast.error(err.message || 'Failed to create ticket', { id: 'create-t' });
                                }
                            }} style={{ padding: '1.5rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subject</label>
                                    <input type="text" name="subject" required placeholder="e.g., Certificate Issue" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message</label>
                                    <textarea name="message" required placeholder="Provide details about your problem..." rows={5} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', resize: 'vertical' }}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Submit Ticket</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Enrollment Details Modal */}
            <AnimatePresence>
                {selectedEnrollmentDetails && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: '1.5rem' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ width: '100%', maxWidth: '500px', background: 'var(--surface)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        >
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="outfit">
                                    <Info size={18} style={{ color: 'var(--color-primary)' }} /> Enrollment Details
                                </h3>
                                <button onClick={() => setSelectedEnrollmentDetails(null)} style={{ background: 'var(--background)', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6366f1', lineHeight: 1.5, fontWeight: 600 }}>
                                        <span style={{ fontWeight: 800 }}>Note:</span> Your internship certificate will be issued after the end date or you can contact the admin. The certificate download button will be available once the internship is completed.
                                    </p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Full Name', value: selectedEnrollmentDetails.fullName },
                                        { label: 'Email', value: selectedEnrollmentDetails.email },
                                        { label: 'WhatsApp Number', value: selectedEnrollmentDetails.whatsappNumber },
                                        { label: 'Gender', value: selectedEnrollmentDetails.gender },
                                        { label: 'Transaction ID', value: selectedEnrollmentDetails.paymentId || selectedEnrollmentDetails.cfOrderId },
                                        { label: 'College', value: selectedEnrollmentDetails.collegeName },
                                        { label: 'Registration No.', value: selectedEnrollmentDetails.collegeRegNumber },
                                        { label: 'Course', value: selectedEnrollmentDetails.course },
                                        { label: 'Branch', value: selectedEnrollmentDetails.branch },
                                        { label: 'Start Date', value: selectedEnrollmentDetails.startDate ? new Date(selectedEnrollmentDetails.startDate).toLocaleDateString() : '' },
                                        { label: 'End Date', value: selectedEnrollmentDetails.endDate ? new Date(selectedEnrollmentDetails.endDate).toLocaleDateString() : '' }
                                    ].filter(item => item.value).map((item, i) => (
                                        <div key={i} style={{ background: 'var(--background)', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.95 }}>{item.label}:</span>
                                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', opacity: 0.8, wordBreak: 'break-word' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


        </div>
    );
}
