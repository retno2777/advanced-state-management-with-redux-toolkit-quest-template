import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSellerProfile, loadSellerProfile } from '../../features/seller/sellerSlice';
import Modal from '../../components/modal/modal_notification';
import { RootState } from '../../app/store';
import styles from './style/UpdateProfile.module.css';
import SidebarSeller from '../../components/sidebar/SidebarSeller';

/**
 * Page for updating seller profile
 * 
 * This page allows seller to update their profile information including name, store name, address, phone number, and profile picture.
 * The page will fetch the seller's profile from the API and display the information in the form.
 * The seller can then update the information and submit the form to update the profile.
 * The page will also display a modal notification if the update is successful or not.
 * 
 */
const UpdateProfilePage = () => {
  const dispatch = useDispatch();

  const { profile, loading, error } = useSelector((state: RootState) => state.seller);

  // Initialize state for form inputs with profile values if available
  const [name, setName] = useState(profile?.name || '');
  const [storeName, setStoreName] = useState(profile?.storeName || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Fetch profile on component mount
  useEffect(() => {
    dispatch(loadSellerProfile());
  }, [dispatch]);

  // Set form inputs with profile values if available
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setStoreName(profile.storeName || '');
      setAddress(profile.address || '');
      setPhoneNumber(profile.phoneNumber || '');
    }
  }, [profile]);

  // Listen for errors and display error notification
  useEffect(() => {
    if (error) {
      setModalTitle('Error');
      setModalMessage(error);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000); 
    }
  }, [error]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('storeName', storeName);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const result = await dispatch(updateSellerProfile(formData));
      if (updateSellerProfile.fulfilled.match(result)) {
        setModalTitle('Success');
        setModalMessage('Profile updated successfully!');
      } else {
        setModalTitle('Error');
        setModalMessage(result.payload as string || 'Failed to update profile.');
      }
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    } catch {
      setModalTitle('Error');
      setModalMessage('An error occurred during the update process.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <SidebarSeller /> {/* Sidebar Seller */}
      <div className={styles.mainContent}>
        <h1>Update Profile</h1>
        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <button type="submit" className={styles.submitButton}>Update Profile</button>
          </form>
        )}

        {/* Modal for notification*/}
        <Modal
          title={modalTitle}
          message={modalMessage}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default UpdateProfilePage;
