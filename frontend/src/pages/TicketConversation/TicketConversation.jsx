import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Send,
    Loader2,
    Shield,
    Clock,
    Headphones,
    CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import './TicketConversation.css';

const TicketConversation = () => {
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
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTicket(data.data);
        } catch (err) {
            toast.error('Unable to load ticket conversation');
            navigate('/dashboard');
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
            await axios.put(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/reply`,
                { message: reply },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Message sent to support');
            setReply('');
            fetchTicket();
        } catch (err) {
            toast.error('Failed to send message');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;
    if (!ticket) return null;

    return (
        <div className="ticket-convo-page">
            <div className="convo-container">
                <header className="convo-header">
                    <div className="header-top-row">
                        <button onClick={() => navigate('/dashboard')} className="back-btn-premium">
                            <ArrowLeft size={18} />
                            <span>Dashboard</span>
                        </button>
                        <div className="support-badge glass">Support Channel</div>
                    </div>
                    <div className="header-info-main">
                        <div className="case-meta-badges">
                            <span className="case-id-tag">CASE: #{ticket.ticketId}</span>
                            <span className={`status-tag-large ${ticket.status}`}>
                                {ticket.status}
                            </span>
                        </div>
                        <h1 className="subject-title outfit">{ticket.subject}</h1>
                    </div>
                </header>

                <main className="chat-board">
                    <div className="chat-banner">
                        <div className="banner-left">
                            <Shield size={16} className="text-primary" />
                            <span>Resolution Channel</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-muted text-xs font-bold">
                            <Clock size={14} /> Established: {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="message-list custom-scrollbar">
                        {ticket.conversation.map((msg, i) => (
                            <div key={i} className={`chat-wrapper ${msg.sender}`}>
                                <div className="chat-bubble">
                                    <p className="bubble-msg">{msg.message}</p>
                                    <div className="bubble-meta-inline">
                                        <span className="bubble-sender">{msg.sender === 'admin' ? 'Support Team' : 'You'}</span>
                                        <span className="bubble-time-tag">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {ticket.status !== 'closed' ? (
                        <div className="chat-tools">
                            <form onSubmit={handleReply} className="input-container">
                                <textarea
                                    className="chat-textarea"
                                    placeholder="Type your message here..."
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    rows="1"
                                    required
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleReply(e);
                                        }
                                    }}
                                ></textarea>
                                <button disabled={submitting} className="send-trigger">
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </form>
                            <p className="resp-hint flex items-center justify-center gap-2">
                                <Headphones size={12} />
                                Technical team response: 2-4 hours
                            </p>
                        </div>
                    ) : (
                        <div className="resolved-state">
                            <div className="resolved-icon">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="outfit font-black text-xl mb-1">Issue Successfully Resolved</h3>
                            <p className="text-text-muted text-sm">Thank you for your collaboration. This case is now closed.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TicketConversation;
