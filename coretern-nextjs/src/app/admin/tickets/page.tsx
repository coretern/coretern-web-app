'use client';
import { useState, useEffect } from 'react';
import { Loader2, Search, Trash2, MessageSquare, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ticketAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTickets() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewTicket, setViewTicket] = useState<any>(null);

    useEffect(() => { fetchTickets(); }, []);
    const fetchTickets = async () => {
        try { const data = await ticketAPI.getAll(); setTickets(data.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this ticket?')) return;
        try { await ticketAPI.delete(id); toast.success('Deleted'); fetchTickets(); }
        catch (err: any) { toast.error(err.message); }
    };

    const handleStatus = async (id: string, status: string) => {
        try { await ticketAPI.updateStatus(id, { status }); toast.success('Updated'); fetchTickets(); }
        catch (err: any) { toast.error(err.message); }
    };

    const filtered = tickets.filter((t: any) =>
        t.name?.toLowerCase().includes(search.toLowerCase()) || t.subject?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
            case 'resolved': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            case 'closed': return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20';
            default: return 'bg-[var(--surface-1)] border-[var(--border)] text-[var(--text)]';
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-primary)]" size={40} /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:gap-4">
                <h1 className="text-2xl font-extrabold font-[family-name:var(--font-outfit)]">Tickets ({tickets.length})</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
            </div>
            <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>ID</th><th>From</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.map((t: any) => (
                                <tr key={t._id}>
                                    <td className="font-mono text-sm">{t.ticketId}</td>
                                    <td>{t.name}<br/><span className="text-[var(--text-muted)] text-xs">{t.email}</span></td>
                                    <td>{t.subject}</td>
                                    <td>
                                        <select value={t.status} onChange={(e) => handleStatus(t._id, e.target.value)}
                                            className={`rounded-lg px-2 py-1 text-xs cursor-pointer font-bold border ${getStatusStyle(t.status)}`}>
                                            {['open','pending','resolved','closed'].map(s => <option key={s} value={s} className="bg-[var(--surface)] text-[var(--text)]">{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="text-[var(--text-muted)] text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={() => setViewTicket(t)} className="btn btn-outline btn-sm !px-2"><Eye size={14} /></button>
                                            <button onClick={() => handleDelete(t._id)} className="btn btn-danger btn-sm !px-2"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">No tickets</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Ticket Modal */}
            <AnimatePresence>
                {viewTicket && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: '1.5rem' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            style={{ background: 'var(--background)', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border)' }}
                        >
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-1)' }}>
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="text-[var(--color-primary)]" size={20} />
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }} className="outfit">Ticket Details</h3>
                                </div>
                                <button onClick={() => setViewTicket(null)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                                        <p className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] mb-1 tracking-wider">Ticket ID</p>
                                        <p className="font-mono text-sm font-bold">{viewTicket.ticketId}</p>
                                    </div>
                                    <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                                        <p className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] mb-1 tracking-wider">Date</p>
                                        <p className="text-sm font-bold">{new Date(viewTicket.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="col-span-2 bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                                        <p className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] mb-1 tracking-wider">From</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold">{viewTicket.name}</p>
                                            <div className="text-right">
                                                <p className="text-xs text-[var(--text-muted)]">{viewTicket.email}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{viewTicket.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Subject</h4>
                                    <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)]">
                                        <p className="font-bold">{viewTicket.subject}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Conversation</h4>
                                    <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] min-h-[200px] max-h-[300px] overflow-y-auto mb-4 flex flex-col gap-3">
                                        {viewTicket.conversation?.map((msg: any, i: number) => {
                                            const isAdmin = msg.sender === 'admin';
                                            return (
                                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                                    <div style={{ padding: '0.8rem 1.2rem', borderRadius: '16px', borderTopLeftRadius: !isAdmin ? '4px' : '16px', borderTopRightRadius: isAdmin ? '4px' : '16px', background: isAdmin ? 'var(--color-primary)' : 'var(--surface-1)', color: isAdmin ? 'white' : 'var(--text)', border: isAdmin ? 'none' : '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                                        <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.message}</p>
                                                    </div>
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', alignSelf: isAdmin ? 'flex-end' : 'flex-start', fontWeight: 700 }}>
                                                        {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {(!viewTicket.conversation || viewTicket.conversation.length === 0) && (
                                            <p className="text-[var(--text-muted)] text-center text-sm italic">No messages found.</p>
                                        )}
                                    </div>
                                </div>

                                {viewTicket.type === 'registered' ? (
                                    <form onSubmit={async (e: any) => {
                                        e.preventDefault();
                                        const message = e.target.message.value;
                                        if (!message) return;
                                        try {
                                            const res = await ticketAPI.reply(viewTicket._id, { message });
                                            setViewTicket(res.data);
                                            e.target.message.value = '';
                                            toast.success('Reply sent');
                                            fetchTickets();
                                        } catch (err: any) {
                                            toast.error(err.message || 'Failed to send reply');
                                        }
                                    }} className="flex gap-2">
                                        <input type="text" name="message" placeholder="Type a reply..." className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                                        <button type="submit" className="btn btn-primary !py-2 !px-4">Send</button>
                                    </form>
                                ) : (
                                    <div className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 p-3 rounded-xl text-center text-sm font-bold border border-amber-200 dark:border-amber-500/20">
                                        Guest Ticket. Please contact user directly via Email or Phone.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
