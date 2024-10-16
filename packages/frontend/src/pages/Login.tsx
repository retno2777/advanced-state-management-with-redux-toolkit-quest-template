import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Tambahkan useNavigate untuk navigasi
import { login } from '../features/auth/authSlice';
import { RootState } from '../app/store';
import styles from '../pages/styles/Login.module.css'; // Import CSS module
import Navbar_home from '../components/navbar_footer/navbar-home'; // Import Navbar yang sudah dipisahkan

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);  // Tambahkan state untuk rememberMe
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inisialisasi navigate untuk redirect
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password, rememberMe }));
  };

  // useEffect untuk mengecek user role setelah login
  useEffect(() => {
    if (user) {
      if (user.role === 'seller') {
        navigate('/home-seller'); // Redirect ke halaman home seller
      } else if (user.role === 'shopper') {
        navigate('/home-shopper'); // Redirect ke halaman home shopper
      } else if (user.role === 'admin') {
        navigate('/admin'); // Redirect ke halaman home admin
      }
    }
  }, [user, navigate]);

  return (
    <div className={styles.outerContainer}> {/* Tambahkan outerContainer */}
      <Navbar_home /> {/* Menambahkan Navbar */}
      <div className={styles.loginContainer}>
        <div className={styles.boxForm}>
          <div className={styles.left}>
            <div className={styles.overlay}>
              <h1>Welcome Back!</h1>
              <p>We're excited to see you again! Log in to access your account and explore the latest features and offers we have just for you.</p>
            </div>
          </div>

          <div className={styles.right}>
            <h5>Login</h5>
            <form onSubmit={handleLogin} className={styles.inputs}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={styles.inputField}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className={styles.inputField}
              />
              <div className={styles.rememberMe}>
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className={styles.textCheckbox}>Remember me</span>
                </label>
                <p><Link to="/forgot-password">Forgot Password?</Link></p>
              </div>
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
