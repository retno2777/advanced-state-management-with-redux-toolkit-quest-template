import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { RootState } from '../app/store';
import styles from '../pages/styles/Login.module.css';
import Navbar_home from '../components/navbar_footer/navbar-home';
import Modal from '../components/modal/modal_notification';

/**
 * Login component for user authentication.
 */
const Login = () => {
  const [email, setEmail] = useState(''); // User's email
  const [password, setPassword] = useState(''); // User's password
  const [rememberMe, setRememberMe] = useState(false); // Remember me flag
  const [showErrorNotification, setShowErrorNotification] = useState(false); // Flag to show error notification
  const [notificationMessage, setNotificationMessage] = useState(''); // Notification message
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // Navigation hook
  const { loading, user } = useSelector((state: RootState) => state.auth); // Auth state

  /**
   * Effect to handle navigation after login.
   */
  useEffect(() => {
    if (user) {
      if (user.role === 'seller') {
        setTimeout(() => {
          navigate('/home-seller');
        }, 1000);
      } else if (user.role === 'shopper') {
        navigate('/home-shopper');
        setTimeout(() => {
          navigate('/home-shopper');
        }, 1000);
      } else if (user.role === 'admin') {
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    }
  }, [user, navigate]);

  /**
   * Handle user login.
   * @param {React.FormEvent} e - Form submit event
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ email, password, rememberMe }));

      // Check if login is successful
      if (login.fulfilled.match(resultAction)) {
        setNotificationMessage('Login successful! Redirecting...');
        setShowErrorNotification(true);
        setTimeout(() => {
          setShowErrorNotification(false);
        }, 1000);
      } else {
        // If login failed
        setNotificationMessage(typeof resultAction.payload?.message === 'string' ? resultAction.payload.message : 'Failed to login. Please try again.');
        setShowErrorNotification(true);
        setTimeout(() => setShowErrorNotification(false), 3000);
      }
    } catch (error) {
      // Handle unexpected errors
      setNotificationMessage('An unexpected error occurred. Please try again.');
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  return (
    <div className={styles.outerContainer}> {/* Container for the entire login page */}
      <Navbar_home /> {/* Navbar at the top */}
      <div className={styles.loginContainer}>
        <div className={styles.boxForm}>
          <div className={styles.left}>
            <div className={styles.overlay}>
              <h1>Welcome Back!</h1>
              <p>Log in to access your account and explore the latest features and offers we have just for you.</p>
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
                <div className={styles.leftColumn}>
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <span className={styles.textCheckbox}>Remember me</span>
                  </label>
                </div>
                <div className={styles.rightColumn}>
                  <p><Link to="/forgot-password">Forgot Password?</Link></p>
                </div>
              </div>
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Notification Modal for errors or success */}
      {
        showErrorNotification && (
          <Modal
            message={notificationMessage}
            show={showErrorNotification}
            onClose={() => setShowErrorNotification(false)}
          />
        )
      }
    </div>
  );
};

export default Login;
