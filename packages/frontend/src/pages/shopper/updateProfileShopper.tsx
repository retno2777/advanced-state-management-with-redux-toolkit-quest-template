import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateShopperProfile } from '../../features/shopper/shopperSlice';
import Modal from '../../components/modal/modal_notification';
import { RootState } from '../../app/store';
import styles from './style/UpdateProfileShopper.module.css';
import SidebarShopper from '../../components/sidebar/sidebar_shopper';

/**
 * UpdateShopperProfilePage
 *
 * This component renders the update profile page for a shopper.
 * It retrieves the shopper's profile data from the Redux state and
 * allows the shopper to update their first name, last name, address,
 * phone number, birthday, and profile picture.
 *
 * @returns {JSX.Element} The component's JSX element.
 */
const UpdateShopperProfilePage = () => {
  const dispatch = useDispatch();

  // Get profile data from Redux state
  const { shopper } = useSelector((state: RootState) => state.shopper);
  const [firstName, setFirstName] = useState(shopper?.firstName || '');
  const [lastName, setLastName] = useState(shopper?.lastName || '');
  const [address, setAddress] = useState(shopper?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(shopper?.phoneNumber || '');
  const [birthday, setBirthday] = useState(shopper?.birthDay || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  /**
   * Handle profile picture upload
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e The change event
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  /**
   * Handle form submission
   *
   * @param {React.FormEvent} e The form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('birthDay', birthday);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      // Dispatch the update profile action
      const result = await dispatch(updateShopperProfile(formData));
      if (updateShopperProfile.fulfilled.match(result)) {
        setModalTitle('Success');
        setModalMessage('Profile updated successfully!');
      } else {
        setModalTitle('Error');
        setModalMessage(result.payload as string || 'Failed to update profile.');
      }
    } catch {
      // Handle error and display the modal with an error message
      setModalTitle('Error');
      setModalMessage('An error occurred during the update process.');
    } finally {
      // Show modal and hide it after 3 seconds
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      <SidebarShopper /> {/* Sidebar Shopper */}
      <div className={styles.mainContent}>
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className={styles.submitButton}>Update Profile</button>
        </form>

        {/* Modal for notification */}
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

export default UpdateShopperProfilePage;
