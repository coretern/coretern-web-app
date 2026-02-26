import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle Admin Impersonation Token
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const adminToken = queryParams.get('adminToken');

        if (adminToken) {
            localStorage.setItem('token', adminToken);
            toast.success('Accessing account as Admin');
            navigate('/dashboard');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', data.token);
            toast.success('Login Successful!');
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error(err.response.data.error, { duration: 5000 });
                setTimeout(() => navigate('/contact'), 3000);
            } else {
                toast.error(err.response?.data?.error || 'Invalid credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Link to="/" className="auth-back-home glass">
                <motion.div whileHover={{ x: -4 }} className="flex items-center gap-2">
                    <span className="text-xl">←</span> Back to Home
                </motion.div>
            </Link>
            <div className="auth-bg-blob"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="auth-card glass"
            >
                <header className="auth-header">
                    <h1 className="outfit">Welcome Back</h1>
                    <p className="text-text-muted">Access your personalized dashboard</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                required
                                className="auth-input"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Mail className="input-icon" size={18} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                required
                                className="auth-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <Lock className="input-icon" size={18} />
                        </div>
                    </div>

                    <button disabled={loading} className="btn btn-primary auth-btn">
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

export default Login;
