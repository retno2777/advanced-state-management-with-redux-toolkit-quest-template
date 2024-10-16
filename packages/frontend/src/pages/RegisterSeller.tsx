import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerSeller } from '../features/auth/authSlice'; // Import registerSeller action dari authSlice
import { RootState } from '../app/store';
import styles from '../pages/styles/RegisterSeller.module.css'; // Import CSS Modules
import Modal from '../components/modal/modal_notification'; // Import Modal Component
import Navbar_home from '../components/navbar_footer/navbar-home'; // Import Navbar yang sudah dipisahkan

const RegisterSeller = () => {
  const [name, setName] = useState('');             // Untuk menyimpan nama penjual
  const [storeName, setStoreName] = useState('');   // Untuk menyimpan nama toko
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(
      registerSeller({
        role: 'seller',
        name,
        storeName,
        phoneNumber,
        birthDay,
        address,
        email,
        password
      })
    );

    // Jika registrasi berhasil, tampilkan modal dengan pesan khusus
    if (registerSeller.fulfilled.match(resultAction)) {
      setModalMessage('Seller registration successful!');  // Ubah pesan untuk seller
      setShowModal(true); // Tampilkan modal
      setTimeout(() => {
        setShowModal(false);
        navigate('/login');  // Redirect ke halaman login setelah modal ditutup
      }, 3000);
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
            <div className={styles.inputBox}>
              <span className={styles.details}>Birth Date</span>
              <input
                type="date"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
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
          <div className={styles.button}>
            <input type="submit" value={loading ? 'Registering...' : 'Register'} disabled={loading} />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>


        {/* Modal untuk pemberitahuan registrasi berhasil */}
        <Modal
          message={modalMessage}  // Pesan modal sesuai dengan hasil registrasi
          show={showModal}  // Kontrol tampilan modal
          onClose={() => setShowModal(false)}  // Fungsi untuk menutup modal
        />
      </div>
    </div>
  );
};

export default RegisterSeller;
