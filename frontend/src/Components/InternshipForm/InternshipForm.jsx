import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Send, Loader2, Calendar, User, BookOpen, Hash, Mail, Phone, GraduationCap, Users } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './InternshipForm.css';

const InternshipForm = ({ internship, onClose, onEnrollSuccess }) => {
    const [loading, setLoading] = useState(false);
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
        resume: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.gender || !formData.startDate || !formData.endDate || !formData.whatsappNumber || !formData.email) {
            return toast.error('Please fill all required fields');
        }

        const token = localStorage.getItem('token');
        if (!token) return toast.error('Please login again');

        setLoading(true);
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
        if (formData.resume) {
            data.append('resume', formData.resume);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/enrollments', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                onEnrollSuccess(response.data.payment_session_id);
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="form-overlay"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="form-container glass"
            >
                <div className="form-header">
                    <h2 className="outfit">Enrollment Application</h2>
                    <p>Apply for {internship?.title}</p>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="enroll-form">
                    <div className="form-scroll">
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

                            <div className="input-group">
                                <label><Users size={16} /> Gender *</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

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
                            <div className="input-group">
                                <label><GraduationCap size={16} /> Course / Degree *</label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Select your course</option>
                                    <option value="B.Tech">B.Tech / B.E</option>
                                    <option value="BCA">BCA</option>
                                    <option value="MCA">MCA</option>
                                    <option value="M.Tech">M.Tech / M.E</option>
                                    <option value="BSC">B.Sc</option>
                                    <option value="MSC">M.Sc</option>
                                    <option value="B.Com">B.Com</option>
                                    <option value="MBA">MBA</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {formData.course === 'Other' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="input-group"
                                >
                                    <label>Specify Course (Optional)</label>
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
                                <label><BookOpen size={16} /> College Name (Optional)</label>
                                <input
                                    type="text"
                                    name="collegeName"
                                    placeholder="Enter your college name"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label><Hash size={16} /> Registration / Roll Number (Optional)</label>
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
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Proceed to Payment</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default InternshipForm;
