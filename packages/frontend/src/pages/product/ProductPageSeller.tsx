import React, { useState, useEffect } from 'react';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from '../product/style/ProductPageSeller.module.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getProducts, deleteProduct } from '../../features/product/productSlice';
import ConfirmationModal from '../../components/modal/modal_confirmation';
import NotificationModal from '../../components/modal/modal_notification';

const ProductPageSeller = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector((state: RootState) => state.products);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDeleteClick = (productId: number) => {
    setSelectedProductId(productId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId !== null) {
      const resultAction = await dispatch(deleteProduct(selectedProductId));
      if (deleteProduct.fulfilled.match(resultAction)) {
        setNotificationMessage('Product deleted successfully!');
        setShowNotificationModal(true);
      } else {
        setNotificationMessage('Failed to delete product.');
        setShowNotificationModal(true);
      }

      // Tutup modal notifikasi secara otomatis setelah 3 detik
      setTimeout(() => {
        setShowNotificationModal(false);
      }, 3000); // 3000ms = 3 detik
    }
    setShowConfirmationModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
  };

  return (
    <div className={styles.container}>
      <SidebarSeller />
      <div className={styles.mainContent}>
        <h1>Product Management</h1>
        <Link to="/create-product" className={styles.createButton}>Create New Product</Link>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className={styles.productList}>
            {products.map(product => (
              <div key={product.id} className={styles.productCard}>
                <img src={product.productImage || 'https://via.placeholder.com/150'} alt={product.productName} className={styles.productImage} />
                <h3>{product.productName}</h3>
                <p>{product.description}</p>
                <p><strong>${product.price}</strong></p>
                {product.expiryDate ? (
                  <p><strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
                ) : (
                  <p><strong>Expiry Date:</strong> ""</p>
                )}
                <div className={styles.productActions}>
                  <Link to={`/update-product/${product.id}`} className={styles.updateButton}>Update</Link>
                  <button className={styles.deleteButton} onClick={() => handleDeleteClick(product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Konfirmasi */}
        <ConfirmationModal
          show={showConfirmationModal}
          message="Are you sure you want to delete this product?"
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
        />

        {/* Modal Notifikasi */}
        <NotificationModal
          show={showNotificationModal}
          message={notificationMessage}
          onClose={closeNotificationModal} // Tetap tambahkan close manual jika pengguna ingin menutup lebih awal
        />
      </div>
    </div>
  );
};

export default ProductPageSeller;
