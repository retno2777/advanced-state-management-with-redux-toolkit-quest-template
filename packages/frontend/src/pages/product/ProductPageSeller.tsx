import React, { useState, useEffect } from 'react';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from '../product/style/ProductPageSeller.module.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getProducts, deleteProduct } from '../../features/product/productSlice';
import ConfirmationModal from '../../components/modal/modal_confirmation';
import NotificationModal from '../../components/modal/modal_notification';
import Footer from '../../components/navbar_footer/footer';

/**
 * ProductPageSeller component
 *
 * This component renders the product page for sellers. It displays a list of
 * products, and allows the seller to create a new product, update an existing
 * product, or delete a product.
 *
 * @returns {JSX.Element} The rendered component.
 */
const ProductPageSeller: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Select the products and loading state from the state.
   */
  const { products, loading } = useSelector((state: RootState) => state.products);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  /**
   * Fetch the products when the component mounts.
   */
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  /**
   * Handle the delete button click event.
   *
   * @param {number} productId The ID of the product to delete.
   */
  const handleDeleteClick = (productId: number) => {
    setSelectedProductId(productId);
    setShowConfirmationModal(true);
  };

  /**
   * Handle the confirm delete button click event.
   */
  const handleConfirmDelete = async () => {
    if (selectedProductId !== null) {
      try {
        const resultAction = await dispatch(deleteProduct(selectedProductId));

        if (deleteProduct.fulfilled.match(resultAction)) {
          setNotificationMessage('Product deleted successfully!');
        } else {
          setNotificationMessage(resultAction.payload as string || 'Failed to delete product.');
        }
      } catch {
        setNotificationMessage('An error occurred while deleting the product.');
      }

      setShowNotificationModal(true);
      setTimeout(() => {
        setShowNotificationModal(false);
      }, 3000);
    }
    setShowConfirmationModal(false);
  };

  /**
   * Handle the cancel delete button click event.
   */
  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
  };

  /**
   * Handle the close notification modal event.
   */
  const closeNotificationModal = () => {
    setShowNotificationModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      <SidebarSeller />
      <div className={styles.mainContent}>
        <h1>Product Management</h1>
        <Link to="/create-product" className={styles.createButton}>Create New Product</Link>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className={styles.productList}>
            {products.map(product => (
              <div key={product.id} className={styles.productCard}>
                <img
                  src={product.productImage || 'https://via.placeholder.com/150'}
                  alt={product.productName}
                  className={styles.productImage}
                />
                <table className={styles.productTable}>
                  <tbody>
                    <tr>
                      <td><strong>Product Name</strong></td>
                      <td>:</td>
                      <td> {product.productName}</td>
                    </tr>
                    <tr>
                      <td><strong>Description</strong></td>
                      <td>:</td>
                      <td> {product.description}</td>
                    </tr>
                    <tr>
                      <td><strong>Price</strong></td>
                      <td>:</td>
                      <td> ${product.price}</td>
                    </tr>
                    <tr>
                      <td><strong>Stock</strong></td>
                      <td>:</td>
                      <td>{product.stock}</td>
                    </tr>
                    <tr>
                      <td><strong>Expiry Date</strong></td>
                      <td>:</td>
                      <td>
                        {product.expiryDate
                          ? new Date(product.expiryDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.productActions}>
                  <Link to={`/update-product/${product.id}`} className={styles.updateButton}>Update</Link>
                  <button className={styles.deleteButton} onClick={() => handleDeleteClick(product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showConfirmationModal}
          message="Are you sure you want to delete this product?"
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
        />

        {/* Notification Modal */}
        <NotificationModal
          show={showNotificationModal}
          message={notificationMessage}
          onClose={closeNotificationModal}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProductPageSeller;
