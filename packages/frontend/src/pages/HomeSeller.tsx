import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadSellerProfile, deleteSellerProfile } from '../features/seller/sellerSlice'; // Import thunk untuk memuat dan menghapus profil seller
import { logout } from '../features/auth/authSlice'; // Import thunk untuk logout
import { resetProductState } from '../features/product/productSlice'; // Import reset product state
import { RootState } from '../app/store';
import SidebarSeller from '../components/sidebar/SidebarSeller';
import ConfirmationModal from '../components/modal/modal_confirmation'; // Import modal konfirmasi
import Modal from '../components/modal/modal_notification'; // Import modal notifikasi
import styles from '../pages/styles/HomeSeller.module.css'; // Import CSS Module untuk halaman Seller

const SellerProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mengambil data profil dan status dari Redux state
  const { profile, loading, error } = useSelector((state: RootState) => state.seller);

  const [showModal, setShowModal] = useState(false); // State untuk mengontrol modal konfirmasi
  const [showNotification, setShowNotification] = useState(false); // State untuk modal notifikasi
  const [notificationMessage, setNotificationMessage] = useState(''); // Pesan untuk modal notifikasi

  // Panggil thunk untuk memuat profil seller saat komponen pertama kali dirender
  useEffect(() => {
    dispatch(loadSellerProfile());
  }, [dispatch]);

  // Fungsi untuk menampilkan modal konfirmasi
  const handleDeleteClick = () => {
    setShowModal(true);
  };

  // Fungsi untuk menghapus profil
  const handleDeleteConfirm = async () => {
    setShowModal(false);
    try {
      const result = await dispatch(deleteSellerProfile());
      if (deleteSellerProfile.fulfilled.match(result)) {
        setNotificationMessage('Profile deleted successfully!');
        setShowNotification(true);

        // Tampilkan modal selama 3 detik sebelum memanggil logout, reset produk, dan navigate ke halaman home
        setTimeout(() => {
          setShowNotification(false);
          dispatch(logout()); // Panggil logout untuk membersihkan data user dan token
          dispatch(resetProductState()); // Panggil resetProductState untuk membersihkan data produk
          navigate('/'); // Arahkan ke halaman home setelah 3 detik
        }, 1000);
      } else if (deleteSellerProfile.rejected.match(result)) {
        setNotificationMessage('Failed to delete profile. Please try again.');
        setShowNotification(true);

        // Tampilkan modal selama 3 detik sebelum menutup modal notifikasi
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    } catch (error) {
      setNotificationMessage('An error occurred during the profile deletion.');
      setShowNotification(true);

      // Tampilkan modal selama 3 detik sebelum menutup modal notifikasi
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  // Fungsi untuk menutup modal konfirmasi
  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p>Loading profile...</p>; // Tampilkan pesan loading saat data sedang dimuat
  }

  if (error) {
    return <p>Error: {error}</p>; // Tampilkan pesan error jika terjadi kesalahan
  }

  if (!profile) {
    return <p>No profile data available.</p>; // Tampilkan pesan jika tidak ada profil yang dimuat
  }

  return (
    <div className={styles.container}>
      <SidebarSeller /> {/* Sidebar Seller */}
      <div className={styles.mainContent}>
        <h1>Manage Your Profile</h1>

        {/* Konten Profil Seller dalam bentuk Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            {/* Menampilkan Gambar Profil jika ada */}
            {profile.profilePicture ? (
              <img 
                src={`${profile.profilePicture}`} 
                alt="Profile" 
                className={styles.profileImage} 
              />
            ) : (
              <img 
                src="https://via.placeholder.com/150" 
                alt="Default Profile" 
                className={styles.profileImage} 
              />
            )}
            <div className={styles.headerText}>
              <h2>{profile.name}</h2>
              <span className={styles.activeBadge}>
                {profile.active ? 'Active' : 'Not Active'}
              </span>
            </div>
          </div>

          {/* Tabel untuk menampilkan data dari profil */}
          <table className={styles.profileTable}>
            <tbody>
              <tr>
                <td><strong>Store Name</strong></td>
                <td>:</td>
                <td>{profile.storeName}</td>
              </tr>
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

        {/* Tombol Update, Delete, Change Password, dan Change Email dalam bentuk card action */}
        <div className={styles.actions}>
          {/* Tambahkan Link ke halaman update profile */}
          <Link to={`/seller/update-profile`} className={styles.updateButton}>
            Update Profile
          </Link>
          <button className={styles.deleteButton} onClick={handleDeleteClick}>Delete Profile</button>
          
          {/* Tambahkan Link ke halaman Change Password */}
          <Link to={`/seller/change-password`} className={styles.changeButton}>
            Change Password
          </Link>
          
          {/* Tambahkan Link ke halaman Change Email */}
          <Link to={`/seller/change-email`} className={styles.changeButton}>
            Change Email
          </Link>
        </div>

        {/* Modal konfirmasi delete */}
        <ConfirmationModal
          show={showModal}
          message="Are you sure you want to delete your profile?"
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
        />

        {/* Modal notification setelah profil berhasil dihapus atau jika ada error */}
        {showNotification && (
          <Modal message={notificationMessage} show={showNotification} onClose={() => setShowNotification(false)} />
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;
