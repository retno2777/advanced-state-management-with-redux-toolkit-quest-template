import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsByShopper } from '../features/product/productSlice';
import { addItemToCart, checkoutSelectedItems } from '../features/cart/cartSlice';
import { RootState } from '../app/store';
import Sidebar from '../components/sidebar/sidebar_shopper';
import ConfirmationModal from '../components/modal/modal_confirmation';
import Modal from '../components/modal/modal_notification';
import styles from '../pages/styles/HomeShopper.module.css';

/**
 * Home page for shoppers
 *
 * This page displays all products available
 * from all sellers. The shopper can add products
 * to their cart and checkout directly.
 */
const Home = () => {
  const dispatch = useDispatch();

  // Fetch product data from Redux state
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  // State for controlling modals
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load products when the page first renders
  useEffect(() => {
    dispatch(getProductsByShopper());
  }, [dispatch]);

  /**
   * Function to add product to cart
   *
   * @param {number} productId - ID of the product to add
   */
  const handleAddToCart = (productId: number) => {
    const quantity = 1; // Add 1 item per click
    dispatch(addItemToCart({ productId, quantity }));
    setNotificationMessage('Product added to cart!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 1000); // Show notification for 1 second
  };

  /**
   * Handle buying a product directly (checkout)
   *
   * @param {number} productId - ID of the product to checkout
   */
  const handleBuy = (productId: number) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  /**
   * Process checkout after confirmation
   */
  const handleCheckout = async () => {
    if (selectedProductId !== null) {
      const result = await dispatch(
        checkoutSelectedItems({
          productIds: [],
          singleProductId: selectedProductId,
          singleProductQuantity: 1,
        })
      );

      // Handle success or failure of checkout
      if (checkoutSelectedItems.fulfilled.match(result)) {
        setNotificationMessage('Checkout successful!');
      } else {
        const errorMsg = result.payload as string || 'Checkout failed. Please try again.';
        setNotificationMessage(errorMsg);
      }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }

    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar stays on the left */}
      <div className={styles.mainContent}>
        <h1>Products</h1>

        {/* Show loading message if data is being fetched */}
        {loading && <p>Loading products...</p>}

        {/* Show error message if any error occurs */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Display products in a grid layout */}
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.productImage || 'https://via.placeholder.com/150'}
                alt={product.productName}
                className={styles.productImage}
              />
              <h2>{product.productName}</h2>
              {/* Table for displaying product details */}
              <table className={styles.productTable}>
                <tbody>
                  <tr>
                    <td><strong>Price</strong></td>
                    <td>:</td>
                    <td>${product.price}</td>
                  </tr>
                  <tr>
                    <td><strong>Stock</strong></td>
                    <td>:</td>
                    <td>{product.stock}</td>
                  </tr>
                  <tr>
                    <td><strong>Description</strong></td>
                    <td>:</td>
                    <td>{product.description}</td>
                  </tr>
                </tbody>
              </table>
              {/* Buttons always stay at the bottom */}
              <div className={styles.buttonContainer}>
                <button
                  className={styles.addToCartButton}
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
                <button
                  className={styles.buyButton}
                  onClick={() => handleBuy(product.id)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        message="Are you sure you want to buy this product?"
        onConfirm={handleCheckout}
        onClose={() => setShowModal(false)}
      />

      {/* Notification Modal */}
      <Modal
        message={notificationMessage}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};


export default Home;
