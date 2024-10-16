import React from 'react';
import styles from '../style/NotificationModal.module.css';

/**
 * Modal notification component
 * This component is used to show a notification message to the user
 * The message is passed as a prop and the component is shown or hidden
 * based on the show prop
 */
interface ModalProps {
  message: string;
  show: boolean;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ message, show, onClose }) => {
  if (!show) return null;

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
