'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, Plus, X, ArrowRight, Loader2, Send, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { ticketAPI, authAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TicketsListPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewTicket, setViewTicket] = useState<any>(null);
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await ticketAPI.getMy();
                setTickets(res.data || []);
            } catch (err: any) {
                toast.error(err.message || 'Failed to load tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [router]);

    const handleCreateTicket = async (e: any) => {
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
    };

    const handleReply = async (e: any) => {
        e.preventDefault();
        const msg = e.target.message.value;
        if (!msg || !viewTicket) return;

        try {
            const res = await ticketAPI.reply(viewTicket._id, { message: msg });
            setViewTicket(res.data);
            e.target.message.value = '';
            const refreshed = await ticketAPI.getMy();
            setTickets(refreshed.data || []);
        } catch (err: any) {
            toast.error(err.message || 'Failed to send reply');
        }
    };

    const handleReopen = async () => {
        if (!viewTicket) return;
        try {
            const res = await ticketAPI.updateStatus(viewTicket._id, { status: 'open' });
            setViewTicket(res.data);
            const refreshed = await ticketAPI.getMy();
            setTickets(refreshed.data || []);
            toast.success('Ticket reopened!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to reopen ticket');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={40} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />

            <main className="container" style={{ maxWidth: '900px', paddingTop: '7.5rem', paddingBottom: '4rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <button 
                        onClick={() => router.push('/dashboard')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
                    >
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Support Center</h1>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>View and manage your support requests</p>
                        </div>
                        <button 
                            onClick={() => setShowCreateTicket(true)}
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={18} /> New Ticket
                        </button>
                    </div>
                </div>

                {/* Tickets List */}
                {tickets.length === 0 ? (
                    <div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <MessageSquare size={56} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.3, display: 'block' }} />
                        <h3 className="outfit" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Support Tickets Yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', mx: 'auto' }}>If you're facing any issues, create a ticket and our team will get back to you shortly.</p>
                        <button onClick={() => setShowCreateTicket(true)} className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>Create First Ticket</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {tickets.map((ticket) => (
                            <div 
                                key={ticket._id} 
                                onClick={() => setViewTicket(ticket)}
                                className="ticket-item"
                                style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    background: 'var(--surface)', 
                                    padding: '1.5rem', 
                                    borderRadius: '20px', 
                                    border: '1px solid var(--border)', 
                                    cursor: 'pointer', 
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        borderRadius: '14px', 
                                        background: 'rgba(99,102,241,0.08)', 
                                        color: 'var(--color-primary)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}>
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h3 className="outfit" style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{ticket.subject}</h3>
                                            <span style={{ 
                                                padding: '0.25rem 0.75rem', 
                                                borderRadius: '6px', 
                                                fontSize: '0.65rem', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase', 
                                                background: ticket.status === 'open' ? 'rgba(245,158,11,0.1)' : ticket.status === 'pending' ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)', 
                                                color: ticket.status === 'open' ? '#f59e0b' : ticket.status === 'pending' ? '#3b82f6' : '#22c55e' 
                                            }}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            #{ticket.ticketId} • Created on {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {showCreateTicket && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: '1.5rem', backdropFilter: 'blur(5px)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ background: 'var(--surface)', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border)' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)' }}>
                                <h3 className="outfit" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Create New Ticket</h3>
                                <button onClick={() => setShowCreateTicket(false)} style={{ background: 'var(--background)', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                            </div>
                            <form onSubmit={handleCreateTicket} style={{ padding: '1.5rem' }}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subject</label>
                                    <input type="text" name="subject" required placeholder="What is the issue?" style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: '0.95rem' }} />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message</label>
                                    <textarea name="message" required placeholder="Describe your issue in detail..." rows={4} style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: '0.95rem', resize: 'none' }}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', fontWeight: 700 }}>Submit Ticket</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Ticket Modal (Popup as it was) */}
            <AnimatePresence>
                {viewTicket && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: '1.5rem', backdropFilter: 'blur(5px)' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ background: 'var(--surface)', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)' }}>
                                <div>
                                    <h3 className="outfit" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{viewTicket.subject}</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Ticket #{viewTicket.ticketId} • Status: <span style={{ textTransform: 'uppercase', color: viewTicket.status === 'open' ? '#f59e0b' : viewTicket.status === 'pending' ? '#3b82f6' : '#22c55e' }}>{viewTicket.status}</span></p>
                                </div>
                                <button onClick={() => setViewTicket(null)} style={{ background: 'var(--background)', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                            </div>
                            
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)' }}>
                                {viewTicket.conversation?.map((msg: any, i: number) => {
                                    const isUser = msg.sender === 'user';
                                    return (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                            <div style={{ padding: '0.8rem 1.2rem', borderRadius: '16px', borderTopLeftRadius: !isUser ? '4px' : '16px', borderTopRightRadius: isUser ? '4px' : '16px', background: isUser ? 'var(--color-primary)' : 'var(--surface-1)', color: isUser ? 'white' : 'var(--text)', border: isUser ? 'none' : '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                                <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.5 }}>{msg.message}</p>
                                            </div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', alignSelf: isUser ? 'flex-end' : 'flex-start', fontWeight: 700 }}>
                                                {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                                {viewTicket.status === 'closed' ? (
                                    <div style={{ padding: '0.75rem', textAlign: 'center', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                        This ticket is closed. Replies are disabled.
                                    </div>
                                ) : viewTicket.status === 'resolved' ? (
                                    <div style={{ padding: '0.85rem', textAlign: 'center', background: 'rgba(34,197,94,0.1)', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
                                        <p style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Your issue has been resolved.</p>
                                        <button onClick={handleReopen} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', color: 'var(--text)', borderColor: 'var(--border)' }}>
                                            Still need help? Reopen Ticket
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReply} style={{ display: 'flex', gap: '0.75rem' }}>
                                        <input type="text" name="message" placeholder="Type your message..." required style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '14px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} />
                                        <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '14px', fontWeight: 700 }}>Send</button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
