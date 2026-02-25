import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Smartphone, Globe, Brain, Terminal } from 'lucide-react';
import ServicesInfo from '../../Components/ServicesInfo/ServicesInfo';
import './Services.css';

const services = [
    {
        title: 'Android/IOS Development',
        desc: 'Crafting exceptional user experiences and driving digital transformation through high-performance Android and IOS development.',
        icon: <Smartphone />,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2070',
        id: 'mobile',
        features: ['Native Apps', 'Cross-Platform', 'UI/UX Design']
    },
    {
        title: 'Full Stack Web Solutions',
        desc: 'Building scalable, secure, and modern web applications that empower your business to reach a global audience.',
        icon: <Globe />,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
        id: 'web',
        features: ['React/Next.js', 'Node.js Backend', 'E-commerce']
    },
    {
        title: 'AI & Data Intelligence',
        desc: 'Unlocking the power of your data with advanced machine learning models and intelligent automation systems.',
        icon: <Brain />,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070',
        id: 'ai',
        features: ['NLP Models', 'Predictive Analysis', 'Neural Networks']
    },
    {
        title: 'Cloud Infrastructure',
        desc: 'Modernizing your infrastructure with cloud-native solutions, ensuring high availability and seamless scalability.',
        icon: <Terminal />,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
        id: 'cloud',
        features: ['AWS/Azure', 'Kubernetes', 'CI/CD Pipelines']
    }
];

const Services = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [selectedService, setSelectedService] = useState(null);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
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
        <>
            <section id="services" className="services">
                <div className="container">
                    <div className="services-header">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="services-title outfit"
                        >
                            Expertise We Offer
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-text-muted"
                        >
                            Pioneering digital excellence through our core service domains.
                        </motion.p>
                    </div>

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
                                onClick={() => setSelectedService(service)}
                            >
                                <div className="pro-card-image">
                                    <img src={service.image} alt={service.title} />
                                    <div className="pro-card-icon-tab">
                                        {React.cloneElement(service.icon, { size: 28 })}
                                    </div>
                                </div>
                                <div className="pro-card-body">
                                    <h3 className="pro-card-title outfit">{service.title}</h3>
                                    <p className="pro-card-desc">{service.desc}</p>
                                    <ul className="pro-card-features">
                                        {service.features.map((feature, fIndex) => (
                                            <li key={fIndex}>
                                                <span className="dot"></span> {feature}
                                            </li>
                                        ))}
                                    </ul>
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
                                        onClick={() => setSelectedService(services[currentIndex])}
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

            <AnimatePresence>
                {selectedService && (
                    <ServicesInfo
                        service={selectedService}
                        onClose={() => setSelectedService(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Services;
