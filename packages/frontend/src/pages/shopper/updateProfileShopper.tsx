import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateShopperProfile } from '../../features/shopper/shopperSlice'; // Import thunk untuk update profil shopper
import Modal from '../../components/modal/modal_notification'; // Import modal notifikasi
import { RootState } from '../../app/store';
import styles from './style/UpdateProfileShopper.module.css'; // Import CSS Module untuk styling
import SidebarShopper from '../../components/sidebar/sidebar_shopper'; // Import Sidebar Shopper

const UpdateShopperProfilePage = () => {
  const dispatch = useDispatch();

  // Ambil data profil dari Redux state
  const { shopper } = useSelector((state: RootState) => state.shopper);
  const [firstName, setFirstName] = useState(shopper?.firstName || '');
  const [lastName, setLastName] = useState(shopper?.lastName || '');
  const [address, setAddress] = useState(shopper?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(shopper?.phoneNumber || '');
  const [birthday, setBirthday] = useState(shopper?.birthDay || ''); // State untuk birthday
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
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('birthDay', birthday); // Kirimkan tanggal lahir yang diperbarui
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture); // Pastikan gambar dikirim dengan nama 'profilePicture'
    }

    try {
      const result = await dispatch(updateShopperProfile(formData));
      if (updateShopperProfile.fulfilled.match(result)) {
        setModalMessage('Profile updated successfully!');
      } else {
        setModalMessage('Failed to update profile.');
      }
    } catch (err) {
      setModalMessage('An error occurred during the update process.');
    } finally {
      setShowModal(true); // Tampilkan modal setelah submit
      setTimeout(() => {
        setShowModal(false); // Otomatis tutup modal setelah 3 detik
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
            <label>Birthday</label> {/* Input untuk Birthday */}
            <input
              type="date"
              value={birthday} // Menampilkan value birthday
              onChange={(e) => setBirthday(e.target.value)} // Mengubah value birthday
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Profile Picture</label> {/* Input untuk upload gambar */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange} // Handle perubahan file gambar
            />
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

export default UpdateShopperProfilePage;
