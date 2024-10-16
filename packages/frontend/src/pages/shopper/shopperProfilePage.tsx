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

const ShopperProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get profile data from Redux state
    const { shopper, loading, error } = useSelector((state: RootState) => state.shopper);

    const [showModal, setShowModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // Load shopper profile when the component is first rendered
    useEffect(() => {
        dispatch(loadShopperProfile());
    }, [dispatch]);

    // Function to delete profile
    const handleDeleteConfirm = async () => {
        setShowModal(false);
        try {
            const result = await dispatch(deleteShopperProfile());
            if (deleteShopperProfile.fulfilled.match(result)) {
                setNotificationMessage('Profile deleted successfully!');
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                    dispatch(logout());
                    dispatch(resetProductState());
                    navigate('/');
                }, 1000);
            } else {
                setNotificationMessage('Failed to delete profile. Please try again.');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        } catch (error) {
            setNotificationMessage('An error occurred while deleting the profile.');
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

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!shopper) {
        return <p>No profile data available.</p>;
    }

    return (
        <div className={styles.container}>
            <SidebarShopper />
            <div className={styles.mainContent}>
                <h1>Manage Your Profile</h1>

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

export default ShopperProfilePage;
