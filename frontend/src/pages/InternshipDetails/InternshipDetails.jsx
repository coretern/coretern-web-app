import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, Calendar, Award, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import PageTransition from '../../Components/PageTransition';
import InternshipForm from '../../Components/InternshipForm/InternshipForm';
import StudentReviews from '../../Components/Reviews/StudentReviews';
import './InternshipDetails.css';

const InternshipDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [cashfree, setCashfree] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/internships/${id}`);
                setInternship(data.data);
            } catch (err) {
                console.error('Error fetching details', err);
            } finally {
                setLoading(false);
            }
        };

        // Load Cashfree SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        script.onload = () => {
            setCashfree(window.Cashfree({ mode: 'sandbox' }));
        };
        document.body.appendChild(script);

        fetchDetails();

        return () => {
            document.body.removeChild(script);
        };
    }, [id]);

    const handleEnroll = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to enroll');
            navigate('/login');
            return;
        }

        if (!cashfree) {
            toast.error('Payment SDK loading, please wait...');
            return;
        }

        setShowForm(true);
    };

    const handlePayment = (sessionId) => {
        if (!cashfree) return;

        console.log('Initiating checkout with session ID:', sessionId);

        if (!sessionId) {
            toast.error('Payment session creation failed');
            return;
        }

        toast.success('Opening Checkout...');
        cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: '_self'
        });
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={60} /></div>;

    return (
        <PageTransition>
            <div className="details-page">
                <Navbar />

                <div className="container">
                    <button onClick={() => navigate(-1)} className="back-btn outfit">
                        <ArrowLeft size={18} /> Back to Courses
                    </button>

                    <div className="details-grid">
                        <main className="details-main">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="details-image-wrapper glass">
                                    <img src={internship?.image} alt={internship?.title} />
                                </div>

                                <div className="details-content">
                                    <span className="details-domain">{internship?.domain}</span>
                                    <h1 className="outfit">{internship?.title}</h1>
                                    {internship?.description && internship.description !== 'na' && (
                                        <p className="details-description">{internship.description}</p>
                                    )}

                                    {internship?.details && (
                                        <div className="details-rich-content" dangerouslySetInnerHTML={{ __html: internship.details }} />
                                    )}

                                    {internship?.curriculum && internship.curriculum.length > 0 && (
                                        <div className="curriculum-section">
                                            <h2 className="outfit">What You'll Learn</h2>
                                            <div className="curriculum-grid">
                                                {internship.curriculum.map((item, i) => (
                                                    <div key={i} className="curriculum-item">
                                                        <Check className="text-primary" size={18} />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <StudentReviews internshipTitle={internship?.title} internshipId={id} />
                                </div>
                            </motion.div>
                        </main>

                        <aside className="sticky-sidebar">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="enroll-card glass"
                            >
                                <div className="price-tag outfit">₹ {internship?.fee}</div>
                                <p className="text-text-muted text-sm">One-time payment for full program access</p>

                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="btn btn-primary enroll-btn"
                                >
                                    {enrolling ? <Loader2 className="animate-spin" /> : 'Enroll Now'}
                                </button>

                                <div className="perks-list">
                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <Calendar size={22} />
                                        </div>
                                        <div className="perk-info">
                                            <p>Duration</p>
                                            <p>{internship?.duration}</p>
                                        </div>
                                    </div>
                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <Award size={22} />
                                        </div>
                                        <div className="perk-info">
                                            <p>Certification</p>
                                            <p>Industry Recognized</p>
                                        </div>
                                    </div>
                                    <div className="perk-item">
                                        <div className="perk-icon">
                                            <ShieldCheck size={22} />
                                        </div>
                                        <div className="perk-info">
                                            <p>Verification</p>
                                            <p>QR Authenticated</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </aside>
                    </div>
                </div>

                <Footer />
            </div>

            {showForm && (
                <InternshipForm
                    internship={internship}
                    onClose={() => setShowForm(false)}
                    onEnrollSuccess={handlePayment}
                />
            )}
        </PageTransition>
    );
};

export default InternshipDetails;
