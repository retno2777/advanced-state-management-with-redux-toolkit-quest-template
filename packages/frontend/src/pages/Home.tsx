import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/navbar_footer/footer';
import Navbar_home from '../components/navbar_footer/Navbar-home';
import styles from '../pages/styles/Home.module.css'; 
import { getLimitedProducts } from '../features/product/productSlice'; 
import { RootState } from '../app/store';

/**
 * The Home component displays the hero section, features section and footer.
 */
const Home = () => {
  const dispatch = useDispatch();

  /**
   * Get the products from the store.
   */
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  /**
   * Fetch the limited products when the component mounts.
   */
  useEffect(() => {
    dispatch(getLimitedProducts());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <Navbar_home />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to MyStore</h1>
          <p>Your one-stop shop for everything you need.</p>

          {/* Display limited products if available */}
          {loading && <p>Loading...</p>}
          {error && <p>Error loading products: {error}</p>}
          {products.length > 0 && (
            <div className={styles.heroProducts}>
              {/* Display the first 3 products */}
              {products.slice(0, 3).map(product => (
                <div key={product.id} className={styles.heroProductItem}>
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className={styles.heroProductImage}
                  />
                  <p className={styles.productName}>{product.productName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>Why Shop With Us?</h2>
        <div className={styles.featureItems}>
          <div className={styles.feature}>
            <h3>High Quality Products</h3>
            <p>We offer the best products at affordable prices.</p>
          </div>
          <div className={styles.feature}>
            <h3>Fast & Secure Delivery</h3>
            <p>Get your orders delivered fast and safely.</p>
          </div>
          <div className={styles.feature}>
            <h3>Customer Satisfaction</h3>
            <p>Your satisfaction is our priority. Shop with confidence!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};



export default Home;
