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
        <section className="py-[60px_0_120px] relative bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.08)_0%,transparent_40%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.08)_0%,transparent_40%)]">
            <div className="container">
                <header className="mb-[60px] max-w-[800px] mx-auto flex flex-col items-center text-center">
                    <h2 className="text-[3rem] font-extrabold mb-[10px] font-[family-name:var(--font-outfit)] max-md:text-[2.2rem]">
                        What Our <span className="text-[var(--color-primary)]">Partners Say</span>
                    </h2>
                    <p className="text-[var(--text-muted)] text-[1.2rem] max-w-[600px] leading-[1.6] max-md:text-[1.1rem] max-md:px-5">
                        Join hundreds of successful professionals who elevated their careers with us.
                    </p>
                </header>

                <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:px-5 max-md:gap-[50px]">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass py-[50px] px-10 rounded-[32px] relative bg-[rgba(255,255,255,0.03)] border border-[rgba(99,102,241,0.25)] backdrop-blur-[12px] flex flex-col shadow-none transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)] hover:border-[rgba(99,102,241,0.5)] max-md:py-10 max-md:px-[30px]"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-6 left-10 w-12 h-12 bg-[image:var(--grad-primary)] rounded-xl flex items-center justify-center text-white shadow-[0_12px_24px_rgba(99,102,241,0.4)]">
                                <Quote size={24} />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-[6px] mb-[25px]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "var(--color-primary)" : "none"} stroke={i < review.rating ? "var(--color-primary)" : "currentColor"} />
                                ))}
                            </div>

                            <p className="text-[1.15rem] leading-[1.8] text-[var(--text)] mb-10 italic opacity-90 grow max-md:text-[1.1rem]">
                                &ldquo;{review.text}&rdquo;
                            </p>

                            <div className="flex items-center gap-[18px]">
                                <img src={review.image} alt={review.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[rgba(255,255,255,0.1)] p-[2px] bg-white" />
                                <div>
                                    <h4 className="m-0 text-[1.1rem] font-bold font-[family-name:var(--font-outfit)]">{review.name}</h4>
                                    <p className="mt-1 text-[0.85rem] text-[var(--text-muted)] font-medium">{review.role}</p>
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
