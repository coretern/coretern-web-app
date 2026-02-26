import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Send,
    Loader2,
    Shield,
    MessageSquare,
    Clock
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
            const { data } = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
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
            await axios.put(`http://localhost:5000/api/tickets/${id}/reply`,
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
            <div className="container mx-auto max-w-4xl py-12 px-6">
                <header className="flex flex-wrap justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/dashboard')} className="back-btn glass">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xs font-mono font-black text-primary tracking-widest">#{ticket.ticketId}</span>
                                <div className={`status-tag-large ${ticket.status}`}>
                                    {ticket.status.toUpperCase()}
                                </div>
                            </div>
                            <h1 className="outfit h2">{ticket.subject}</h1>
                        </div>
                    </div>
                </header>

                <div className="chat-container card shadow-2xl">
                    <div className="chat-banner p-6 flex items-center justify-between bg-primary/5 border-b border-glass-border">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-primary" />
                            <p className="font-bold text-sm tracking-tight">Official Support Channel</p>
                        </div>
                        <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
                            <Clock size={14} /> Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="message-list">
                        {ticket.conversation.map((msg, i) => (
                            <div key={i} className={`chat-wrapper ${msg.sender}`}>
                                <div className="chat-bubble">
                                    <p className="text-base">{msg.message}</p>
                                    <div className="chat-meta-info mt-2 pt-2 border-t border-white/10">
                                        <span className="chat-time">
                                            {msg.sender === 'admin' ? 'Support Team' : 'You'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {ticket.status !== 'closed' ? (
                        <div className="chat-input-area border-t border-glass-border">
                            <form onSubmit={handleReply} className="flex gap-6 items-end">
                                <textarea
                                    className="chat-textarea"
                                    placeholder="Type your message to support..."
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
                                <button disabled={submitting} className="send-btn btn-primary h-[56px] w-[56px] shadow-xl">
                                    {submitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                </button>
                            </form>
                            <p className="text-[10px] text-text-muted mt-4 font-medium text-center opacity-60">TechStart Support usually responds within 2-4 hours.</p>
                        </div>
                    ) : (
                        <div className="p-10 text-center bg-gray-50/5 text-text-muted text-sm border-t border-glass-border">
                            <div className="mb-4 inline-flex p-3 bg-gray-100/10 rounded-full">
                                <Shield size={24} className="opacity-50" />
                            </div>
                            <p className="font-bold text-base mb-1">Ticket Resolved</p>
                            <p className="opacity-70">This conversation is closed. Please raise a new ticket if you need further assistance.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketConversation;
