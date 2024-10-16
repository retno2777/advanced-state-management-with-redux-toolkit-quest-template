import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { resetShopperState } from '../../features/shopper/shopperSlice';
import { resetProductState } from '../../features/product/productSlice';
import { resetCartState } from '../../features/cart/cartSlice';
import { resetOrderState } from '../../features/order/shopper/ordersShopperSlice';
import styles from '../style/Sidebar-shopper.module.css';

/**
 * The navigation bar component for shopper
 * 
 * This component renders a navigation bar with links to the shopper's home page, cart, orders, order history, and profile
 * 
 * @returns A JSX element representing the navigation bar
 */
const SidebarShopper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Handles the logout process
   * 
   * Dispatches the logout action, resets the shopper state, product state, cart state, and order state, and navigates to the home page
   */
  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetShopperState());
    dispatch(resetProductState());
    dispatch(resetCartState());
    dispatch(resetOrderState());
    navigate('/');
  };

  return (
    // Render the sidebar navigation bar with links to various shopper pages
    <div className={styles.sidebar}>
      <ul>
        <li>
          <Link to="/home-shopper">Home</Link>
        </li>
        <li>
          <Link to="/shopper/cart">Cart</Link>
        </li>
        <li>
          <Link to="/shopper/orders/pending">Order</Link>
        </li>
        <li>
          <Link to="/shopper/order-history">Order History</Link>
        </li>
        <li>
          <Link to="/shopper-profile">Profile</Link>
        </li>
      </ul>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SidebarShopper;
