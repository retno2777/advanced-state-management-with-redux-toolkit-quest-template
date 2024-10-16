import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerShopper } from '../features/auth/authSlice';
import { RootState } from '../app/store';
import styles from '../pages/styles/RegisterShopper.module.css'; // Import CSS Modules
import Modal from '../components/modal/modal_notification'; // Import Modal Component
import Navbar_home from '../components/navbar_footer/navbar-home'; // Import Navbar

const RegisterShopper = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State untuk modal dan pesan modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Effect untuk menampilkan pesan error di modal
  useEffect(() => {
    if (error) {
      setModalMessage(error); // Tampilkan pesan error dari Redux store
      setShowModal(true); // Tampilkan modal saat ada error
    }
  }, [error]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(
      registerShopper({ role: 'shopper', firstName, lastName, phoneNumber, birthDay, address, email, password })
    );

    // Jika registrasi berhasil, tampilkan modal dengan pesan khusus
    if (registerShopper.fulfilled.match(resultAction)) {
      setModalMessage('Shopper registration successful!');
      setShowModal(true); // Tampilkan modal
      setTimeout(() => {
        setShowModal(false);
        navigate('/login'); // Redirect ke halaman login setelah modal ditutup
      }, 3000);
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

          {/* Button register */}
          <div className={styles.button}>
            <input
              type="submit"
              value={loading ? 'Registering...' : 'Register'}
              disabled={loading}
            />
          </div>

          {/* Error message jika ada */}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>

        {/* Modal untuk pemberitahuan registrasi berhasil atau gagal */}
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
