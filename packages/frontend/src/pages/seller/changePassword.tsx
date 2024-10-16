import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeSellerPassword } from '../../features/seller/sellerSlice';
import { RootState } from '../../app/store';
import Modal from '../../components/modal/modal_notification';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from './style/ChangeSellerPassword.module.css';

/**
 * This page is for seller to change their password.
 * It will show a form that asks for current password and new password.
 * After submitting the form, it will call the changeSellerPassword thunk from sellerSlice.
 * If the thunk is successful, it will show a success modal and navigate to the home seller page.
 * If the thunk fails, it will show an error modal.
 */
const ChangeSellerPassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.seller);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(changeSellerPassword({ oldPassword, newPassword }));

    if (changeSellerPassword.fulfilled.match(result)) {
      setModalTitle('Success');
      setModalMessage('Password changed successfully!');
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate('/home-seller');
      }, 2000);
    } else {
      setModalTitle('Error');
      setModalMessage(result.payload as string || 'Failed to change password. Please try again.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      setOldPassword('');
      setNewPassword('');
    }
  };

  return (
    <div className={styles.container}>
      <SidebarSeller /> {/* Sidebar on the left */}

      <div className={styles.mainContent}>
        <h1>Change Password</h1>
        <form onSubmit={handleChangePassword} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>

        {/* Notification Modal */}
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

export default ChangeSellerPassword;
