import styles from '../landing/InternshipCard.module.css';

const SkeletonCard = () => {
    return (
        <div className={`${styles.internCard} animate-pulse`} style={{ cursor: 'default', pointerEvents: 'none' }}>
            <div className={styles.internCardImage} style={{ background: 'var(--border)', minHeight: '200px' }}></div>
            <div className={styles.internCardBody}>
                <div className={styles.internCardContent}>
                    <div style={{ height: '26px', background: 'var(--border)', borderRadius: '6px', width: '70%', marginBottom: '14px' }}></div>
                    <div style={{ height: '16px', background: 'var(--border)', borderRadius: '4px', width: '100%', marginBottom: '8px' }}></div>
                    <div style={{ height: '16px', background: 'var(--border)', borderRadius: '4px', width: '85%' }}></div>
                </div>
                <div className={styles.internCardFooter} style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
                    <div style={{ height: '20px', background: 'var(--border)', borderRadius: '4px', width: '35%' }}></div>
                    <div style={{ height: '20px', background: 'var(--border)', borderRadius: '4px', width: '35%' }}></div>
                </div>
                <div style={{ height: '46px', background: 'var(--border)', borderRadius: '10px', width: '100%', marginTop: '16px' }}></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
