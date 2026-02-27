import React from 'react';
import { motion } from 'framer-motion';
import { User, MessageSquareText } from 'lucide-react';
import './StudentReviews.css';

const StudentReviews = ({ internshipTitle }) => {
    // In a real app, these might come from an API filtered by internship ID
    const reviews = [
        {
            id: 1,
            name: "Aman Verma",
            date: "2 months ago",
            text: `The ${internshipTitle || 'program'} completely changed my career path. The mentors were always available to solve doubts.`,
            avatar: "AV"
        },
        {
            id: 2,
            name: "Priya Kapoor",
            date: "1 month ago",
            text: "Practical learning is the core here. The projects are actually challenging and mimic real-world scenarios.",
            avatar: "PK"
        },
        {
            id: 3,
            name: "Ishan Malhotra",
            date: "3 weeks ago",
            text: "Great experience! The certification helped me land my first job at a top startup.",
            avatar: "IM"
        }
    ];

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
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="student-review-item glass"
                    >
                        <div className="review-user-header">
                            <div className="avatar-placeholder outfit">
                                {review.avatar}
                            </div>
                            <div className="user-meta">
                                <h4 className="outfit">{review.name}</h4>
                                <span>{review.date}</span>
                            </div>
                        </div>
                        <p className="review-content">"{review.text}"</p>
                    </motion.div>
                ))}
            </div>

            <div className="review-action-footer card glass">
                <p>Did you complete this internship?</p>
                <button className="btn btn-outline btn-sm">Write a Review</button>
            </div>
        </div>
    );
};

export default StudentReviews;
