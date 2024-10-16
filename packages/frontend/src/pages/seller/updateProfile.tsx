import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSellerProfile } from '../../features/seller/sellerSlice'; // Import thunk untuk update profil seller
import Modal from '../../components/modal/modal_notification'; // Import modal notifikasi yang sudah disesuaikan
import { RootState } from '../../app/store';
import styles from './style/UpdateProfile.module.css'; // Import CSS Module
import SidebarSeller from '../../components/sidebar/SidebarSeller'; // Import Sidebar Seller

const UpdateProfilePage = () => {
  const dispatch = useDispatch();

  const { profile } = useSelector((state: RootState) => state.seller); // Ambil data profil dari Redux state
  const [name, setName] = useState(profile?.name || '');
  const [storeName, setStoreName] = useState(profile?.storeName || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Handle file gambar
  const [showModal, setShowModal] = useState(false); // Modal notification state
  const [modalMessage, setModalMessage] = useState('');

  // Fungsi untuk meng-handle perubahan file gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Fungsi untuk meng-handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('storeName', storeName);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture); // Pastikan gambar dikirim dengan nama 'profilePicture'
    }

    try {
      const result = await dispatch(updateSellerProfile(formData));
      if (updateSellerProfile.fulfilled.match(result)) {
        setModalMessage('Profile updated successfully!');
      } else {
        setModalMessage('Failed to update profile.');
      }
      setShowModal(true); // Tampilkan modal setelah submit
      setTimeout(() => {
        setShowModal(false); // Otomatis tutup modal setelah 3 detik
      }, 3000);
    } catch (err) {
      setModalMessage('An error occurred during the update process.');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false); // Otomatis tutup modal setelah 3 detik jika ada error
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      <SidebarSeller /> {/* Sidebar Seller */}
      <div className={styles.mainContent}>
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
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
        
        {/* Modal untuk notifikasi, hanya tampil jika showModal true */}
        <Modal 
          message={modalMessage} 
          show={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </div>
    </div>
  );
};

export default UpdateProfilePage;
