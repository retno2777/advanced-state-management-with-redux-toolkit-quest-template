import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi
import { changeSellerEmail } from '../../features/seller/sellerSlice'; // Import thunk untuk change email
import { RootState } from '../app/store';
import Modal from '../../components/modal/modal_notification'; // Import Modal Notifikasi
import styles from './style/ChangeSellerEmail.module.css'; // Import CSS untuk styling
import SidebarSeller from '../../components/sidebar/SidebarSeller'; // Import SidebarSeller

const ChangeSellerEmail = () => {
  const [currentEmail, setCurrentEmail] = useState(''); // Untuk email yang saat ini terdaftar
  const [newEmail, setNewEmail] = useState(''); // Untuk email baru yang ingin didaftarkan
  const [password, setPassword] = useState(''); // Untuk verifikasi password sebelum ganti email
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi
  const { loading, error } = useSelector((state: RootState) => state.seller);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(changeSellerEmail({ currentEmail, newEmail, password }));

    // Check if email change was successful
    if (changeSellerEmail.fulfilled.match(result)) {
      setModalTitle('Success');
      setModalMessage('Email changed successfully!');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/home-seller'); // Navigasi ke halaman home seller setelah berhasil
      }, 2000); // Navigasi setelah 3 detik
    } else {
      setModalTitle('Error');
      setModalMessage(error || 'Failed to change email');
      setShowModal(true);
      setCurrentEmail(''); // Reset current email field
      setNewEmail(''); // Reset new email field
      setPassword(''); // Reset password field
      setTimeout(() => setShowModal(false), 3000); // Tutup modal setelah 3 detik
    }
  };

  return (
    <div className={styles.container}>
      {/* SidebarSeller di sebelah kiri */}
      <SidebarSeller />
      
      {/* Konten utama di sebelah kanan */}
      <div className={styles.mainContent}>
        <h1>Change Email</h1>
        <form onSubmit={handleChangeEmail} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Current Email</label>
            <input
              type="email"
              value={currentEmail}
              placeholder="Enter current email"
              onChange={(e) => setCurrentEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>New Email</label>
            <input
              type="email"
              value={newEmail}
              placeholder="Enter new email"
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password for verification"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Changing...' : 'Change Email'}
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>

        {/* Modal Notifikasi */}
        {showModal && (
          <Modal
            title={modalTitle}
            message={modalMessage}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChangeSellerEmail;
