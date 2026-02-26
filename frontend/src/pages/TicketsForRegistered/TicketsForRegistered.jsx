import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, LifeBuoy } from 'lucide-react';
import toast from 'react-hot-toast';
import './TicketsForRegistered.css';

const TicketsForRegistered = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.post('http://localhost:5000/api/tickets', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(`Support Ticket Raised! ID: ${data.data.ticketId}`, { duration: 6000 });
                setFormData({ subject: '', message: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to raise ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registered-tickets-container">
            <div className="card glass p-8">
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
                            rows="6"
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
        </div>
    );
};

export default TicketsForRegistered;
