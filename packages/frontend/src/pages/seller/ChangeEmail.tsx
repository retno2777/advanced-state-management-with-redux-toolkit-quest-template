import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeSellerEmail } from '../../features/seller/sellerSlice';
import { RootState } from '../../app/store';
import Modal from '../../components/modal/modal_notification';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from './style/ChangeSellerEmail.module.css';

/**
 * Page for changing seller email
 * 
 * This page is for changing seller email. It will display a form that asks
 * for current email, new email and password. After submitting the form, it
 * will call the changeSellerEmail thunk from sellerSlice. If the thunk is
 * successful, it will show a success modal and navigate to home seller page.
 * If the thunk is failed, it will show an error modal.
 * 
 * @returns {JSX.Element} The component's JSX element.
 */
const ChangeSellerEmail: React.FC = () => {
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.seller);

  /**
   * Handle form submission
   * 
   * This function is called when the form is submitted. It will call the
   * changeSellerEmail thunk from sellerSlice with the form data as an argument.
   * If the thunk is successful, it will show a success modal and navigate to
   * home seller page. If the thunk is failed, it will show an error modal.
   * 
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(changeSellerEmail({ currentEmail, newEmail, password }));
    if (changeSellerEmail.fulfilled.match(result)) {
      setModalTitle('Success');
      setModalMessage('Email changed successfully!');
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate('/home-seller');
      }, 2000);
    } else {
      setModalTitle('Error');
      setModalMessage(result.payload as string || 'Failed to change email. Please try again.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      resetFormFields();
    }
  };

  /**
   * Reset form fields after failure or success
   */
  const resetFormFields = () => {
    setCurrentEmail('');
    setNewEmail('');
    setPassword('');
  };

  return (
    <div className={styles.container}>
      <SidebarSeller />

      <div className={styles.mainContent}>
        <h1>Change Email</h1>
        <form onSubmit={handleChangeEmail} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="currentEmail">Current Email</label>
            <input
              type="email"
              id="currentEmail"
              value={currentEmail}
              placeholder="Enter current email"
              onChange={(e) => setCurrentEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="newEmail">New Email</label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              placeholder="Enter new email"
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter password for verification"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
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

export default ChangeSellerEmail;
