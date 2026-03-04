import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="cookie-banner-wrapper"
                >
                    <div className="cookie-banner glass">
                        <div className="cookie-icon-box">
                            <Shield className="text-primary" size={24} />
                        </div>
                        <div className="cookie-text">
                            <h4 className="outfit">We value your privacy</h4>
                            <p>We use cookies to enhance your experience, analyze site traffic, and keep you logged in. By continuing to use our platform, you agree to our <Link to="/privacy">Privacy Policy</Link>.</p>
                        </div>
                        <div className="cookie-actions">
                            <button onClick={handleAccept} className="btn btn-primary btn-sm">Accept Cookies</button>
                            <button onClick={() => setIsVisible(false)} className="close-btn">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
