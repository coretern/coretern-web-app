import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Loader2, LifeBuoy, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import './TicketsForRegistered.css';

const TicketsForRegistered = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const fetchMyTickets = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get('http://localhost:5000/api/tickets/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(data.data);
        } catch (err) {
            console.error('Failed to fetch my tickets');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.post('http://localhost:5000/api/tickets', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(`Support Ticket Raised! ID: ${data.data.ticketId}`);
                setFormData({ subject: '', message: '' });
                fetchMyTickets();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to raise ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registered-tickets-container">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Raise Ticket Form */}
                <div className="card glass p-8 h-fit">
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="icon-box-small">
                                <LifeBuoy size={20} className="text-primary" />
                            </div>
                            <h2 className="outfit h3">Raise Support Ticket</h2>
                        </div>
                        <p className="text-text-muted">Describe your issue below and our technical team will assist you shortly.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="ticket-form">
                        <div className="form-group mb-6">
                            <label className="form-label">Issue Subject</label>
                            <input
                                type="text"
                                placeholder="e.g., Unable to download certificate"
                                required
                                className="auth-input"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-8">
                            <label className="form-label">Detailed Description</label>
                            <textarea
                                rows="5"
                                placeholder="Please provide as much detail as possible..."
                                required
                                className="auth-input"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>
                        <button disabled={loading} className="btn btn-primary w-full py-4 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Submit Ticket</>}
                        </button>
                    </form>
                </div>

                {/* Tickets History */}
                <div className="ticket-history h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare className="text-secondary" size={24} />
                        <h2 className="outfit h3">My Support History</h2>
                    </div>

                    {fetching ? (
                        <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" /></div>
                    ) : tickets.length === 0 ? (
                        <div className="glass p-8 rounded-2xl text-center text-text-muted">
                            No tickets raised yet.
                        </div>
                    ) : (
                        <div className="tickets-list flex flex-col gap-4">
                            {tickets.map(ticket => (
                                <div key={ticket._id} className="ticket-item glass p-5 rounded-2xl border-l-4 border-l-primary">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-xs font-mono font-bold text-primary block">{ticket.ticketId}</span>
                                            <h4 className="font-bold text-sm mt-1">{ticket.subject}</h4>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`status-tag text-[10px] px-2 py-1 rounded-full font-bold uppercase ${ticket.status}`}>
                                                {ticket.status}
                                            </span>
                                            <button
                                                onClick={() => navigate(`/dashboard/tickets/${ticket._id}`)}
                                                className="link-btn text-[10px] text-primary font-bold hover:underline"
                                            >
                                                View & Reply &rarr;
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-muted line-clamp-2 mb-3">
                                        {ticket.conversation && ticket.conversation[0]?.message}
                                    </p>

                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-glass-border">
                                        <Clock size={12} className="text-text-muted" />
                                        <span className="text-[10px] text-text-muted">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketsForRegistered;
