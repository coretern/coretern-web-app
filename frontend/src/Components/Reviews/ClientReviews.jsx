import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import './ClientReviews.css';

const ClientReviews = () => {
    const reviews = [
        {
            id: 1,
            name: "Rahul Sharma",
            role: "Software Architect",
            text: "TechStart helped our team bridge the gap between academic theory and industry reality. Their specialized training modules are top-notch.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Anjali Gupta",
            role: "Product Manager",
            text: "The quality of talent that comes out of TechStart is exceptional. We've hired three interns who are now permanent team leads.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Vikram Malhotra",
            role: "Full Stack Developer",
            text: "Their cloud infrastructure course was a game changer for my career. The hands-on projects were exactly what I needed.",
            rating: 4,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
        }
    ];

    return (
        <section className="client-reviews-section">
            <div className="container">
                <header className="reviews-header text-center">
                    <span className="badge">Testimonials</span>
                    <h2 className="outfit section-title">What Our <span className="text-primary">Partners Say</span></h2>
                    <p className="section-subtitle">Join hundreds of successful professionals who elevated their careers with us.</p>
                </header>

                <div className="reviews-grid">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="review-card glass"
                        >
                            <div className="quote-icon">
                                <Quote size={24} />
                            </div>

                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "var(--primary)" : "none"} stroke={i < review.rating ? "var(--primary)" : "currentColor"} />
                                ))}
                            </div>

                            <p className="review-text">"{review.text}"</p>

                            <div className="reviewer-info">
                                <img src={review.image} alt={review.name} className="reviewer-avatar" />
                                <div className="reviewer-details">
                                    <h4 className="outfit">{review.name}</h4>
                                    <p>{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientReviews;
