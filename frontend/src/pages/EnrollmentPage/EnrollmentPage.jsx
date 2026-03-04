import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Send, Loader2, Calendar, User, BookOpen, Hash, Mail, Phone, GraduationCap, Users, ArrowLeft, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import PageTransition from '../../Components/PageTransition';
import SEO from '../../Components/SEO';
import './EnrollmentPage.css';

const CustomSelect = ({ label, icon: Icon, name, value, options, onChange, placeholder, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="input-group custom-select-container" ref={containerRef}>
            <label>{Icon && <Icon size={16} />} {label} {required && '*'}</label>
            <div
                className={`custom-select-trigger ${isOpen ? 'active' : ''} ${value ? 'has-value' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? 'selected-value' : ''}>
                    {value ? options.find(opt => opt.value === value)?.label : placeholder}
                </span>
                <ChevronDown size={18} className={`select-arrow ${isOpen ? 'rotate' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="custom-select-dropdown"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange({ target: { name, value: option.value } });
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EnrollmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [internship, setInternship] = useState(location.state?.internship || null);
    const [loadingDetails, setLoadingDetails] = useState(!internship);
    const [cashfree, setCashfree] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        collegeRegNumber: '',
        collegeName: '',
        course: '',
        otherCourse: '',
        startDate: '',
        endDate: '',
        whatsappNumber: '',
        email: '',
        resume: null,
        agreedToRefundPolicy: false
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        // Fetch details if not provided via state
        if (!internship) {
            const fetchDetails = async () => {
                try {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/internships/${id}`);
                    setInternship(data.data);
                } catch (err) {
                    console.error('Error fetching details', err);
                    toast.error("Could not load internship details");
                } finally {
                    setLoadingDetails(false);
                }
            };
            fetchDetails();
        }

        // Load Cashfree SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        script.onload = () => {
            setCashfree(window.Cashfree({ mode: 'sandbox' }));
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [id, internship]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                e.target.value = null;
                return;
            }
            setFormData(prev => ({ ...prev, resume: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.gender || !formData.startDate || !formData.endDate || !formData.whatsappNumber || !formData.email || !formData.agreedToRefundPolicy) {
            return toast.error('Please fill all required fields and agree to the Refund Policy');
        }

        if (!cashfree) {
            return toast.error('Payment SDK loading, please wait...');
        }

        const token = localStorage.getItem('token');
        if (!token) return toast.error('Please login again');

        setSubmitting(true);
        const data = new FormData();
        data.append('internshipId', internship._id);
        data.append('fullName', formData.fullName);
        data.append('gender', formData.gender);
        data.append('collegeRegNumber', formData.collegeRegNumber);
        data.append('collegeName', formData.collegeName);
        data.append('course', formData.course === 'Other' ? (formData.otherCourse || 'Other') : formData.course);
        data.append('startDate', formData.startDate);
        data.append('endDate', formData.endDate);
        data.append('whatsappNumber', formData.whatsappNumber);
        data.append('email', formData.email);
        data.append('agreedToRefundPolicy', formData.agreedToRefundPolicy);
        if (formData.resume) {
            data.append('resume', formData.resume);
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/enrollments`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                handlePayment(response.data.payment_session_id);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit application');
            setSubmitting(false);
        }
    };

    const handlePayment = (sessionId) => {
        if (!cashfree) return;

        if (!sessionId) {
            toast.error('Payment session creation failed');
            setSubmitting(false);
            return;
        }

        toast.success('Opening Checkout...');
        cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: '_self'
        });
    };

    if (loadingDetails) {
        return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={60} /></div>;
    }

    if (!internship && !loadingDetails) {
        return (
            <div className="error-page">
                <h2>Internship Not Found</h2>
                <button onClick={() => navigate('/internships')} className="btn btn-primary">Back to Internships</button>
            </div>
        );
    }

    return (
        <PageTransition>
            <SEO title={`Apply: ${internship?.title || 'Internship'}`} description={`Enroll now in the ${internship?.title || 'TechStart'} internship and secure your spot.`} />
            <div className="enrollment-page">
                <Navbar />

                <div className="container enrollment-container">
                    <button onClick={() => navigate(-1)} className="back-btn outfit">
                        <ArrowLeft size={18} /> Back
                    </button>

                    <div className="enrollment-content">
                        <div className="enrollment-header">
                            <h1 className="outfit">Enrollment Application</h1>
                            <p className="text-text-muted">You are applying for <strong>{internship?.title}</strong></p>
                        </div>
                        <form onSubmit={handleSubmit} className="enroll-form">
                            <div className="form-section">
                                <h3 className="section-title">Personal Details</h3>
                                <div className="input-group">
                                    <label><User size={16} /> Full Name <span className="label-sub">(To be printed on certificate)</span> *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <CustomSelect
                                    label="Gender"
                                    icon={Users}
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    placeholder="Select Gender"
                                    required
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Other', label: 'Other' }
                                    ]}
                                />

                                <div className="input-row">
                                    <div className="input-group">
                                        <label><Mail size={16} /> Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label><Phone size={16} /> WhatsApp Number *</label>
                                        <PhoneInput
                                            country={'in'}
                                            value={formData.whatsappNumber}
                                            onChange={(phone) => setFormData(prev => ({ ...prev, whatsappNumber: phone }))}
                                            inputProps={{
                                                required: true,
                                                name: 'whatsappNumber',
                                                className: 'phone-input-field ql-editor'
                                            }}
                                            containerClass="phone-input-container"
                                            buttonClass="phone-input-button"
                                            dropdownClass="phone-input-dropdown"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Academic Details</h3>
                                <CustomSelect
                                    label="Course / Degree"
                                    icon={GraduationCap}
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    placeholder="Select your course"
                                    required
                                    options={[
                                        { value: 'B.Tech', label: 'B.Tech / B.E' },
                                        { value: 'BCA', label: 'BCA' },
                                        { value: 'MCA', label: 'MCA' },
                                        { value: 'M.Tech', label: 'M.Tech / M.E' },
                                        { value: 'BSC', label: 'B.Sc' },
                                        { value: 'MSC', label: 'M.Sc' },
                                        { value: 'B.Com', label: 'B.Com' },
                                        { value: 'MBA', label: 'MBA' },
                                        { value: 'Other', label: 'Other' }
                                    ]}
                                />

                                {formData.course === 'Other' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="input-group"
                                    >
                                        <label>Specify Course <span className="label-sub">(Optional)</span></label>
                                        <input
                                            type="text"
                                            name="otherCourse"
                                            placeholder="e.g. B.Sc Agriculture, Diploma, etc."
                                            value={formData.otherCourse}
                                            onChange={handleChange}
                                        />
                                    </motion.div>
                                )}

                                <div className="input-group">
                                    <label><BookOpen size={16} /> College Name <span className="label-sub">(Optional)</span></label>
                                    <input
                                        type="text"
                                        name="collegeName"
                                        placeholder="Enter your college name"
                                        value={formData.collegeName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label><Hash size={16} /> Registration / Roll Number <span className="label-sub">(Optional)</span></label>
                                    <input
                                        type="text"
                                        name="collegeRegNumber"
                                        placeholder="Enter reg number"
                                        value={formData.collegeRegNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Internship Duration <span className="title-sub">(To be printed on certificate)</span></h3>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label><Calendar size={16} /> Start Date *</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label><Calendar size={16} /> End Date *</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Documents</h3>
                                <div className="file-input-group">
                                    <label className="file-label">
                                        <Upload size={20} />
                                        <span>{formData.resume ? formData.resume.name : 'Upload NOC or Resume (Optional)'}</span>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
                                        <p className="label-sub" style={{ fontSize: '0.7rem' }}>
                                            Accepted: PDF, JPG, PNG (Max 10MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section legal-section">
                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="agreedToRefundPolicy"
                                        required
                                        name="agreedToRefundPolicy"
                                        checked={formData.agreedToRefundPolicy}
                                        onChange={(e) => setFormData(prev => ({ ...prev, agreedToRefundPolicy: e.target.checked }))}
                                    />
                                    <label htmlFor="agreedToRefundPolicy">
                                        I have read and agree to the <Link to="/refund-policy" target="_blank" className="text-primary">Refund Policy</Link>
                                    </label>
                                </div>
                            </div>

                            <div className="form-footer-actions">
                                <button type="submit" disabled={submitting} className="btn btn-primary lg w-100">
                                    {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Pay ₹ {internship.fee} & Enroll</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default EnrollmentPage;
