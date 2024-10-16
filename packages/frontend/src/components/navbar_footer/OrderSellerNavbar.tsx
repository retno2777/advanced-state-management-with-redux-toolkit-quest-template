// components/navbar/OrderSellerNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Gunakan Link untuk navigasi
import styles from '../style/OrderSellerNavbar.module.css'; // CSS untuk styling

const OrderSellerNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/seller/orders/pending">Pending </Link> {/* Link untuk pesanan pending seller */}
        </li>
        <li>
          <Link to="/seller/orders/paid">Paid </Link> {/* Link untuk pesanan yang sudah dibayar */}
        </li>
        <li>
          <Link to="/seller/orders/request-refund">Refund Request </Link> {/* Link untuk pesanan dengan permintaan refund */}
        </li>
      </ul>
    </nav>
  );
};

export default OrderSellerNavbar;
