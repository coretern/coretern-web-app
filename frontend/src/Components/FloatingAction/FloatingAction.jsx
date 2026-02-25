import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import './FloatingAction.css';

const FloatingAction = () => {
    return (
        <motion.div
            className="floating-action"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => window.open('https://wa.me/911234567890', '_blank')} // Placeholder for WhatsApp/Support
        >
            <MessageSquare size={24} />
            <div className="pulse-ring"></div>
        </motion.div>
    );
};

export default FloatingAction;
