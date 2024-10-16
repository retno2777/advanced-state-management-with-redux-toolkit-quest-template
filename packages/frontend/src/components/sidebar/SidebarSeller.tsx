import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice'; // Import action logout dari authSlice
import { resetProfile } from '../../features/seller/sellerSlice'; // Import action resetProfile dari sellerSlice
import { resetProductState } from '../../features/product/productSlice'; // Import action resetProductState dari productSlice
import { resetOrderState } from '../../features/order/seller/ordersSellerSlice';
import styles from '../style/SidebarSeller.module.css'; // Buat style module khusus untuk Sidebar Seller

const SidebarSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    dispatch(logout()); // Panggil action logout dari auth slice
    dispatch(resetProfile()); // Panggil action resetProfile dari seller slice
    dispatch(resetProductState()); // Panggil action resetProductState dari product slice
    dispatch(resetOrderState());
    navigate('/'); // Redirect ke halaman home atau login setelah logout
  };

  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <Link to="/home-seller">Profile</Link> {/* Opsi Profile di bagian paling atas */}
        </li>
        <li>
          <Link to="/seller/orders/pending">Orders</Link>
        </li>
        <li>
          <Link to="/seller/order-history">Order History</Link>
        </li>
        <li>
          <Link to="/product-seller">Products</Link>
        </li>
      </ul>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button> 
    </div>
  );
};

export default SidebarSeller;
