import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/Footer.module.css'; // Import CSS Module

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2024 Renomatsudi. All Rights Reserved.</p>
        <ul className={styles.footerLinks}>
          <li>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms-of-service">Terms of Service</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;;
