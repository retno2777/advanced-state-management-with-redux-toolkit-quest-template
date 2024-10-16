// Import necessary hooks and actions from Redux and React
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsByShopper } from '../features/product/productSlice';
import { addItemToCart, checkoutSelectedItems } from '../features/cart/cartSlice'; // Import action untuk menambah produk ke keranjang dan checkout
import { RootState } from '../app/store';
import Sidebar from '../components/sidebar/sidebar_shopper';
import ConfirmationModal from '../components/modal/modal_confirmation'; // Import modal konfirmasi
import Modal from '../components/modal/modal_notification'; // Import modal notifikasi
import styles from '../pages/styles/HomeShopper.module.css';

const Home = () => {
  const dispatch = useDispatch();

  // Ambil data produk dari state Redux
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  // State untuk kontrol modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Panggil thunk untuk memuat produk ketika halaman pertama kali di-render
  useEffect(() => {
    dispatch(getProductsByShopper());
  }, [dispatch]);

  // Fungsi untuk menambah produk ke keranjang
  const handleAddToCart = (productId: number) => {
    const quantity = 1; // Kita tambahkan 1 produk per klik
    dispatch(addItemToCart({ productId, quantity }));
  };

  // Fungsi untuk meng-handle pembelian (checkout langsung)
  const handleBuy = (productId: number, quantity: number = 1) => {
    setSelectedProductId(productId); // Simpan produk yang dipilih untuk checkout
    console.log(`Selected product ID: ${productId}, quantity: ${quantity}`);
    setShowModal(true); // Tampilkan modal konfirmasi
  };

  // Fungsi untuk memproses checkout setelah konfirmasi
  const handleCheckout = async () => {
    if (selectedProductId !== null) {
      const result = await dispatch(
        checkoutSelectedItems({
          productIds: [], // Kosong karena ini bukan dari keranjang
          singleProductId: selectedProductId,
          singleProductQuantity: 1, // Jumlah default saat checkout langsung
        })
      );

      if (checkoutSelectedItems.fulfilled.match(result)) {
        setNotificationMessage('Checkout successful!');
      } else {
        setNotificationMessage('Checkout failed. Please try again.');
      }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000); // Tampilkan notifikasi selama 2 detik
    }

    setShowModal(false); // Sembunyikan modal konfirmasi setelah proses
  };

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar tetap di samping kiri */}
      <div className={styles.mainContent}>
        <h1>Products</h1>

        {/* Tampilkan pesan loading jika data sedang dimuat */}
        {loading && <p>Loading products...</p>}

        {/* Tampilkan pesan error jika terjadi kesalahan */}
        {error && <p>Error: {error}</p>}

        {/* Jika produk sudah tersedia, tampilkan di grid */}
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.productImage || 'https://via.placeholder.com/150'}
                alt={product.productName}
                className={styles.productImage}
              />
              <h2>{product.productName}</h2>
              <p>${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>{product.description}</p>
              <div className={styles.buttonContainer}>
                {/* Tambahkan event handler untuk Add to Cart */}
                <button
                  className={styles.addToCartButton}
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
                <button
                  className={styles.BuyButton}
                  onClick={() => handleBuy(product.id)} // Panggil handleBuy ketika tombol Buy diklik
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Konfirmasi */}
      <ConfirmationModal
        show={showModal}
        message="Are you sure you want to buy this product?"
        onConfirm={handleCheckout} // Konfirmasi checkout
        onClose={() => setShowModal(false)} // Tutup modal tanpa membeli
      />

      {/* Modal Notifikasi */}
      <Modal
        message={notificationMessage}
        show={showNotification}
        onClose={() => setShowNotification(false)} // Tutup notifikasi secara manual jika diperlukan
      />
    </div>
  );
};

export default Home;
