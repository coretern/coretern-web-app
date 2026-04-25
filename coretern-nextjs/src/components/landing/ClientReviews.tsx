'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientReviews = () => {
    const reviews = [
        {
            id: 1,
            name: "Rahul Sharma",
            role: "Software Architect",
            text: "CoreTern helped our team bridge the gap between academic theory and industry reality. Their specialized training modules are top-notch.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Anjali Gupta",
            role: "Product Manager",
            text: "The quality of talent that comes out of CoreTern is exceptional. We've hired three interns who are now permanent team leads.",
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
        <section style={{
            padding: '60px 0 120px 0',
            position: 'relative',
            background: `radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.08) 0%, transparent 40%)`,
        }}>
            <div className="container">
                {/* Header */}

                <header className="reviews-header" style={{ marginBottom: '40px' }}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="outfit"
                        style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                            fontWeight: 800,
                            marginBottom: '0.5rem',
                            lineHeight: 1.1,
                        }}
                    >
                        What Our <span className="gradient-text">Partners Say</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        style={{
                            color: 'var(--text-muted)',
                            fontSize: '1rem',
                            maxWidth: '500px',
                            lineHeight: 1.6,
                        }}
                    >
                        Join hundreds of successful professionals who elevated their careers with us.
                    </motion.p>
                </header>

                {/* Reviews Grid - exact match: repeat(3, 1fr), gap 40px */}
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
                            {/* Quote Icon - positioned absolutely */}
                            <div className="review-quote-icon">
                                <Quote size={24} />
                            </div>

                            {/* Stars */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '25px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={16} 
                                        fill={i < review.rating ? "var(--color-primary)" : "none"} 
                                        stroke={i < review.rating ? "var(--color-primary)" : "currentColor"} 
                                    />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p style={{
                                fontSize: '1.15rem',
                                lineHeight: 1.8,
                                color: 'var(--text)',
                                marginBottom: '40px',
                                fontStyle: 'italic',
                                opacity: 0.9,
                                flexGrow: 1,
                            }}>
                                &ldquo;{review.text}&rdquo;
                            </p>

                            {/* Reviewer Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                <img 
                                    src={review.image} 
                                    alt={review.name} 
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '16px',
                                        objectFit: 'cover',
                                        border: '2px solid rgba(255,255,255,0.1)',
                                        padding: '2px',
                                        background: 'white',
                                    }}
                                />
                                <div>
                                    <h4 className="outfit" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{review.name}</h4>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{review.role}</p>
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
