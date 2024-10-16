import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeShopperEmail } from '../../features/shopper/shopperSlice';
import { RootState } from '../../app/store';
import Modal from '../../components/modal/modal_notification';
import SidebarShopper from '../../components/sidebar/sidebar_shopper';
import styles from './style/ChangeShopperEmail.module.css';

/**
 * ChangeShopperEmail
 *
 * This page is for shopper to change their email address
 * It will show a form that ask for current email, new email and password
 * After submitting the form, it will call the changeShopperEmail thunk from shopperSlice
 * If the thunk is successful, it will show a success modal and navigate to home shopper page
 * If the thunk is failed, it will show an error modal
 *
 * @returns {JSX.Element} The component's JSX element.
 */
const ChangeShopperEmail = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.shopper);

  /**
   * Handle form submission
   *
   * @param {React.FormEvent} e The form event
   */
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatch and unwrap the result to check if successful
      const result = await dispatch(changeShopperEmail({ currentEmail, newEmail, password }));

      if (changeShopperEmail.fulfilled.match(result)) {
        // If successful, show success modal and navigate to home
        setModalTitle('Success');
        setModalMessage('Your email has been changed successfully!');
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/home-shopper');
        }, 2000);
      } else {
        // Handle error and show the error modal
        setModalTitle('Error');
        setModalMessage(result.payload as string || 'Failed to change email. Please try again.');
        setShowModal(true);

        // Reset the form fields
        setCurrentEmail('');
        setNewEmail('');
        setPassword('');

        setTimeout(() => setShowModal(false), 3000);
      }
    } catch {
      // Handle error and show the error modal
      setModalTitle('Error');
      setModalMessage('Failed to change email. Please try again.');
      setShowModal(true);

      // Reset the form fields
      setCurrentEmail('');
      setNewEmail('');
      setPassword('');

      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <SidebarShopper /> {/* Sidebar for navigation */}
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
              className={styles.inputField}
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
              className={styles.inputField}
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
              className={styles.inputField}
            />
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Changing...' : 'Change Email'}
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

export default ChangeShopperEmail;
