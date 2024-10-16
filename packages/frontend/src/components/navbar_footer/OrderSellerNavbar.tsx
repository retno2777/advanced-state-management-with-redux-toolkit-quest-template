import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/OrderSellerNavbar.module.css';

/**
 * The navigation bar component for seller's order pages
 * 
 * This component renders a navigation bar with links to the seller's order pages
 * 
 * @returns A JSX element representing the navigation bar
 */
const OrderSellerNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        {/* Link to the order page for pending orders */}
        <li>
          <Link to="/seller/orders/pending">Pending </Link>
        </li>
        {/* Link to the order page for paid orders */}
        <li>
          <Link to="/seller/orders/paid">Paid </Link>
        </li>
        {/* Link to the order page for refund requests */}
        <li>
          <Link to="/seller/orders/request-refund">Request Refunded </Link>
        </li>
      </ul>
    </nav>
  );
};

export default OrderSellerNavbar;
