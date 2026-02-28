import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageSquareText, Send, X, Star, Loader2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './StudentReviews.css';
import ReviewModal from './ReviewModal';

const StudentReviews = ({ internshipTitle, internshipId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [myEnrollment, setMyEnrollment] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchReviews();
        if (token) {
            checkEligibility();
        }
    }, [internshipId]);

    const fetchReviews = async () => {
        try {
            const id = internshipId || 'all';
            const { data } = await axios.get(`http://localhost:5000/api/enrollments/reviews/${id}`);
            setReviews(data.data);
        } catch (err) {
            console.error('Error fetching reviews', err);
        } finally {
            setLoading(false);
        }
    };

    const checkEligibility = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/enrollments/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Find enrollment for THIS internship that is COMPLETED
            const eligible = data.data.find(enrol =>
                (enrol.internship._id === internshipId || enrol.internship === internshipId) &&
                enrol.status === 'completed'
            );
            setMyEnrollment(eligible);
        } catch (err) {
            console.error('Error checking eligibility', err);
        }
    };

    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
    const hasMore = reviews.length > 3;

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );


    return (
        <div className="student-reviews-container">
            <div className="reviews-section-header">
                <div className="flex items-center gap-2">
                    <MessageSquareText className="text-primary" size={24} />
                    <h2 className="outfit">Student Reviews</h2>
                </div>
                <p className="text-text-muted">Hear from students who completed this internship</p>
            </div>

            <div className="reviews-stack">
                {reviews.length > 0 ? (
                    displayedReviews.map((review, index) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="student-review-item glass"
                        >
                            <div className="review-user-header">
                                <div className="avatar-placeholder outfit">
                                    {review.fullName?.charAt(0) || 'U'}
                                </div>
                                <div className="user-meta">
                                    <h4 className="outfit">{review.fullName}</h4>
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                                        {!internshipId && review.internship?.title && (
                                            <>
                                                <span>•</span>
                                                <span className="text-primary font-medium">{review.internship.title}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="review-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-warning text-warning" />
                                    ))}
                                </div>
                            </div>
                            <p className="review-content">"{review.reviewText}"</p>
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-reviews text-center p-8 glass rounded-3xl">
                        <p className="text-text-muted">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        className="btn btn-outline"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Show Less' : `Show More (${reviews.length - 3})`}
                        <ChevronDown className={`transition-transform ${showAll ? 'rotate-180' : ''}`} size={18} />
                    </button>
                </div>
            )}

            {myEnrollment && !myEnrollment.reviewText && (
                <div className="review-action-footer card glass mt-8">
                    <div className="action-text">
                        <p className="font-bold">Congratulations on completing your internship!</p>
                        <p className="text-sm text-text-muted">Your feedback helps other students make the right choice.</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <MessageSquareText size={18} />
                        Write a Review
                    </button>
                </div>
            )}

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enrollmentId={myEnrollment?._id}
                internshipTitle={internshipTitle}
                onReviewSuccess={fetchReviews}
            />
        </div>
    );
};

export default StudentReviews;
