import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadShopperProfile, deleteShopperProfile } from '../../features/shopper/shopperSlice';
import { logout } from '../../features/auth/authSlice';
import { resetProductState } from '../../features/product/productSlice';
import { RootState } from '../../app/store';
import SidebarShopper from '../../components/sidebar/sidebar_shopper';
import ConfirmationModal from '../../components/modal/modal_confirmation';
import Modal from '../../components/modal/modal_notification';
import styles from '../shopper/style/ShopperProfilePage.module.css';

/**
 * ShopperProfilePage
 *
 * This component renders the shopper's profile page.
 * It fetches the shopper's profile data from the Redux state and
 * renders it in a table.
 *
 * The component is accessible only if the user is logged in as a shopper.
 * If the user is not logged in, they will be redirected to the login page.
 *
 * The component is responsive and will adapt to different screen sizes.
 *
 * @returns {JSX.Element} The component's JSX element.
 */
const ShopperProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get profile data and error from Redux state
    const { shopper, loading, error } = useSelector((state: RootState) => state.shopper);

    const [showModal, setShowModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationTitle, setNotificationTitle] = useState('');

    // Load shopper profile when the component is first rendered
    useEffect(() => {
        dispatch(loadShopperProfile());
    }, [dispatch]);

    // Function to delete the shopper profile
    const handleDeleteConfirm = async () => {
        setShowModal(false); // Close confirmation modal
        try {
            // Attempt to delete profile
            const result = await dispatch(deleteShopperProfile());
            if (deleteShopperProfile.fulfilled.match(result)) {
                setNotificationTitle('Success');
                setNotificationMessage('Profile deleted successfully!');
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                    dispatch(logout());
                    dispatch(resetProductState());
                    navigate('/');
                }, 2000);
            } else {
                setNotificationTitle('Error');
                setNotificationMessage(result.payload as string || 'Failed to delete profile. Please try again.');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        } catch {
            setNotificationTitle('Error');
            setNotificationMessage('Failed to delete profile. Please try again.');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!shopper) {
        return <p>No profile data available.</p>;
    }

    return (
        <div className={styles.container}>
            <SidebarShopper />
            <div className={styles.mainContent}>
                <h1 className={styles.title}>Your Profile</h1>
                <div className={styles.profileCard}>
                    <div className={styles.cardHeader}>
                        {shopper.profilePicture ? (
                            <img src={shopper.profilePicture} alt="Profile" className={styles.profileImage} />
                        ) : (
                            <img src="https://via.placeholder.com/150" alt="Default Profile" className={styles.profileImage} />
                        )}
                        <div className={styles.headerText}>
                            <h2>{`${shopper.firstName} ${shopper.lastName}`}</h2>
                            <span className={shopper.active ? styles.activeBadge : styles.notActiveBadge}>
                                {shopper.active ? 'Active' : 'Not Active'}
                            </span>
                        </div>
                    </div>

                    <table className={styles.profileTable}>
                        <tbody>
                            <tr>
                                <td><strong>Phone</strong></td>
                                <td>:</td>
                                <td>{shopper.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>Address</strong></td>
                                <td>:</td>
                                <td>{shopper.address}</td>
                            </tr>
                            <tr>
                                <td><strong>Birthday</strong></td>
                                <td>:</td>
                                <td>{new Date(shopper.birthDay).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Created At</strong></td>
                                <td>:</td>
                                <td>{new Date(shopper.createdAt).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Updated At</strong></td>
                                <td>:</td>
                                <td>{new Date(shopper.updatedAt).toLocaleDateString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.actions}>
                    <Link to={`/shopper/update-profile`} className={styles.updateButton}>
                        Update Profile
                    </Link>
                    <button className={styles.deleteButton} onClick={() => setShowModal(true)}>
                        Delete Profile
                    </button>
                    <Link to={`/shopper/change-password`} className={styles.changeButton}>
                        Change Password
                    </Link>
                    <Link to={`/shopper/change-email`} className={styles.changeButton}>
                        Change Email
                    </Link>
                </div>

                {/* Confirmation Modal for profile deletion */}
                <ConfirmationModal
                    show={showModal}
                    message="Are you sure you want to delete your profile?"
                    onConfirm={handleDeleteConfirm}
                    onClose={handleCloseModal}
                />

                {/* Notification Modal for both success and error cases */}
                {showNotification && (
                    <Modal
                        title={notificationTitle}
                        message={notificationMessage}
                        show={showNotification}
                        onClose={() => setShowNotification(false)}
                    />
                )}
            </div>
        </div>
    );
};


export default ShopperProfilePage;
