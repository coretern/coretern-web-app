import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Clock, CheckCircle, AlertCircle, Trash2, Loader2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import './Tickets.css';

const Tickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get('http://localhost:5000/api/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(data.data);
        } catch (err) {
            toast.error('Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Ticket status updated to ${status}`);
            fetchTickets();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteTicket = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Ticket deleted');
            fetchTickets();
        } catch (err) {
            toast.error('Failed to delete ticket');
        }
    };

    const filteredTickets = tickets.filter(t =>
        t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open': return <Clock size={16} className="text-primary" />;
            case 'pending': return <AlertCircle size={16} className="text-warning" />;
            case 'resolved': return <CheckCircle size={16} className="text-success" />;
            case 'closed': return <CheckCircle size={16} className="text-muted" />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="manage-tickets-page">
            <header className="title-box flex justify-between items-center">
                <div>
                    <h1 className="outfit">Support Tickets</h1>
                    <p className="text-text-muted">Manage user queries and technical issues</p>
                </div>
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, name or subject..."
                        className="search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="card admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Type</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Raised On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(ticket => (
                            <tr key={ticket._id}>
                                <td className="ticket-id font-mono font-bold text-primary">
                                    {ticket.ticketId}
                                </td>
                                <td>
                                    <span className={`type-badge ${ticket.type}`}>
                                        {ticket.type === 'registered' ? 'STUDENT' : 'GUEST'}
                                    </span>
                                </td>
                                <td>
                                    <span className="font-medium text-text-main">{ticket.email}</span>
                                </td>
                                <td className="max-w-xs">
                                    <span className="font-semibold text-text-main line-clamp-2">{ticket.subject}</span>
                                </td>
                                <td>
                                    <span className={`status-pill ${ticket.status}`}>
                                        {getStatusIcon(ticket.status)}
                                        {ticket.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn-icon view"
                                            title="View Full Conversation"
                                            onClick={() => navigate(`/tickets/${ticket._id}`)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <select
                                            className="status-select"
                                            value={ticket.status}
                                            onChange={(e) => handleUpdateStatus(ticket._id, e.target.value)}
                                        >
                                            <option value="open">Open</option>
                                            <option value="pending">Pending</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                        <button
                                            className="btn-icon delete"
                                            title="Delete Ticket"
                                            onClick={() => handleDeleteTicket(ticket._id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTickets.length === 0 && (
                    <div className="p-12 text-center text-text-muted">No support tickets found.</div>
                )}
            </div>
        </div>
    );
};

export default Tickets;
