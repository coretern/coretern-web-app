'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientReviews = () => {
    const reviews = [
        {
            id: 1,
            name: "Rahul Sharma",
            role: "Software Architect",
            text: "CoreTern helped our team bridge the gap between academic theory and industry reality. Their specialized training modules are top-notch and highly recommended.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Anjali Gupta",
            role: "Product Manager",
            text: "The quality of talent that comes out of CoreTern is exceptional. We've hired three interns who are now permanent team leads within our core engineering group.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Vikram Malhotra",
            role: "Full Stack Developer",
            text: "Their cloud infrastructure course was a game changer for my career. The hands-on projects and real-world scenarios were exactly what I needed to level up.",
            rating: 4,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-[120px] relative overflow-hidden bg-[var(--background)]">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(99,102,241,0.05)] rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[rgba(236,72,153,0.05)] rounded-full blur-[120px] -ml-64 -mb-64" />

            <div className="container relative z-10">
                <header className="mb-20 max-w-2xl mx-auto text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[0.75rem] font-black tracking-[0.3em] uppercase text-[var(--color-primary)] mb-4 block"
                    >
                        Testimonials
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-[clamp(2.5rem,5vw,3.5rem)] font-black mb-6 font-[family-name:var(--font-outfit)] leading-[1.1] tracking-tight"
                    >
                        What Our <span className="gradient-text">Partners Say</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-[var(--text-muted)] text-lg font-medium leading-relaxed"
                    >
                        Join hundreds of successful professionals who have accelerated their careers through our industry-aligned programs.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="group relative bg-[var(--surface)] p-10 rounded-[2.5rem] border border-[var(--border)] transition-all duration-500 hover:border-[var(--color-primary)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2"
                        >
                            <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                                <Quote size={60} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={16} 
                                        className={i < review.rating ? "text-[#fbbf24] fill-[#fbbf24]" : "text-[var(--border)]"} 
                                    />
                                ))}
                            </div>

                            <p className="text-[1.1rem] leading-[1.8] text-[var(--text)] mb-10 font-medium opacity-90 italic relative z-10">
                                &ldquo;{review.text}&rdquo;
                            </p>

                            <div className="flex items-center gap-5 pt-6 border-t border-[rgba(255,255,255,0.05)]">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500" />
                                    <img 
                                        src={review.image} 
                                        alt={review.name} 
                                        className="w-14 h-14 rounded-2xl object-cover border border-[var(--border)] relative z-10" 
                                    />
                                </div>
                                <div>
                                    <h4 className="text-[1.1rem] font-black font-[family-name:var(--font-outfit)] leading-none mb-1.5">{review.name}</h4>
                                    <p className="text-[0.8rem] text-[var(--text-muted)] font-bold tracking-wide uppercase opacity-70">{review.role}</p>
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
