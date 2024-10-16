import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../features/product/productSlice';
import { RootState, AppDispatch } from '../../app/store';
import Modal from '../../components/modal/modal_notification';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from '../product/style/CreateProductPage.module.css';

/**
 * CreateProductPage
 * This page is used to create a new product.
 * It contains a form with input fields for product name, price, stock, description, and product image.
 * After submitting the form, it will call the createProduct thunk to create a new product in the database.
 * If the product is created successfully, it will show a success message and reset the form.
 * If there is an error, it will show an error message.
 */
const CreateProductPage: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [expiry_date, setExpiry_date] = useState<string>('');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.products);

  // Show error modal when there's an error in Redux state
  useEffect(() => {
    if (error) {
      setModalTitle('Error');
      setModalMessage(error);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000); // Hide modal after 3 seconds
    }
  }, [error]);

  /**
   * Handle image change event.
   * When the user selects a new image, this function will be called.
   * It will update the productImage state with the new image.
   * @param e The event object.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    }
  };

  /**
   * Handle form submit event.
   * When the user submits the form, this function will be called.
   * It will call the createProduct thunk with the product data.
   * If the product is created successfully, it will show a success message and reset the form.
   * If there is an error, it will show an error message.
   * @param e The event object.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare FormData to send product data
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', String(price));
    formData.append('stock', String(stock));
    formData.append('description', description);
    formData.append('expiry_date', expiry_date);

    // Add image to FormData if available
    if (productImage) {
      formData.append('productImage', productImage);
    }

    try {
      const resultAction = await dispatch(createProduct(formData));
      if (createProduct.fulfilled.match(resultAction)) {
        setModalTitle('Success');
        setModalMessage('Product created successfully!');
        setShowModal(true); // Show notification modal
        setTimeout(() => {
          setShowModal(false);
        }, 3000);

        // Reset form after submission
        setProductName('');
        setPrice(0);
        setStock(0);
        setDescription('');
        setProductImage(null);
        setExpiry_date('');
      } else {
        setModalTitle('Error');
        setModalMessage(resultAction.payload as string || 'Failed to create product. Please try again.');
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
      }
    } catch {
      setModalTitle('Error');
      setModalMessage('An error occurred while creating the product.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <div className={styles.outerContainer}>
      <SidebarSeller /> {/* Sidebar remains on the left */}
      <div className={styles.container}>
        <h1>Create New Product</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="productImage">Product Image</label>
            <input
              type="file"
              id="productImage"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <div>
            <label htmlFor="expiry_date">Expiry Date</label>
            <input
              type="date"
              id="expiry_date"
              value={expiry_date}
              onChange={(e) => setExpiry_date(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>

        {/* Modal for error notification */}
        {showModal && (
          <Modal
            title={modalTitle}
            message={modalMessage}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProductPage;
