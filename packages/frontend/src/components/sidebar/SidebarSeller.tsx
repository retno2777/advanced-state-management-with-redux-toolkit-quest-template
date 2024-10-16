import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { resetProfile } from '../../features/seller/sellerSlice';
import { resetProductState } from '../../features/product/productSlice';
import { resetOrderState } from '../../features/order/seller/ordersSellerSlice';
import styles from '../style/SidebarSeller.module.css';

/**
 * The navigation bar component for the seller
 * 
 * This component renders a navigation bar with links to the seller's profile, orders, order history, and products
 * 
 * @returns A JSX element representing the navigation bar
 */
const SidebarSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  /**
   * Handles the logout process
   * 
   * Dispatches the logout action, resets the seller's profile, product state, and order state, and navigates to the home page
   */
  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetProfile());
    dispatch(resetProductState());
    dispatch(resetOrderState());
    navigate('/');
  };

  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <Link to="/home-seller">Profile</Link>
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
