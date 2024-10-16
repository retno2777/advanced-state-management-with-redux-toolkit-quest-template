// components/navbar/OrderShopperNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Gunakan Link untuk navigasi
import styles from '../style/OrderShopperNavbar.module.css'; // CSS untuk styling

const OrderShopperNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/shopper/orders/pending">Pending </Link> {/* Link untuk pesanan pending */}
        </li>
        <li>
          <Link to="/shopper/orders/shipping">Shipping </Link> {/* Link untuk pesanan shipping */}
        </li>
        <li>
          <Link to="/shopper/orders/delivered">Delivered </Link> {/* Link untuk pesanan delivered */}
        </li>
        <li>
          <Link to="/shopper/orders/request-refunded">Request Refunded </Link> {/* Link untuk pesanan request refund */}
        </li>
      </ul>
    </nav>
  );
};

export default OrderShopperNavbar;
