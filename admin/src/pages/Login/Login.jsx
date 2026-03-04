import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });

            // Check if user is actually an admin
            const profile = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${data.token}` }
            });

            if (profile.data.data.role !== 'admin') {
                toast.error('Access Denied: Admin role required');
                return;
            }

            localStorage.setItem('token', data.token);
            toast.success('Admin Authenticated');
            onLogin();
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.error || 'Invalid Credentials or Connection error';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="card admin-login-card glass">
                <header className="admin-login-header">
                    <div className="admin-shield-icon">
                        <Shield size={32} />
                    </div>
                    <h1 className="admin-login-title outfit">Admin Access</h1>
                    <p className="admin-login-subtitle">Secure gateway for platform management</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label className="admin-label">Admin Email</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                required
                                className="admin-input"
                                placeholder="admin@coretern.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <Mail className="input-icon" size={18} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-label">Password</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                required
                                className="admin-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <Lock className="input-icon" size={18} />
                        </div>
                        <div className="admin-forgot-link-container">
                            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', display: 'block', marginTop: '0.8rem', textAlign: 'right' }}>
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    <button disabled={loading} className="btn btn-primary admin-login-btn justify-center">
                        {loading ? <Loader2 className="animate-spin" /> : 'Enter Command Center'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
