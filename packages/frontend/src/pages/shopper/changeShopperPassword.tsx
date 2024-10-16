import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeShopperPassword } from '../../features/shopper/shopperSlice';
import { RootState } from '../../app/store';
import Modal from '../../components/modal/modal_notification';
import SidebarShopper from '../../components/sidebar/sidebar_shopper';
import styles from './style/ChangeShopperPassword.module.css';

/**
 * ChangeShopperPassword
 *
 * This page is for shopper to change their password
 * It will show a form that ask for current password and new password
 * After submitting the form, it will call the changeShopperPassword thunk from shopperSlice
 * If the thunk is successful, it will show a success modal and navigate to home shopper page
 * If the thunk is failed, it will show an error modal
 *
 * @returns {JSX.Element} The component's JSX element.
 */
const ChangeShopperPassword = () => {
  const [oldPassword, setOldPassword] = useState(''); // Current password
  const [newPassword, setNewPassword] = useState(''); // New password
  const [showModal, setShowModal] = useState(false); // Show modal after submitting the form
  const [modalMessage, setModalMessage] = useState(''); // Message to be displayed in the modal
  const [modalTitle, setModalTitle] = useState(''); // Title of the modal

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.shopper);

  /**
   * Handle form submission
   *
   * @param {React.FormEvent} e The form event
   */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatch and unwrap the result to check if successful
      const result = await dispatch(changeShopperPassword({ oldPassword, newPassword }));
      if (changeShopperPassword.fulfilled.match(result)) {
        setModalTitle('Success');
        setModalMessage('Your password has been changed successfully!');
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/home-shopper');
        }, 2000);
      } else {
        // Handle error and show the error modal
        setModalTitle('Error');
        setModalMessage(result.payload as string || 'Failed to change password. Please try again.');
        setShowModal(true);

        // Reset the form fields
        setOldPassword('');
        setNewPassword('');

        setTimeout(() => setShowModal(false), 3000);
      }
    } catch{
      // Handle error and show the error modal
      setModalTitle('Error');
      setModalMessage('Failed to change password. Please try again.');
      setShowModal(true);

      // Reset the form fields
      setOldPassword('');
      setNewPassword('');

      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <SidebarShopper /> {/* Sidebar for navigation */}
      <div className={styles.mainContent}>
        <h1>Change Password</h1>
        <form onSubmit={handleChangePassword} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Old Password</label>
            <input
              type="password"
              value={oldPassword}
              placeholder="Enter your current password"
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              placeholder="Enter your new password"
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
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

export default ChangeShopperPassword;
