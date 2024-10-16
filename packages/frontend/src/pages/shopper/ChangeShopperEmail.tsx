import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeShopperEmail } from '../../features/shopper/shopperSlice'; // Import changeShopperEmail thunk
import { RootState } from '../../app/store';
import Modal from '../../components/modal/modal_notification'; // Import modal notification
import SidebarShopper from '../../components/sidebar/sidebar_shopper'; // Import Sidebar for shoppers
import styles from './style/ChangeShopperEmail.module.css'; // Import CSS for styling

const ChangeShopperEmail = () => {
  const [currentEmail, setCurrentEmail] = useState(''); // Current email
  const [newEmail, setNewEmail] = useState(''); // New email
  const [password, setPassword] = useState(''); // Password for verification
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use for navigation
  const { loading, error } = useSelector((state: RootState) => state.shopper);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(changeShopperEmail({ currentEmail, newEmail, password }));

    if (changeShopperEmail.fulfilled.match(result)) {
      setModalTitle('Success');
      setModalMessage('Email changed successfully!');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/home-shopper'); // Navigate to home shopper page after successful email change
      }, 2000);
    } else {
      setModalTitle('Error');
      setModalMessage(error || 'Failed to change email');
      setShowModal(true);
      setCurrentEmail(''); // Reset fields
      setNewEmail('');
      setPassword('');
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <SidebarShopper />
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
