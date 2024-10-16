import React from 'react';
import styles from '../style/ConfirmationModal.module.css';

/**
 * A modal that asks the user to confirm an action.
 * It shows a message and has two buttons: "Confirm" and "Cancel".
 * The "Confirm" button will call the onConfirm function when clicked.
 * The "Cancel" button will call the onClose function when clicked.
 */
interface ConfirmationModalProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, message, onConfirm, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Confirmation</h2>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.yesButton} onClick={onConfirm}>Yes</button>
          <button className={styles.noButton} onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
