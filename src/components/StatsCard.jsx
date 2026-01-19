import React from 'react';
import { motion } from 'framer-motion';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, color, trend, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="stats-card glass"
        >
            <div className="stats-icon" style={{ backgroundColor: `${color}20`, color }}>
                <Icon size={24} />
            </div>
            <div className="stats-info">
                <p className="stats-label">{title}</p>
                <h2 className="stats-value">{value}</h2>
                <p className="stats-trend">{trend}</p>
            </div>
        </motion.div>
    );
};

export default StatsCard;
