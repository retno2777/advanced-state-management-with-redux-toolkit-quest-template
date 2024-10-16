// components/SidebarShopper.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice'; // Import action logout dari authSlice
import { resetShopperState } from '../../features/shopper/shopperSlice'; // Import action resetProfile dari shopperSlice
import { resetProductState } from '../../features/product/productSlice'; // Import action resetProductState dari productSlice
import {resetCartState} from '../../features/cart/cartSlice';
import { resetOrderState } from '../../features/order/shopper/ordersShopperSlice';
import styles from '../style/Sidebar-shopper.module.css'; // Buat style module khusus untuk Sidebar Shopper

const SidebarShopper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    dispatch(logout()); // Panggil action logout dari auth slice
    dispatch(resetShopperState()); // Panggil action resetProfile dari shopper slice
    dispatch(resetProductState()); // Panggil action resetProductState dari product slice
    dispatch(resetCartState());
    dispatch(resetOrderState());
    navigate('/'); // Redirect ke halaman home atau login setelah logout
  };

  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <Link to="/home-shopper">Home</Link> {/* Opsi Beranda */}
        </li>
        <li>
          <Link to="/shopper/cart">Cart</Link> {/* Opsi Keranjang */}
        </li>
        <li>
          <Link to="/shopper/orders/pending">Order</Link> {/* Opsi Pesanan */}
        </li>
        <li>
          <Link to="/shopper/order-history">Order History</Link> {/* Opsi Riwayat Pesanan */}
        </li>
        <li>
          <Link to="/shopper-profile">Profile</Link> {/* Opsi Profil */}
        </li>
      </ul>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button> {/* Tombol logout */}
    </div>
  );
};

export default SidebarShopper;
