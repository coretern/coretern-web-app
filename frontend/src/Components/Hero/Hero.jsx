import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const stats = [
        { value: '500+', label: 'Students Trained' },
        { value: '50+', label: 'Programs Offered' },
        { value: '95%', label: 'Placement Rate' },
        { value: '4.9★', label: 'Student Rating' },
    ];

    return (
        <section className="hero">
            <div className="hero-background">
                <div className="hero-grid" />
                <div className="hero-bg-glow" />
                <div className="hero-orb-1" />
                <div className="hero-orb-2" />
            </div>

            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link to="/internships" className="hero-eyebrow-link">
                        <span className="hero-eyebrow">
                            <span className="hero-eyebrow-dot" />
                            <Sparkles size={14} />
                            Summer Internship 2026 — Applications Open
                        </span>
                    </Link>

                    <h1 className="hero-title outfit">
                        <span className="line">Build the Future</span>
                        <span className="line gradient-text">of Digital India</span>
                    </h1>

                    <p className="hero-description">
                        Cutting-edge software solutions and premium internship programs that bridge the gap between education and industry excellence.
                    </p>

                    <div className="hero-actions">
                        <Link to="/internships" className="btn btn-primary">
                            <Code2 size={20} />
                            View Internships
                            <ArrowRight size={18} />
                        </Link>
                        <a href="#services" className="btn btn-outline">
                            Explore Services
                        </a>
                    </div>

                    <div className="hero-stats">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className="hero-stat"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                            >
                                <span className="hero-stat-value">{stat.value}</span>
                                <span className="hero-stat-label">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
