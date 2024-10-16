import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/OrderShopperNavbar.module.css';

/**
 * The navigation bar component for shopper's order pages
 * 
 * This component renders a navigation bar with links to the shopper's order pages
 * 
 * @returns A JSX element representing the navigation bar
 */
const OrderShopperNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/shopper/orders/pending">Pending </Link>
          {/* Link to the order page for pending orders */}
        </li>
        <li>
          <Link to="/shopper/orders/shipping">Shipping </Link>
          {/* Link to the order page for shipping orders */}
        </li>
        <li>
          <Link to="/shopper/orders/delivered">Delivered </Link>
          {/* Link to the order page for delivered orders */}
        </li>
        <li>
          <Link to="/shopper/orders/request-refunded">Request Refunded </Link>
          {/* Link to the order page for refund requests */}
        </li>
      </ul>
    </nav>
  );
};

export default OrderShopperNavbar;
