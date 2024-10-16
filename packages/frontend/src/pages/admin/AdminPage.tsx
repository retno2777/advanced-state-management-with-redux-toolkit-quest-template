import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShoppers, fetchSellers, deleteUser, deactivateUser, activateUser, resetState } from '../../features/admin/adminSlice'; // Tambahkan activateUser di sini
import { RootState } from '../../app/store'; // Import root state
import { useNavigate } from 'react-router-dom'; // Import untuk navigasi
import styles from './style/AdminPage.module.css'; // CSS module
import { logout } from '../../features/auth/authSlice';

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil data shoppers dan sellers dari Redux state
  const { shoppers, sellers, loading, error, successMessage } = useSelector((state: RootState) => state.adminslice);

  // Fetch shoppers and sellers ketika halaman di-load
  useEffect(() => {
    dispatch(fetchShoppers());
    dispatch(fetchSellers());

    // Reset state saat halaman unmount atau saat log out
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  // Handle deactivate user
  const handleDeactivate = (email: string) => {
    dispatch(deactivateUser({ email }));
  };

  // Handle activate user
  const handleActivate = (email: string) => {
    dispatch(activateUser({ email }));
  };

  // Handle delete user menggunakan email dan fetch ulang setelah delete berhasil
  const handleDelete = async (email: string, userType: 'shopper' | 'seller') => {
    await dispatch(deleteUser({ email, userType }));
    
    // Fetch ulang shoppers dan sellers setelah delete berhasil
    dispatch(fetchShoppers());
    dispatch(fetchSellers());
  };

  // Handle logout function
  const handleLogout = () => {
    // Reset state saat logout
    dispatch(resetState());
    dispatch(logout())
    // Arahkan ke halaman login
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
      <div className={styles.column}>
        <h2>Shoppers</h2>
        {loading && <p>Loading shoppers...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        {!loading && shoppers.length === 0 && <p>No shoppers found.</p>}
        {shoppers.map((shopper) => (
          <div key={shopper.id} className={styles.userCard}>
            <h3>{shopper.firstName} {shopper.lastName}</h3>
            <p>Email: {shopper.email}</p>
            <p>Phone: {shopper.phoneNumber}</p>
            <p>Address: {shopper.address}</p>
            <div className={styles.buttonGroup}>
              <button 
                onClick={() => handleDeactivate(shopper.email)} 
                className={styles.deactivateButton}
                aria-label={`Deactivate ${shopper.firstName} ${shopper.lastName}`}
              >
                Deactivate Shopper
              </button>
              <button 
                onClick={() => handleActivate(shopper.email)} 
                className={styles.activateButton}
                aria-label={`Activate ${shopper.firstName} ${shopper.lastName}`}
              >
                Activate Shopper
              </button>
              <button 
                onClick={() => handleDelete(shopper.email, 'shopper')} 
                className={styles.deleteButton}
                aria-label={`Delete ${shopper.firstName} ${shopper.lastName}`}
              >
                Delete Shopper
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.column}>
        <h2>Sellers</h2>
        {loading && <p>Loading sellers...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        {!loading && sellers.length === 0 && <p>No sellers found.</p>}
        {sellers.map((seller) => (
          <div key={seller.id} className={styles.userCard}>
            <h3>{seller.name}</h3>
            <p>Email: {seller.email}</p>
            <p>Store Name: {seller.storeName}</p>
            <p>Phone: {seller.phoneNumber}</p>
            <div className={styles.buttonGroup}>
              <button 
                onClick={() => handleDeactivate(seller.email)} 
                className={styles.deactivateButton}
                aria-label={`Deactivate seller ${seller.name}`}
              >
                Deactivate Seller
              </button>
              <button 
                onClick={() => handleActivate(seller.email)} 
                className={styles.activateButton}
                aria-label={`Activate seller ${seller.name}`}
              >
                Activate Seller
              </button>
              <button 
                onClick={() => handleDelete(seller.email, 'seller')} 
                className={styles.deleteButton}
                aria-label={`Delete seller ${seller.name}`}
              >
                Delete Seller
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
