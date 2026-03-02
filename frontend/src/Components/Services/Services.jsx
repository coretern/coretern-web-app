import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { services } from '../../data/servicesData.jsx';
import './Services.css';

const Services = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
    };

    const handleServiceClick = (id) => {
        navigate(`/services/${id}`);
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9
        })
    };

    return (
        <section id="services" className="services">
            <div className="container">
                {/* Desktop Grid View */}
                <div className="desktop-services-grid">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="service-pro-card"
                            onClick={() => handleServiceClick(service.id)}
                        >
                            <div className="pro-card-image">
                                <img src={service.image} alt={service.title} />
                            </div>
                            <div className="pro-card-body">
                                <h3 className="pro-card-title outfit">{service.title}</h3>
                                <p className="pro-card-desc">{service.desc}</p>
                                {service.features && service.features.length > 0 && (
                                    <ul className="pro-card-features">
                                        {service.features.map((feature, fIndex) => (
                                            <li key={fIndex}>
                                                <span className="dot"></span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="pro-card-footer">
                                    <span className="learn-more">
                                        Learn More <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Slider View */}
                <div className="mobile-services-slider">
                    <div className="slider-container">
                        {/* Mobile Navigation Arrows */}
                        <button className="slider-arrow prev" onClick={handlePrev}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="slider-arrow next" onClick={handleNext}>
                            <ChevronRight size={20} />
                        </button>

                        <div className="slider-viewport">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 180, damping: 28, mass: 0.8 },
                                        opacity: { duration: 0.5, ease: "easeInOut" },
                                        scale: { duration: 0.5 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = Math.abs(offset.x) * velocity.x;
                                        if (swipe < -10000) handleNext();
                                        else if (swipe > 10000) handlePrev();
                                    }}
                                    className="slide-item"
                                    onClick={() => handleServiceClick(services[currentIndex].id)}
                                >
                                    <img src={services[currentIndex].image} alt="" className="slide-bg" />
                                    <div className="slide-overlay" />

                                    <div className="slide-content-wrapper">
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="slide-glass-card"
                                        >
                                            <h3 className="slide-title outfit">{services[currentIndex].title}</h3>
                                            <p className="slide-desc">{services[currentIndex].desc}</p>
                                            <button className="btn btn-primary slide-btn">
                                                Explore <ArrowRight size={18} />
                                            </button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="slider-dots">
                            {services.map((_, i) => (
                                <div
                                    key={i}
                                    className={`dot ${i === currentIndex ? 'active' : ''}`}
                                    onClick={() => {
                                        setDirection(i > currentIndex ? 1 : -1);
                                        setCurrentIndex(i);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;

