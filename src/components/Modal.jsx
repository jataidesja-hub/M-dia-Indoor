import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="modal-content glass"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button className="close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Modal;
