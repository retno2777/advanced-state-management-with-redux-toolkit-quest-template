import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadSellerProfile, deleteSellerProfile } from '../features/seller/sellerSlice';
import { logout } from '../features/auth/authSlice';
import { resetProductState } from '../features/product/productSlice';
import { RootState } from '../app/store';
import SidebarSeller from '../components/sidebar/SidebarSeller';
import ConfirmationModal from '../components/modal/modal_confirmation';
import Modal from '../components/modal/modal_notification';
import styles from '../pages/styles/HomeSeller.module.css';


/**
 * The home page for sellers.
 *
 * This component displays the seller's profile, with the option to update,
 * delete, or change their profile information.
 *
 * The component also renders a notification modal if there is an error,
 * and confirmation modal when the user attempts to delete their profile.
 *
 * @returns {React.ReactElement} The home page for sellers.
 */
const SellerProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * The state of the seller profile.
   *
   * @type {object}
   * @property {object} profile - The seller's profile information.
   * @property {boolean} loading - Whether the data is loading.
   * @property {string} error - Any error message.
   */
  const { profile, loading } = useSelector((state: RootState) => state.seller);

  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    /**
     * Load the seller's profile information when the component mounts.
     */
    dispatch(loadSellerProfile());
  }, [dispatch]);

  /**
   * Handle the delete button click.
   *
   * This function will open the confirmation modal.
   */
  const handleDeleteClick = () => {
    setShowModal(true);
  };

  /**
   * Handle the confirm button click in the confirmation modal.
   *
   * This function will attempt to delete the seller's profile, and
   * show a notification if the operation is successful or not.
   */
  const handleDeleteConfirm = async () => {
    setShowModal(false);
    try {
      const result = await dispatch(deleteSellerProfile());
      if (deleteSellerProfile.fulfilled.match(result)) {
        setShowNotification(true);
        setNotificationMessage('Profile deleted successfully!');
        setTimeout(() => {
          setShowNotification(false);
          dispatch(logout());
          dispatch(resetProductState());
          navigate('/');
        }, 1000);
      } else {
        setShowNotification(true);
        setNotificationMessage(result.payload as string || 'Failed to delete profile. Please try again.');
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    } catch {
      setNotificationMessage('An error occurred during the profile deletion.');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  /**
   * Handle the close button click in the confirmation modal.
   *
   * This function will close the confirmation modal.
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }
  if (!profile) {
    return <p>No profile data available.</p>;
  }

  return (
    <div className={styles.container}>
      <SidebarSeller />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Your Profile</h1>

        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            {profile.profilePicture ? (
              <img src={`${profile.profilePicture}`} alt="Profile" className={styles.profileImage} />
            ) : (
              <img src="https://via.placeholder.com/150" alt="Default Profile" className={styles.profileImage} />
            )}
            <div className={styles.headerText}>
              <h2>{profile.name}</h2>
              <span className={profile.active ? styles.activeBadge : styles.notActiveBadge}>
                {profile.active ? 'Active' : 'Not Active'}
              </span>
            </div>
          </div>

          <table className={styles.profileTable}>
            <tbody>
              <tr>
                <td><strong>Phone</strong></td>
                <td>:</td>
                <td>{profile.phoneNumber}</td>
              </tr>
              <tr>
                <td><strong>Address</strong></td>
                <td>:</td>
                <td>{profile.address}</td>
              </tr>
              <tr>
                <td><strong>Store Name</strong></td>
                <td>:</td>
                <td>{profile.storeName}</td>
              </tr>
              <tr>
                <td><strong>Created At</strong></td>
                <td>:</td>
                <td>{new Date(profile.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td><strong>Updated At</strong></td>
                <td>:</td>
                <td>{new Date(profile.updatedAt).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.actions}>
          <Link to={`/seller/update-profile`} className={styles.updateButton}>
            Update Profile
          </Link>
          <button className={styles.deleteButton} onClick={handleDeleteClick}>Delete Profile</button>
          <Link to={`/seller/change-password`} className={styles.changeButton}>
            Change Password
          </Link>
          <Link to={`/seller/change-email`} className={styles.changeButton}>
            Change Email
          </Link>
        </div>

        <ConfirmationModal
          show={showModal}
          message="Are you sure you want to delete your profile?"
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
        />

        {showNotification && (
          <Modal message={notificationMessage} show={showNotification} onClose={() => setShowNotification(false)} />
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;
