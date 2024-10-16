import React from 'react';
import styles from '../style/ConfirmationModal.module.css'; // Pastikan Anda membuat file CSS untuk modal ini

interface ConfirmationModalProps {
  show: boolean;
  message: string;
  onConfirm: () => void; // Fungsi yang dipanggil saat pengguna mengklik "Yes"
  onClose: () => void; // Fungsi yang dipanggil saat pengguna mengklik "No"
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, message, onConfirm, onClose }) => {
  if (!show) {
    return null; // Jika show false, tidak tampilkan modal
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
