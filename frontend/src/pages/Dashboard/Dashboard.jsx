import React, { useState, useEffect } from 'react';
import SEO from '../../Components/SEO';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, LogOut, Download, X, Loader2, LifeBuoy, Rocket, Layout, Play, Calendar, Clock, ArrowLeft, MessageCircle, CheckCircle, Settings, User as UserIcon, Phone, UserCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import CertificateTemplate from '../../Components/CertificateTemplate/CertificateTemplate';
import TicketsForRegistered from '../TicketsForRegistered/TicketsForRegistered';
import ReviewModal from '../../Components/Reviews/ReviewModal';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'internships');
    const [selectedCert, setSelectedCert] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState(null);

    const fetchDashboard = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Check for order_id in URL (Payment Redirect)
        const queryParams = new URLSearchParams(window.location.search);
        const orderId = queryParams.get('order_id');

        if (orderId) {
            toast.loading('Verifying payment...', { id: 'verify' });
            try {
                await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments/verify/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Enrollment Activated!', { id: 'verify' });
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (err) {
                toast.error(err.response?.data?.error || 'Payment verification failed', { id: 'verify' });
            }
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [userRes, enrollRes, certRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments/my`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/certificates/my`, config)
            ]);

            setUser(userRes.data.data);
            setEnrollments(enrollRes.data.data);
            setCertificates(certRes.data.data);
        } catch (err) {
            console.error('Dashboard fetch error', err);
            // If token is invalid or user session expired
            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
                name: user.name,
                gender: user.gender,
                phone: user.phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(data.message || 'Profile updated successfully');
            setUser(data.data);
            setIsSettingsModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        const node = document.getElementById('certificate-print');
        if (!node) return;

        toast.loading('Generating Certificate...', { id: 'cert' });
        try {
            const dataUrl = await toPng(node, {
                quality: 1.0,
                width: 1000,
                height: 850,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });
            download(dataUrl, `Certificate-${selectedCert.certificateId}.png`);
            toast.success('Downloaded!', { id: 'cert' });
        } catch (err) {
            toast.error('Generation failed', { id: 'cert' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out');
        navigate('/login');
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={60} /></div>;

    return (
        <div className="dashboard-page">
            <SEO title="User Dashboard" noindex={true} />
            <Navbar />

            <div className="container">
                <header className="dashboard-header">
                    <div className="user-profile-info">
                        <div className="user-avatar-main outfit">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="user-details-main">
                            <h1 className="outfit">
                                {user ? `Hello, ${user.name} 👋` : 'Welcome back! 👋'}
                            </h1>
                            {user && <p className="user-email-text">{user.email}</p>}
                            <div className="user-meta-row">
                                {user && user.gender && (
                                    <div className="meta-badge">
                                        <Users size={14} />
                                        <span>{user.gender}</span>
                                    </div>
                                )}
                                {user && user.phone && (
                                    <div className="meta-badge">
                                        <Phone size={14} />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-text-muted mt-3">Manage your learning journey</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => setIsSettingsModalOpen(true)} className="btn btn-secondary">
                            <Settings size={18} /> Edit
                        </button>
                        <button onClick={handleLogout} className="btn btn-outline">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                <div className="dashboard-grid">
                    <aside className="stats-sidebar">
                        <div className="stat-card glass">
                            <div className="stat-icon primary"><BookOpen size={24} /></div>
                            <div className="stat-info">
                                <h3>Enrollments</h3>
                                <p>{enrollments.length}</p>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon secondary"><Award size={24} /></div>
                            <div className="stat-info">
                                <h3>Achievements</h3>
                                <p>{certificates.length}</p>
                            </div>
                        </div>
                        <div
                            className={`stat-card glass clickable ${activeTab === 'support' ? 'active-tab' : ''}`}
                            onClick={() => setActiveTab('support')}
                        >
                            <div className="stat-icon warning"><LifeBuoy size={24} /></div>
                            <div className="stat-info">
                                <h3>Support</h3>
                                <p>Help Center</p>
                            </div>
                        </div>


                        <Link to="/#services" className="stat-card glass clickable">
                            <div className="stat-icon secondary">
                                <Rocket size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>Explore</h3>
                                <p>Our Services</p>
                            </div>
                        </Link>

                        <Link to="/internships" className="stat-card glass clickable">
                            <div className="stat-icon primary">
                                <Layout size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>Programmes</h3>
                                <p>Latest Internships</p>
                            </div>
                        </Link>
                    </aside>

                    <main className="internships-list">
                        <div className="flex items-center gap-4 mb-8 support-tab-header">
                            {activeTab !== 'internships' && (
                                <button
                                    className="back-btn-dashboard"
                                    onClick={() => setActiveTab('internships')}
                                    title="Back to Courses"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <h2 className="outfit m-0">
                                {activeTab === 'internships' ? 'My Internships' : 'Help & Support'}
                            </h2>
                        </div>

                        {activeTab === 'support' ? (
                            <TicketsForRegistered />
                        ) : (
                            enrollments.length === 0 ? (
                                <div className="glass p-12 rounded-3xl text-center">
                                    <p className="text-text-muted mb-6">Start your career with our professional programs.</p>
                                    <Link to="/internships" className="btn btn-primary">Browse Internships</Link>
                                </div>
                            ) : enrollments.map((enrol, i) => {
                                const enrollmentInternshipId = enrol.internship?._id || enrol.internship;
                                const cert = certificates.find(c => {
                                    const certInternshipId = c.internship?._id || c.internship;
                                    return certInternshipId?.toString() === enrollmentInternshipId?.toString();
                                });
                                return (
                                    <motion.div
                                        key={enrol._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="enrollment-card glass"
                                    >
                                        <div className="enroll-info">
                                            <img src={enrol.internship.image} className="enroll-img" alt="" />
                                            <div className="enroll-text">
                                                <h3 className="outfit">{enrol.internship.title}</h3>
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <span className={`status-badge ${enrol.paymentStatus}`} style={{ width: 'fit-content' }}>
                                                        {enrol.paymentStatus}
                                                    </span>
                                                    {enrol.enrolledAt && (
                                                        <div className="flex flex-col gap-0 mt-1">
                                                            <div className="flex items-center gap-1 text-text-muted" style={{ fontSize: '0.85rem' }}>
                                                                <Calendar size={14} className="text-primary" />
                                                                <span className="font-bold">{new Date(enrol.enrolledAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-text-muted" style={{ fontSize: '0.75rem' }}>
                                                                <Clock size={13} className="text-secondary" />
                                                                <span>{new Date(enrol.enrolledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="enroll-actions">
                                            {cert ? (
                                                <div className="flex flex-col gap-2">
                                                    <button onClick={() => setSelectedCert(cert)} className="btn btn-primary">
                                                        View Certificate
                                                    </button>
                                                    {!enrol.reviewText && (
                                                        <button
                                                            onClick={() => {
                                                                setReviewTarget({
                                                                    id: enrol._id,
                                                                    title: enrol.internship.title
                                                                });
                                                                setIsReviewModalOpen(true);
                                                            }}
                                                            className="btn btn-outline btn-sm"
                                                        >
                                                            Write Review
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/dashboard/videos/${enrollmentInternshipId}`}
                                                        className="btn btn-secondary btn-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Play size={14} /> Watch Lectures
                                                    </Link>
                                                    {enrol.internship.whatsappGroup && (
                                                        <a
                                                            href={enrol.internship.whatsappGroup}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline btn-sm flex items-center justify-center gap-2"
                                                            style={{ borderColor: '#25d366', color: '#25d366' }}
                                                        >
                                                            <MessageCircle size={14} /> Join WhatsApp Group
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {enrol.paymentStatus === 'paid' && (
                                                        <Link
                                                            to={`/dashboard/videos/${enrollmentInternshipId}`}
                                                            className="btn btn-primary btn-sm flex items-center justify-center gap-2"
                                                        >
                                                            <Play size={14} /> Watch Lectures
                                                        </Link>
                                                    )}
                                                    {enrol.paymentStatus === 'paid' && enrol.internship.whatsappGroup && (
                                                        <a
                                                            href={enrol.internship.whatsappGroup}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline btn-sm flex items-center justify-center gap-2"
                                                            style={{ borderColor: '#25d366', color: '#25d366' }}
                                                        >
                                                            <MessageCircle size={14} /> Join WhatsApp Group
                                                        </a>
                                                    )}
                                                    <button className="btn btn-outline" disabled>
                                                        {enrol.status === 'pending' ? 'Verification Pending' : (
                                                            <span className="flex items-center gap-1">
                                                                <CheckCircle size={14} /> In Progress
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </main>
                </div>
            </div>

            {selectedCert && (
                <div className="cert-modal">
                    <div className="modal-actions">
                        <button onClick={handleDownload} className="btn btn-primary">
                            <Download size={20} /> Download
                        </button>
                        <button onClick={() => setSelectedCert(null)} className="btn btn-secondary">
                            <X size={20} /> Close
                        </button>
                    </div>

                    <div className="cert-preview-wrapper">
                        <CertificateTemplate
                            id={selectedCert.certificateId}
                            user={user}
                            internship={selectedCert.internship}
                            enrollment={selectedCert.enrollment}
                            date={selectedCert.issueDate}
                            qrCode={selectedCert.qrCode}
                        />
                    </div>
                </div>
            )}

            {isSettingsModalOpen && (
                <div className="modal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
                    <div
                        className="modal-content glass settings-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="modal-close" onClick={() => setIsSettingsModalOpen(false)}>
                            <X size={24} />
                        </button>
                        <div className="modal-header">
                            <h2 className="outfit">Edit Profile</h2>
                            <p className="text-text-muted">Update your personal information</p>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="settings-form">
                            <div className="settings-section">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <div className="input-with-icon">
                                            <UserIcon size={18} />
                                            <input
                                                type="text"
                                                value={user?.name || ''}
                                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <div className="input-with-icon">
                                            <UserCircle size={18} />
                                            <select
                                                value={user?.gender || ''}
                                                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                                                required
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Phone / WhatsApp</label>
                                        <div className="input-with-icon">
                                            <Phone size={18} />
                                            <input
                                                type="text"
                                                value={user?.phone || ''}
                                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                                placeholder="Enter phone number"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="input-with-icon disabled">
                                            <MessageCircle size={18} />
                                            <input type="email" value={user?.email || ''} disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-actions">
                                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                enrollmentId={reviewTarget?.id}
                internshipTitle={reviewTarget?.title}
                onReviewSuccess={fetchDashboard}
            />

            <Footer />
        </div>
    );
};

export default Dashboard;
