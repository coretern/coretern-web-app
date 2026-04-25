'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, MessageSquare, User, Loader2, ExternalLink, Clock, ArrowRight, LogOut, Settings, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, enrollmentAPI, certificateAPI, ticketAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('enrollments');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
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

                // Handle payment verification from redirect
                const orderId = searchParams.get('order_id');
                if (orderId) {
                    try {
                        await enrollmentAPI.verify(orderId);
                        toast.success('Payment verified successfully!');
                        const refreshed = await enrollmentAPI.getMy();
                        setEnrollments(refreshed?.data || []);
                    } catch (err: any) {
                        toast.error(err.message || 'Payment verification failed');
                    }
                    window.history.replaceState({}, '', '/dashboard');
                }
            } catch (err) {
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router, searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
            </div>
        );
    }

    const tabs = [
        { id: 'enrollments', label: 'My Internships', icon: BookOpen, count: enrollments.length },
        { id: 'certificates', label: 'Certificates', icon: Award, count: certificates.length },
        { id: 'tickets', label: 'Support', icon: MessageSquare, count: tickets.length },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const paidEnrollments = enrollments.filter((e: any) => e.paymentStatus === 'paid');

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />
            
            <div className="pt-32 pb-20 container max-w-7xl">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-[rgba(99,102,241,0.2)] font-[family-name:var(--font-outfit)]">
                            {user?.name?.[0]}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black font-[family-name:var(--font-outfit)] leading-tight">
                                Hello, {user?.name?.split(' ')[0]} 👋
                            </h1>
                            <p className="text-[var(--text-muted)] text-lg font-medium">{user?.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {user?.phone && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)]">
                                        <Phone size={12} className="text-[var(--color-primary)]" /> {user.phone}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)]">
                                    <Clock size={12} className="text-[var(--color-secondary)]" /> Joined {new Date(user?.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] font-bold text-sm hover:text-[var(--text)] hover:border-[var(--color-primary)] transition-all cursor-pointer">
                            <Settings size={18} /> Edit Profile
                        </button>
                        <button 
                            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ef4444]/5 border border-[#ef4444]/10 text-[#ef4444] font-bold text-sm hover:bg-[#ef4444]/10 transition-all cursor-pointer"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
                    {/* Sidebar Stats */}
                    <aside className="flex flex-col gap-5">
                        {[
                            { id: 'enrollments', label: 'Enrollments', value: enrollments.length, icon: BookOpen, color: 'primary' },
                            { id: 'certificates', label: 'Achievements', value: certificates.length, icon: Award, color: 'secondary' },
                            { id: 'tickets', label: 'Support Tickets', value: tickets.length, icon: MessageSquare, color: 'warning' },
                        ].map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-300 text-left cursor-pointer group ${activeTab === item.id ? 'bg-[var(--surface)] border-[var(--color-primary)] shadow-xl' : 'bg-transparent border-[var(--border)] hover:border-[var(--color-primary)]'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color === 'primary' ? 'bg-[#6366f1]/10 text-[#6366f1]' : item.color === 'secondary' ? 'bg-[#ec4899]/10 text-[#ec4899]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{item.label}</h3>
                                    <p className="text-2xl font-black font-[family-name:var(--font-outfit)]">{item.value}</p>
                                </div>
                            </button>
                        ))}

                        <div className="mt-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white relative overflow-hidden group cursor-pointer" onClick={() => router.push('/internships')}>
                            <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-xl font-black font-[family-name:var(--font-outfit)] relative z-10">New Programs</h4>
                            <p className="text-white/80 text-sm font-medium mt-1 relative z-10">Explore latest internships</p>
                            <ArrowRight size={20} className="mt-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'enrollments' && (
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h2 className="text-2xl font-black font-[family-name:var(--font-outfit)]">My Internships</h2>
                                            <div className="h-1 flex-1 bg-[var(--border)] rounded-full opacity-30" />
                                        </div>
                                        
                                        {paidEnrollments.length === 0 ? (
                                            <div className="bg-[var(--surface)] p-16 rounded-[3rem] border-2 border-dashed border-[var(--border)] text-center">
                                                <div className="w-20 h-20 bg-[var(--background)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--text-muted)]">
                                                    <BookOpen size={40} />
                                                </div>
                                                <h3 className="text-2xl font-black font-[family-name:var(--font-outfit)] mb-2">No active enrollments</h3>
                                                <Link href="/internships" className="text-[var(--color-primary)] font-bold text-lg hover:underline">Start your career today →</Link>
                                            </div>
                                        ) : (
                                            paidEnrollments.map((enrol: any) => (
                                                <div key={enrol._id} className="group bg-[var(--surface)] p-8 rounded-[2.5rem] border border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-xl">
                                                    <div className="flex items-center gap-8 flex-1">
                                                        <div className="w-24 h-24 rounded-[2rem] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                                                            {enrol.internship?.image ? (
                                                                <img src={enrol.internship.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            ) : (
                                                                <span className="text-3xl font-black text-[var(--color-primary)]">{enrol.internship?.title?.[0]}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-xl font-black font-[family-name:var(--font-outfit)]">{enrol.internship?.title}</h3>
                                                                <span className={`px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-wider ${enrol.status === 'completed' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#6366f1]/10 text-[#6366f1]'}`}>
                                                                    {enrol.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4 text-sm font-bold text-[var(--text-muted)]">
                                                                <span className="flex items-center gap-1.5"><Clock size={16} /> {enrol.internship?.duration}</span>
                                                                <span className="flex items-center gap-1.5"><Calendar size={16} /> Enrolled {new Date(enrol.enrolledAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                                        {enrol.internship?.whatsappGroup && (
                                                            <a href={enrol.internship.whatsappGroup} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] font-bold text-sm hover:bg-[#25d366] hover:text-white transition-all">
                                                                WhatsApp
                                                            </a>
                                                        )}
                                                        <button className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--color-primary)] text-white font-black text-sm hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] transition-all">
                                                            View Lectures
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'certificates' && (
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h2 className="text-2xl font-black font-[family-name:var(--font-outfit)]">Achievements</h2>
                                            <div className="h-1 flex-1 bg-[var(--border)] rounded-full opacity-30" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {certificates.length === 0 ? (
                                                <div className="col-span-full py-20 text-center bg-[var(--surface)] rounded-[3rem] border border-[var(--border)]">
                                                    <Award size={60} className="mx-auto mb-6 text-[var(--text-muted)] opacity-30" />
                                                    <p className="text-xl font-bold text-[var(--text-muted)]">Complete an internship to unlock rewards</p>
                                                </div>
                                            ) : (
                                                certificates.map((cert: any) => (
                                                    <div key={cert._id} className="bg-[var(--surface)] p-8 rounded-[2.5rem] border border-[var(--border)] group hover:border-[var(--color-secondary)] transition-all">
                                                        <div className="w-14 h-14 bg-[#ec4899]/10 text-[#ec4899] rounded-2xl flex items-center justify-center mb-6">
                                                            <Award size={32} />
                                                        </div>
                                                        <h3 className="text-xl font-black font-[family-name:var(--font-outfit)] mb-2">{cert.internship?.title}</h3>
                                                        <p className="text-sm font-bold text-[var(--text-muted)] mb-6 tracking-tight uppercase">ID: {cert.certificateId}</p>
                                                        <button onClick={() => router.push(`/verify?id=${cert.certificateId}`)} className="w-full py-4 rounded-2xl bg-[var(--color-secondary)] text-white font-black text-sm hover:shadow-[0_8px_25px_rgba(236,72,153,0.4)] transition-all">
                                                            Verify & Download
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tickets' && (
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h2 className="text-2xl font-black font-[family-name:var(--font-outfit)]">Support Center</h2>
                                            <div className="h-1 flex-1 bg-[var(--border)] rounded-full opacity-30" />
                                        </div>
                                        <div className="grid gap-4">
                                            {tickets.length === 0 ? (
                                                <div className="py-20 text-center bg-[var(--surface)] rounded-[3rem] border border-[var(--border)]">
                                                    <MessageSquare size={60} className="mx-auto mb-6 text-[var(--text-muted)] opacity-30" />
                                                    <h3 className="text-2xl font-black font-[family-name:var(--font-outfit)] mb-2">Need Help?</h3>
                                                    <p className="text-[var(--text-muted)] mb-8 font-medium">Create a ticket and our team will get back to you.</p>
                                                    <button onClick={() => router.push('/contact')} className="px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black hover:shadow-xl transition-all">New Support Ticket</button>
                                                </div>
                                            ) : (
                                                tickets.map((ticket: any) => (
                                                    <div key={ticket._id} className="bg-[var(--surface)] p-6 rounded-[2rem] border border-[var(--border)] flex justify-between items-center group hover:border-[var(--color-warning)] transition-all">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-lg font-black font-[family-name:var(--font-outfit)]">{ticket.subject}</h3>
                                                                <span className={`px-2 py-0.5 rounded text-[0.65rem] font-black uppercase ${ticket.status === 'open' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#22c55e]/10 text-[#22c55e]'}`}>
                                                                    {ticket.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs font-bold text-[var(--text-muted)] opacity-70 tracking-widest uppercase">#{ticket.ticketId} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--color-warning)] group-hover:border-[var(--color-warning)] transition-all">
                                                            <ArrowRight size={18} />
                                                        </div>
                                                    </div>
                                                ))
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
        </div>
    );
}
