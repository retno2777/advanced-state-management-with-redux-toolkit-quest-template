import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShoppers, fetchSellers, deleteUser, deactivateUser, activateUser, resetState } from '../../features/admin/adminSlice';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import styles from './style/AdminPage.module.css';
import { logout } from '../../features/auth/authSlice';
import Footer from '../../components/navbar_footer/footer';
import Modal from '../../components/modal/modal_notification';
import ConfirmationModal from '../../components/modal/modal_confirmation';

/**
 * AdminPage
 *
 * This page is only accessible by admin.
 * It shows the list of all sellers and shoppers.
 * Admin can deactivate, activate, and delete users from this page.
 */
const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shoppers, sellers, loading, error, successMessage } = useSelector(
    (state: RootState) => state.adminslice
  );

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ email: string; userType: 'shopper' | 'seller' } | null>(null);

  useEffect(() => {
    dispatch(fetchShoppers());
    dispatch(fetchSellers());

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setNotificationMessage(error);
      setShowNotification(true);
    }

    if (successMessage) {
      setNotificationMessage(successMessage);
      setShowNotification(true);
    }
  }, [error, successMessage]);

  /**
   * Handles deactivating a user. This function is used to deactivate a user by admin.
   * @param {string} email - The email of the user to deactivate.
   */
  const handleDeactivate = async (email: string) => {
    const resultAction = await dispatch(deactivateUser({ email }));

    if (deactivateUser.fulfilled.match(resultAction)) {
      dispatch(fetchShoppers());
      dispatch(fetchSellers());

      setNotificationMessage('User has been deactivated successfully!');
    } else {
      setNotificationMessage('Failed to deactivate user. Please try again.');
    }
    setShowNotification(true);
  };

  /**
   * Handles activating a user. This function is used to activate a user by admin.
   * @param {string} email - The email of the user to activate.
   */
  const handleActivate = async (email: string) => {
    const resultAction = await dispatch(activateUser({ email }));

    if (activateUser.fulfilled.match(resultAction)) {
      dispatch(fetchShoppers());
      dispatch(fetchSellers());
      setNotificationMessage('User has been activated successfully!');
    } else {
      setNotificationMessage('Failed to activate user. Please try again.');
    }
    setShowNotification(true);
  };

  /**
   * Handles showing confirmation modal for deleting a user.
   * This function will open a modal to confirm user deletion.
   * @param {string} email - The email of the user to delete.
   * @param {'shopper' | 'seller'} userType - The type of the user to delete.
   */
  const handleShowDeleteConfirmation = (email: string, userType: 'shopper' | 'seller') => {
    setSelectedUser({ email, userType });
    setShowConfirmationModal(true);
  };

  /**
   * Handles deleting a user. This function is used to delete a user by admin.
   */
  const handleDelete = async () => {
    if (selectedUser) {
      const resultAction = await dispatch(deleteUser(selectedUser));

      if (deleteUser.fulfilled.match(resultAction)) {
        setNotificationMessage('User has been deleted successfully!');
        dispatch(fetchShoppers());
        dispatch(fetchSellers());
      } else {
        setNotificationMessage(resultAction.payload as string || 'Failed to delete user. Please try again.');
      }
      setShowNotification(true);
      setShowConfirmationModal(false);
    }
  };

  /**
   * Handles logging out of the admin dashboard.
   */
  const handleLogout = () => {
    dispatch(resetState());
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.columns}>
        {/* Shoppers Column */}
        <div className={styles.column}>
          <h2>Shoppers</h2>
          {loading && <p>Loading shoppers...</p>}
          {!loading && shoppers.length === 0 && <p>No shoppers found.</p>}
          {shoppers.map((shopper) => (
            <div key={shopper.id} className={styles.userCard}>
              <h3>{shopper.firstName} {shopper.lastName}</h3>
              <p>Email: {shopper.email}</p>
              <p>Phone: {shopper.phoneNumber}</p>
              <p>Address: {shopper.address}</p>
              <p>Active: {shopper.active ? 'Yes' : 'No'}</p>
              <div className={styles.buttonGroup}>
                <button onClick={() => handleDeactivate(shopper.email)} className={styles.deactivateButton}>
                  Deactivate Shopper
                </button>
                <button onClick={() => handleActivate(shopper.email)} className={styles.activateButton}>
                  Activate Shopper
                </button>
                <button onClick={() => handleShowDeleteConfirmation(shopper.email, 'shopper')} className={styles.deleteButton}>
                  Delete Shopper
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sellers Column */}
        <div className={styles.column}>
          <h2>Sellers</h2>
          {loading && <p>Loading sellers...</p>}
          {!loading && sellers.length === 0 && <p>No sellers found.</p>}
          {sellers.map((seller) => (
            <div key={seller.id} className={styles.userCard}>
              <h3>{seller.name}</h3>
              <p>Email: {seller.email}</p>
              <p>Store Name: {seller.storeName}</p>
              <p>Phone: {seller.phoneNumber}</p>
              <p>Active: {seller.active ? 'Yes' : 'No'}</p>
              <div className={styles.buttonGroup}>
                <button onClick={() => handleDeactivate(seller.email)} className={styles.deactivateButton}>
                  Deactivate Seller
                </button>
                <button onClick={() => handleActivate(seller.email)} className={styles.activateButton}>
                  Activate Seller
                </button>
                <button onClick={() => handleShowDeleteConfirmation(seller.email, 'seller')} className={styles.deleteButton}>
                  Delete Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Deleting User */}
      <ConfirmationModal
        show={showConfirmationModal}
        message="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        onClose={() => setShowConfirmationModal(false)}
      />

      {/* Notification Modal */}
      <Modal
        message={notificationMessage}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <Footer />
    </div>
  );
};

export default AdminPage;
