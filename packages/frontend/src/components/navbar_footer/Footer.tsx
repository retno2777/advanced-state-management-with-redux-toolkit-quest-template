import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/Footer.module.css';

/**
 * The footer component for the application.
 *
 * This component displays a footer with copyright information and two links to
 * the privacy policy and terms of service.
 */
const Footer: React.FC = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2024 Renomatsudi. All Rights Reserved.</p>
        <ul className={styles.footerLinks}>
          <li>
            <Link to="/">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/">Terms of Service</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;;
