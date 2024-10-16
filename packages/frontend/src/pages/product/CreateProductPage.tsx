import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../features/product/productSlice';
import { RootState, AppDispatch } from '../../app/store'; // Import store dan AppDispatch yang benar
import Modal from '../../components/modal/modal_notification';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from '../product/style/CreateProductPage.module.css'; // Import CSS Module

const CreateProductPage: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [expiry_date, setExpiry_date] = useState<string>(''); // Mengganti ke expiry_date

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.products);

  // Fungsi untuk menangani perubahan file gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    }
  };

  // Fungsi untuk menangani form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Membuat objek FormData untuk mengirimkan data produk
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', String(price)); // Konversi ke string
    formData.append('stock', String(stock)); // Konversi ke string
    formData.append('description', description);
    formData.append('expiry_date', expiry_date);
    
    // Jika ada gambar, tambahkan ke FormData
    if (productImage) {
      formData.append('productImage', productImage);
    }

    try {
      const resultAction = await dispatch(createProduct(formData)); // Kirim FormData
      if (createProduct.fulfilled.match(resultAction)) {
        setModalMessage('Product created successfully!'); // Pesan untuk pembuatan produk
        setShowModal(true); // Tampilkan modal
        setTimeout(() => {
          setShowModal(false); // Sembunyikan modal setelah 3 detik
        }, 3000);

        // Reset form
        setProductName('');
        setPrice(0);
        setStock(0);
        setDescription('');
        setProductImage(null);
        setExpiry_date('');
      } else if (createProduct.rejected.match(resultAction)) {
        setModalMessage('Failed to create product. Please try again.');
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
      }
    } catch (err) {
      setModalMessage('An error occurred while creating the product.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  return (
    <div className={styles.outerContainer}>
      <SidebarSeller />
      <div className={styles.container}>
        <h1>Create New Product</h1>
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
              value={expiry_date}
              onChange={(e) => setExpiry_date(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Modal untuk pemberitahuan berhasil membuat produk */}
        <Modal
          message={modalMessage}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default CreateProductPage;
