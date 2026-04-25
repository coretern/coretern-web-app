'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
    const stats = [
        { value: '5000+', label: 'Students Trained' },
        { value: '50+', label: 'Programs Offered' },
        { value: '95%', label: 'Placement Rate' },
        { value: '4.9★', label: 'Student Rating' },
    ];

    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div className={styles.heroGrid} />
                <div className={styles.heroBgGlow} />
                <div className={styles.heroOrb1} />
                <div className={styles.heroOrb2} />
            </div>

            <div className={`container ${styles.heroContent}`}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link href="/internships" className={styles.heroEyebrowLink}>
                        <span className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine1}>
                                <span className={styles.heroEyebrowDot} />
                                <Sparkles size={14} />
                                <span className={styles.eyebrowTextMain}>Summer Internship 2026</span>
                            </span>
                            <span className={styles.eyebrowTextSub}>Applications Open</span>
                        </span>
                    </Link>

                    <h1 className={`${styles.heroTitle} font-[family-name:var(--font-outfit)]`}>
                        <span className="block">Build the Future</span>
                        <span className="block gradient-text">of Digital India</span>
                    </h1>

                    <p className={styles.heroDescription}>
                        Join premium internship programs designed to bridge the gap between education and industry excellence.
                    </p>

                    <div className={styles.heroActions}>
                        <Link href="/internships" className="btn btn-primary py-[0.9rem] px-8 text-base">
                            <Code2 size={20} />
                            View Internships
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className={styles.heroStats}>
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className={styles.heroStat}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                            >
                                <span className={styles.heroStatValue}>{stat.value}</span>
                                <span className={styles.heroStatLabel}>{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
