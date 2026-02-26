import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Send,
    Loader2,
    LifeBuoy,
    Clock,
    MessageSquare,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
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
            <div className="support-layout-grid">
                {/* Left Side: Raise Ticket */}
                <div className="form-column">
                    <div className="ticket-form-card glass">
                        <header className="form-header">
                            <div className="icon-badge">
                                <LifeBuoy size={20} className="text-primary" />
                            </div>
                            <div className="header-text">
                                <h3 className="outfit">New Support Case</h3>
                                <p className="text-text-muted text-xs">Need technical help? Open a case.</p>
                            </div>
                        </header>

                        <form onSubmit={handleSubmit} className="support-form">
                            <div className="input-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Cannot download cert"
                                    required
                                    className="support-input"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Message</label>
                                <textarea
                                    rows="6"
                                    placeholder="Briefly describe your issue..."
                                    required
                                    className="support-input"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button disabled={loading} className="btn-submit">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Open Ticket</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: History */}
                <div className="history-column">
                    <div className="section-head">
                        <MessageSquare className="text-primary" size={20} />
                        <h4 className="outfit">Your Recent Cases</h4>
                    </div>

                    {fetching ? (
                        <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                    ) : tickets.length === 0 ? (
                        <div className="glass p-12 rounded-[30px] text-center">
                            <HelpCircle size={48} className="mx-auto mb-4 text-text-muted opacity-20" />
                            <p className="text-text-muted font-bold text-lg">No tickets raised yet.</p>
                            <p className="text-text-muted text-sm mt-1">Your raised tickets will appear here.</p>
                        </div>
                    ) : (
                        <div className="tickets-history-list">
                            {tickets.map(ticket => (
                                <div key={ticket._id} className="compact-ticket-item">
                                    <div className="ticket-meta">
                                        <div className="ticket-top">
                                            <span className="ticket-id-badge">#{ticket.ticketId}</span>
                                            <span className={`ticket-status-pill ${ticket.status}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="ticket-date">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="ticket-title">{ticket.subject}</h4>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/dashboard/tickets/${ticket._id}`)}
                                        className="view-btn"
                                    >
                                        View Case
                                    </button>
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
