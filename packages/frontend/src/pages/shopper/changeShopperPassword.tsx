import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi
import { changeShopperPassword } from '../../features/shopper/shopperSlice'; // Import thunk untuk change password shopper
import { RootState } from '../../app/store';
import Modal from '../../components/modal/modal_notification'; // Import Modal Notifikasi
import SidebarShopper from '../../components/sidebar/sidebar_shopper'; // Import SidebarShopper
import styles from './style/ChangeShopperPassword.module.css'; // Import CSS untuk styling

const ChangeShopperPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState(''); // State untuk judul modal

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi
  const { loading, error } = useSelector((state: RootState) => state.shopper);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(changeShopperPassword({ oldPassword, newPassword }));

    // Check if password change was successful
    if (changeShopperPassword.fulfilled.match(result)) {
      setModalTitle('Success');
      setModalMessage('Password changed successfully!');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/home-shopper'); // Navigasi ke halaman home shopper setelah berhasil
      }, 2000); // Navigasi setelah 2 detik
    } else {
      setModalTitle('Error');
      setModalMessage(error || 'Failed to change password');
      setShowModal(true);
      setOldPassword(''); // Reset old password field
      setNewPassword(''); // Reset new password field
      setTimeout(() => setShowModal(false), 3000); // Tutup modal setelah 3 detik
    }
  };

  return (
    <div className={styles.container}>
      {/* SidebarShopper di sebelah kiri */}
      <SidebarShopper />
      
      {/* Konten utama di sebelah kanan */}
      <div className={styles.mainContent}>
        <h1>Change Password</h1>
        <form onSubmit={handleChangePassword} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>

        {/* Modal Notifikasi */}
        {showModal && (
          <Modal
            title={modalTitle} // Menampilkan judul modal
            message={modalMessage}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChangeShopperPassword;
