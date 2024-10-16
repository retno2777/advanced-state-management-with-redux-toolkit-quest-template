import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/Navbar-home.module.css';

/**
 * The main navigation bar component for the home page
 * 
 * @returns a JSX element representing the navigation bar
 */
const Navbar_home = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Home</Link>
          {/* Link to the home page */}
        </li>
        <li>
          <Link to="/">About Us</Link>
          {/* Link to the about us page */}
        </li>
        <li>
          <Link to="/login">Login</Link>
          {/* Link to the login page */}
        </li>
        <li>
          <Link to="/register-shopper">Register</Link>
          {/* Link to the register page for shoppers */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar_home;
