'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, ArrowRight, Wallet, Sparkles } from 'lucide-react';
import styles from './InternshipCard.module.css';

const InternshipCard = ({ item, index }) => {
    const router = useRouter();
    const imageUrl = item.image?.startsWith('http') ? item.image : `/api/uploads/${item.image}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={styles.internCard}
            onClick={() => router.push(`/internships/${item._id}`)}
        >
            <div className={styles.internCardImage}>
                <img src={imageUrl} alt={item.title} />
                <div className={styles.internCardBadge}>
                    <Sparkles size={12} />
                    <span>{item.domain}</span>
                </div>
            </div>

            <div className={styles.internCardBody}>
                <div className={styles.internCardContent}>
                    <h3 className={`${styles.internCardTitle} font-[family-name:var(--font-outfit)]`}>{item.title}</h3>
                    {item.description && item.description !== 'na' && (
                        <p className={styles.internCardDesc}>{item.description}</p>
                    )}
                </div>

                <div className={styles.internCardFooter}>
                    <div className={styles.internStatItem}>
                        <span className={styles.internStatLabel}>
                            <Wallet size={12} /> Fee
                        </span>
                        <span className={`${styles.internStatValue} !text-[var(--color-primary-light)]`}>₹{item.fee}</span>
                    </div>
                    <div className={styles.internStatItem}>
                        <span className={styles.internStatLabel}>
                            <Clock size={12} /> Duration
                        </span>
                        <span className={styles.internStatValue}>{item.duration}</span>
                    </div>
                </div>

                <div className="btn btn-primary w-full !py-[0.65rem] !rounded-lg !font-semibold !text-[0.875rem] flex items-center justify-center gap-2">
                    Enrol Now <ArrowRight size={18} />
                </div>
            </div>
        </motion.div>
    );
};

export default InternshipCard;
