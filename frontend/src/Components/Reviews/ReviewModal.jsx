import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, enrollmentId, internshipTitle, onReviewSuccess }) => {
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return toast.error('Please enter your review');

        const token = localStorage.getItem('token');
        if (!token) return toast.error('Please login again');

        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/enrollments/${enrollmentId}/review`,
                { reviewText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Review submitted successfully!');
            setReviewText('');
            onReviewSuccess();
            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to submit review';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="review-modal glass"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <div className="modal-header">
                            <h3 className="outfit">Write a Review</h3>
                            <button className="close-modal" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="review-form">
                            <p className="form-info">Sharing your experience at <strong>{internshipTitle}</strong></p>
                            <textarea
                                className="review-textarea"
                                placeholder="Tell us about your learning experience, mentors, and projects..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                required
                                rows={5}
                            />
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={onClose}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;
