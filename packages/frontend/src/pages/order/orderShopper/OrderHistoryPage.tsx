import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderHistory } from '../../../features/order/shopper/ordersShopperSlice'; // Import thunk untuk mengambil riwayat pesanan
import { RootState } from '../../../app/store'; // Import tipe RootState
import Sidebar from '../../../components/sidebar/sidebar_shopper'; // Import komponen Sidebar
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar'; // Import OrderNavbar
import styles from './style/OrderHistoryPage.module.css'; // Import CSS module

const OrderHistoryPage = () => {
  const dispatch = useDispatch();

  // Ambil data riwayat pesanan dari state Redux
  const { orderHistory, loading, error } = useSelector((state: RootState) => state.ordersShopper);

  // Panggil thunk untuk memuat riwayat pesanan ketika halaman pertama kali di-render
  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar tetap di samping kiri */}
      <div className={styles.mainContent}>
        <OrderNavbar /> {/* Navbar untuk semua jenis pesanan */}

        <h1>Order History</h1>

        {/* Tampilkan pesan loading jika data sedang dimuat */}
        {loading && <p>Loading order history...</p>}

        {/* Tampilkan pesan error jika terjadi kesalahan */}
        {error && <p>Error: {error}</p>}

        {/* Jika semua data riwayat pesanan kosong */}
        {orderHistory.length === 0 && !loading && !error && (
          <p>No order history available.</p>
        )}

        {/* Tampilkan daftar riwayat pesanan jika ada */}
        {orderHistory.length > 0 && (
          <div className={styles.orderList}>
            {orderHistory.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={order.product.productImage || 'https://via.placeholder.com/50'}
                    alt={order.productName}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.orderDetails}>
                  <h2>{order.productName}</h2>
                  <p>Total Amount: ${order.totalAmount}</p>
                  <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>Shipping Status: {order.shippingStatus}</p>
                  <p>Payment Status: {order.paymentStatus}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
