import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FlashMessage.css';

const FlashMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -100, opacity: 0, x: '-50%' }}
          animate={{ y: 20, opacity: 1, x: '-50%' }}
          exit={{ y: -100, opacity: 0, x: '-50%' }}
          className={`flash-message ${type}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlashMessage;
