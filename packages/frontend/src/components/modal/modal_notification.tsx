// Modal.tsx
import React from 'react';
import styles from '../style/Modal.module.css';  // Import CSS Module untuk modal

interface ModalProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, show, onClose }) => {
  if (!show) return null; // Jika show false, modal tidak ditampilkans

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
