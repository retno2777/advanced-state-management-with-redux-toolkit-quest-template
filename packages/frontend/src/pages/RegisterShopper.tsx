import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerShopper } from '../features/auth/authSlice';
import { RootState } from '../app/store';
import styles from '../pages/styles/RegisterShopper.module.css';
import Modal from '../components/modal/modal_notification';
import Navbar_home from '../components/navbar_footer/navbar-home';

/**
 * RegisterShopper component
 * 
 * This component renders a registration form for shoppers. It allows users
 * to input their details and submit them for registration. Upon successful
 * registration, a success modal is displayed. If registration fails, an
 * error notification is shown.
 * 
 * @returns {JSX.Element} The RegisterShopper component.
 */
const RegisterShopper = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for modal and modal message
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  /**
   * Handle form submission and show the modal with the result.
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
        <div className={styles.title}>Shopper Registration</div>

        <div className={styles.switchForm}>
          Want to grow your business? <Link to="/register-seller" className={styles.link}>Become a Seller</Link>
        </div>

        <form onSubmit={handleRegister}>
          <div className={styles.userDetails}>
            <div className={styles.inputBox}>
              <span className={styles.details}>First Name</span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Last Name</span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter your last name"
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Phone Number</span>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter your phone number"
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Birth Date</span>
              <input
                type="date"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Address</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className={styles.inputBox}>
              <span className={styles.details}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Register Button */}
          <div className={styles.button}>
            <input
              type="submit"
              value={loading ? 'Registering...' : 'Register'}
              disabled={loading}
            />
          </div>

          {/* Display Error Message if any */}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>

        {/* Modal for success or error notifications */}
        <Modal
          message={modalMessage}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default RegisterShopper;
