import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Untuk mengambil id dari URL dan melakukan navigasi
import { updateProduct, getProductById } from '../../features/product/productSlice'; // Import thunk updateProduct dan getProductById
import { RootState, AppDispatch } from '../../app/store'; // Import RootState dan AppDispatch yang benar
import Modal from '../../components/modal/modal_notification';
import SidebarSeller from '../../components/sidebar/SidebarSeller';
import styles from '../product/style/CreateProductPage.module.css'; // Import CSS Module

const UpdateProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Mengambil id produk dari URL
    const navigate = useNavigate(); // Untuk navigasi setelah update
    const dispatch = useDispatch<AppDispatch>();

    const { loading, error, selectedProduct } = useSelector((state: RootState) => state.products);

    // State untuk input produk
    const [productName, setProductName] = useState<string>(''); // Default empty string
    const [price, setPrice] = useState<number>(0); // Default number 0
    const [stock, setStock] = useState<number>(0); // Default number 0
    const [description, setDescription] = useState<string>(''); // Default empty string
    const [productImage, setProductImage] = useState<File | null>(null);
    const [expiry_date, setExpiry_date] = useState<string>(''); // Default empty string

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    // Ambil detail produk berdasarkan id ketika komponen pertama kali dimuat
    useEffect(() => {
        if (id) {
            dispatch(getProductById(Number(id))); // Panggil thunk getProductById dengan id produk
        }
    }, [dispatch, id]);

    // Jika produk berhasil di-load, isi state dengan data produk yang ada
    useEffect(() => {
        if (selectedProduct && selectedProduct.product) {
          setProductName(selectedProduct.product.productName || ''); // Pastikan default adalah string kosong
          setPrice(selectedProduct.product.price || 0); // Pastikan default adalah 0
          setStock(selectedProduct.product.stock || 0); // Pastikan default adalah 0
          setDescription(selectedProduct.product.description || ''); // Pastikan default adalah string kosong
          setExpiry_date(selectedProduct.product.expiryDate || ''); // Pastikan default adalah string kosong
        }
      }, [selectedProduct]);
      
    // Fungsi untuk menangani perubahan file gambar
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProductImage(e.target.files[0]);
        }
    };

    // Fungsi untuk menangani form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(); // Gunakan FormData untuk pengiriman gambar dan data
        formData.append("productName", productName);
        formData.append("price", String(price));
        formData.append("stock", String(stock));
        formData.append("description", description);
        formData.append("expiry_date", expiry_date);
        if (productImage) {
          formData.append("productImage", productImage); // Tambahkan productImage jika ada
        }

        try {
            const resultAction = await dispatch(updateProduct({ id: Number(id), formData }));
            if (updateProduct.fulfilled.match(resultAction)) {
                setModalMessage('Product updated successfully!');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/product-seller'); // Redirect ke halaman seller setelah update berhasil
                }, 3000);
            } else if (updateProduct.rejected.match(resultAction)) {
                setModalMessage('Failed to update product. Please try again.');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 3000);
            }
        } catch (err) {
            setModalMessage('An error occurred while updating the product.');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
        }
    };

    return (
        <div className={styles.outerContainer}>
            <SidebarSeller />
            <div className={styles.container}>
                <h1>Update Product</h1>

                {loading ? (
                    <p>Loading product details...</p> // Tampilkan pesan loading saat data produk sedang diambil
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
                                value={expiry_date}
                                onChange={(e) => setExpiry_date(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </form>
                )}

                {error && <p className={styles.errorMessage}>{error}</p>}

                {/* Modal untuk pemberitahuan berhasil memperbarui produk */}
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
