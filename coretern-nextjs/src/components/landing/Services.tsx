'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { services } from '@/data/servicesData';
import styles from './Services.module.css';

const Services = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
    };

    const handleServiceClick = (id) => {
        router.push(`/services/${id}`);
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
        <section id="services" className="bg-[var(--background)] py-[100px] relative overflow-hidden max-md:py-[40px_0_20px]">
            <div className="container">
                {/* Desktop Grid View */}
                <div className={styles.desktopGrid}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className={styles.proCard}
                            onClick={() => handleServiceClick(service.id)}
                        >
                            <div className={styles.proCardImage}>
                                <img src={service.image} alt={service.title} />
                            </div>
                            <div className={styles.proCardBody}>
                                <h3 className={`${styles.proCardTitle} font-[family-name:var(--font-outfit)]`}>{service.title}</h3>
                                <p className={styles.proCardDesc}>{service.desc}</p>
                                {service.features && service.features.length > 0 && (
                                    <ul className={styles.proCardFeatures}>
                                        {service.features.map((feature, fIndex) => (
                                            <li key={fIndex}>
                                                <span className={styles.featureDot} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className={styles.proCardFooter}>
                                    <span className={styles.learnMore}>
                                        Learn More <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Slider View */}
                <div className={styles.mobileSlider}>
                    <div className={styles.sliderContainer}>
                        <button className={`${styles.sliderArrow} ${styles.prev}`} onClick={handlePrev}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className={`${styles.sliderArrow} ${styles.next}`} onClick={handleNext}>
                            <ChevronRight size={20} />
                        </button>

                        <div className={styles.sliderViewport}>
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
                                    className={styles.slideItem}
                                    onClick={() => handleServiceClick(services[currentIndex].id)}
                                >
                                    <img src={services[currentIndex].image} alt="" className={styles.slideBg} />
                                    <div className={styles.slideOverlay} />
                                    <div className={styles.slideContentWrapper}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className={styles.slideGlassCard}
                                        >
                                            <h3 className={`${styles.slideTitle} font-[family-name:var(--font-outfit)]`}>{services[currentIndex].title}</h3>
                                            <p className={styles.slideDesc}>{services[currentIndex].desc}</p>
                                            <button className="btn btn-primary py-[0.8rem] px-7 text-[0.95rem]">
                                                Explore <ArrowRight size={18} />
                                            </button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className={styles.sliderDots}>
                            {services.map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
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
