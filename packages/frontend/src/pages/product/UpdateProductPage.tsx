import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProduct, getProductById } from '../../features/product/productSlice';
import { RootState, AppDispatch } from '../../app/store';
import Modal from '../../components/modal/modal_notification';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from '../product/style/CreateProductPage.module.css';

/**
 * This page allows the seller to update a product.
 * The page will fetch the product data from the API and render it in a form.
 * The page is accessible only if the user is logged in as a seller.
 * If the user is not logged in, they will be redirected to the login page.
 * The page is responsive and will adapt to different screen sizes.
 */
const UpdateProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL params
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Fetch the selected product from Redux state
  const { loading, error, selectedProduct } = useSelector((state: RootState) => state.products);

  // Product state
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>('');

  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  // Fetch product details by ID when component is mounted
  useEffect(() => {
    if (id) {
      dispatch(getProductById(Number(id))); // Dispatch action to fetch product by ID
    }
  }, [dispatch, id]);

  /**
   * This useEffect is used to populate the form with the selected product data.
   * When the selected product changes, it will update the form state with the new product data.
   */
  useEffect(() => {
    if (selectedProduct?.product) {
      setProductName(selectedProduct.product.productName || '');
      setPrice(selectedProduct.product.price || 0);
      setStock(selectedProduct.product.stock || 0);
      setDescription(selectedProduct.product.description || '');

      // Extract only the date part for the expiry date field (YYYY-MM-DD)
      const formattedExpiryDate = selectedProduct.product.expiryDate
        ? new Date(selectedProduct.product.expiryDate).toISOString().split('T')[0]
        : '';
      setExpiryDate(formattedExpiryDate || '');
    }
  }, [selectedProduct]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    }
  };

  /**
   * Handles the form submission.
   * It will call the updateProduct thunk with the product data.
   * If the product is updated successfully, it will show a success message and navigate back to the seller product page.
   * If there is an error, it will show an error message.
   * @param e The event object.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare form data to send product data
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', String(price));
    formData.append('stock', String(stock));
    formData.append('description', description);
    formData.append('expiry_date', expiryDate);

    if (productImage) {
      formData.append('productImage', productImage); // Append image only if updated
    }

    try {
      const resultAction = await dispatch(updateProduct({ id: Number(id), formData }));
      if (updateProduct.fulfilled.match(resultAction)) {
        setModalMessage('Product updated successfully!');
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/product-seller'); // Navigate back to seller product page after update
        }, 3000);
      } else {
        setModalMessage(resultAction.payload as string || 'Failed to update product. Please try again.');
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
      }
    } catch {
      setModalMessage('An error occurred while updating the product.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <div className={styles.outerContainer}>
      <SidebarSeller /> {/* Sidebar remains on the left */}
      <div className={styles.container}>
        <h1>Update Product</h1>

        {loading ? (
          <p>Loading product details...</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="productImage">Product Image</label>
              <input
                type="file"
                id="productImage"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="expiry_date">Expiry Date</label>
              <input
                type="date"
                id="expiry_date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Notification Modal for update success/failure */}
        <Modal
          message={modalMessage}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default UpdateProductPage;
