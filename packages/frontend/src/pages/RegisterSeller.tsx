import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerSeller } from '../features/auth/authSlice';
import { RootState } from '../app/store';
import styles from '../pages/styles/RegisterSeller.module.css';
import Modal from '../components/modal/modal_notification';
import Navbar_home from '../components/navbar_footer/navbar-home';

/**
 * RegisterSeller component
 * 
 * This component renders a registration form for sellers. It allows users
 * to input their details and submit them for registration. Upon successful
 * registration, a success modal is displayed. If registration fails, an
 * error notification is shown.
 * 
 * @returns {JSX.Element} The RegisterSeller component.
 */
const RegisterSeller = () => {
  // State variables for form inputs
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for modals and error notifications
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  /**
   * Handle registration form submission
   * 
   * This function dispatches the registerSeller action with the form data.
   * If registration is successful, a success modal is shown. Otherwise,
   * an error notification is displayed.
   * 
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(
        registerShopper({
          role: 'shopper',
          firstName,
          lastName,
          phoneNumber,
          birthDay,
          address,
          email,
          password,
        })
      );

      // Show success modal if registration is successful
      if (registerShopper.fulfilled.match(resultAction)) {
        setModalMessage('Shopper registration successful!');
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/login');
        }, 1000);
      } else {
        // If registration fails, display error notification
        setShowError(true);
        setErrorMessage(
          resultAction.payload?.message || 'Registration failed. Please try again.'
        );
        setTimeout(() => setShowError(false), 1000);
      }
    } catch (error) {
      // Catch any unexpected errors and display a general error notification
      setShowError(true);
      setErrorMessage('An unexpected error occurred. Please try again later.');
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className={styles.outerContainer}>
      <Navbar_home />
      <div className={styles.container}>
        <div className={styles.title}>Seller Registration</div>

        <div className={styles.switchForm}>
          Want to shop instead? <Link to="/register-shopper" className={styles.link}>Register as a Shopper</Link>
        </div>

        {/* Form for Seller Registration */}
        <form onSubmit={handleRegister}>
          <div className={styles.userDetails}>
            <div className={styles.inputBox}>
              <span className={styles.details}>Name</span>
              <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Store Name</span>
              <input
                type="text"
                value={storeName}
                placeholder="Enter your store name"
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Phone Number</span>
              <input
                type="text"
                value={phoneNumber}
                placeholder="Enter your phone number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            {/* Address input field */}
            <div className={`${styles.inputBox} ${styles.fullWidth}`}>
              <span className={styles.details}>Address</span>
              <input
                type="text"
                value={address}
                placeholder="Enter your address"
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <span className={styles.details}>Email</span>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Password</span>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Register button */}
          <div className={styles.button}>
            <input type="submit" value={loading ? 'Registering...' : 'Register'} disabled={loading} />
          </div>

          {/* Error Message if registration fails */}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>

        {/* Modal for successful registration notification */}
        <Modal
          message={modalMessage}
          show={showModal}
          onClose={() => setShowModal(false)}
        />

        {/* Modal for error notification if registration fails */}
        {showError && (
          <Modal
            message={errorMessage}
            show={showError}
            onClose={() => setShowError(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterSeller;
