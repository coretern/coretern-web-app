import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Send,
    User,
    Mail,
    Phone,
    Clock,
    Loader2,
    MessageSquare,
    LifeBuoy,
    ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import './TicketDetail.css';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket]);

    const fetchTicket = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTicket(data.data);
        } catch (err) {
            toast.error('Failed to fetch ticket details');
            navigate('/tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}/reply`,
                { message: reply },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Reply sent successfully');
            setReply('');
            fetchTicket();
        } catch (err) {
            toast.error('Failed to send reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Status updated to ${newStatus}`);
            fetchTicket();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;
    if (!ticket) return null;

    return (
        <div className="ticket-detail-page">
            <header className="page-header flex flex-wrap justify-between items-start gap-6 mb-10">
                <div className="flex items-start gap-6">
                    <button onClick={() => navigate('/tickets')} className="back-btn">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="pt-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-secondary font-mono font-black text-sm tracking-wider">#{ticket.ticketId}</span>
                            <span className={`type-badge ${ticket.type}`}>{ticket.type}</span>
                        </div>
                        <h1 className="outfit h2 mb-2">{ticket.subject}</h1>
                        <p className="text-text-muted flex items-center gap-2 text-sm font-medium">
                            <Clock size={14} /> Created {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ticket.createdAt))}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-card-bg p-2 rounded-2xl border border-glass-border shadow-sm">
                    <span className="text-xs font-bold text-text-muted ml-3 uppercase tracking-tighter">Status:</span>
                    <select
                        className={`status-select-large ${ticket.status}`}
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </header>

            <div className="ticket-content-grid">
                <main className="chat-section">
                    <div className="chat-header p-8 border-b border-glass-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MessageSquare size={22} className="text-primary" />
                            </div>
                            <h3 className="outfit font-black text-lg">Conversation History</h3>
                        </div>
                        <span className="text-xs font-bold text-text-muted bg-glass-bg px-4 py-2 rounded-full border border-glass-border">
                            {ticket.conversation.length} Messages total
                        </span>
                    </div>

                    <div className="chat-messages">
                        {ticket.conversation.map((msg, i) => (
                            <div key={i} className={`message-wrapper ${msg.sender}`}>
                                <div className="message-bubble">
                                    <p className="bubble-msg">{msg.message}</p>
                                    <div className="message-meta-inline">
                                        <span className="sender-tag">{msg.sender === 'admin' ? 'Support Team' : ticket.name}</span>
                                        <span className="time-tag">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="chat-footer p-8 border-t border-glass-border bg-glass-bg/30">
                        <form onSubmit={handleReply} className="reply-form">
                            <textarea
                                placeholder="Type your professional response here..."
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                required
                                rows="4"
                                className="reply-textarea"
                            ></textarea>
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-xs text-text-muted italic">Pressing send will notify the student instantly.</p>
                                <button disabled={submitting} className="btn btn-primary flex items-center gap-2 px-10 py-4 rounded-2xl shadow-lg">
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Send Reply</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>

                <aside className="details-sidebar">
                    <div className="card glass p-8 mb-8">
                        <h3 className="outfit font-black mb-6 flex items-center gap-3 text-primary uppercase text-sm tracking-widest">
                            <User size={18} /> Requester Info
                        </h3>
                        <div className="details-list">
                            <div className="detail-item mb-4">
                                <label>Full Name</label>
                                <span>{ticket.name}</span>
                            </div>
                            <div className="detail-item mb-4">
                                <label>Email Address</label>
                                <span className="flex items-center gap-2"> {ticket.email}</span>
                            </div>
                            <div className="detail-item mb-4">
                                <label>Direct Phone</label>
                                <span className="flex items-center gap-2 text-primary"> {ticket.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card glass p-8">
                        <h3 className="outfit font-black mb-6 flex items-center gap-3 text-secondary uppercase text-sm tracking-widest">
                            <LifeBuoy size={18} /> Ticket Intelligence
                        </h3>
                        <div className="details-list">
                            <div className="detail-item mb-4">
                                <label>Initial Source</label>
                                <span>{ticket.type === 'registered' ? 'Dashboard App' : 'Contact Form'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Internal ID</label>
                                <span className="font-mono text-xs opacity-60">{ticket._id}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TicketDetail;
