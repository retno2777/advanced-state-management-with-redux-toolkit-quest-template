import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Footer from '../components/navbar_footer/footer';
import Navbar_home from '../components/navbar_footer/navbar-home'; // Import Navbar yang sudah dipisahkan
import styles from '../pages/styles/Home.module.css'; // Import CSS Modules
import { getLimitedProducts } from '../features/product/productSlice'; // Import getLimitedProducts thunk
import { RootState } from '../app/store';

const Home = () => {
  const dispatch = useDispatch();

  // Ambil produk terbatas dari state
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  // Fetch produk terbatas saat komponen dimount
  useEffect(() => {
    dispatch(getLimitedProducts());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {/* Menggunakan Navbar yang dipisahkan */}
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
              {products.slice(0, 3).map(product => (
                <div key={product.id} className={styles.heroProductItem}>
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className={styles.heroProductImage}
                  />
                  <p>{product.productName}</p>
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
