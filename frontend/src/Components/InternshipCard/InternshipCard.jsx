import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Wallet, Sparkles } from 'lucide-react';
import './InternshipCard.css';

const InternshipCard = ({ item, index }) => {
    const navigate = useNavigate();
    const backendUrl = `${import.meta.env.VITE_API_URL}`;
    const imageUrl = item.image?.startsWith('http') ? item.image : `${backendUrl}/${item.image}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="intern-card"
            onClick={() => navigate(`/internships/${item._id}`)}
        >
            <div className="intern-card-image">
                <img src={imageUrl} alt={item.title} />
                <div className="intern-card-badge">
                    <Sparkles size={12} />
                    <span>{item.domain}</span>
                </div>
            </div>

            <div className="intern-card-body">
                <div className="intern-card-content">
                    <h3 className="intern-card-title outfit">{item.title}</h3>
                    {item.description && item.description !== 'na' && (
                        <p className="intern-card-desc">
                            {item.description}
                        </p>
                    )}
                </div>

                <div className="intern-card-footer">
                    <div className="intern-stat-item">
                        <span className="intern-stat-label">
                            <Wallet size={12} /> Fee
                        </span>
                        <span className="intern-stat-value text-primary">₹{item.fee}</span>
                    </div>
                    <div className="intern-stat-item">
                        <span className="intern-stat-label">
                            <Clock size={12} /> Duration
                        </span>
                        <span className="intern-stat-value">{item.duration}</span>
                    </div>
                </div>

                <div className="btn btn-primary intern-card-btn">
                    Enrol Now <ArrowRight size={18} />
                </div>
            </div>
        </motion.div>
    );
};

export default InternshipCard;
