// components/navbar/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/Navbar-home.module.css'; // Import CSS module khusus untuk Navbar

const Navbar_home = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Home</Link> {/* Link untuk Home */}
        </li>
        <li>
          <Link to="/">About Us</Link> {/* Link untuk About Us */}
        </li>
        <li>
          <Link to="/login">Login</Link> {/* Link untuk Login */}
        </li>
        <li>
          <Link to="/register-shopper">Register</Link> {/* Link untuk shopper */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar_home;
