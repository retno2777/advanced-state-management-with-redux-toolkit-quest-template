import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems, confirmOrderReceipt } from '../../../features/order/shopper/ordersShopperSlice'; // Import confirmOrderReceipt
import { RootState } from '../../../app/store'; // Import tipe RootState
import Sidebar from '../../../components/sidebar/sidebar_shopper'; // Import komponen Sidebar
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar'; // Import OrderNavbar
import ConfirmationModal from '../../../components/modal/modal_confirmation'; // Import ConfirmationModal
import Modal from '../../../components/modal/modal_notification'; // Import Modal notifikasi
import styles from './style/OrderPageDelivered.module.css'; // Import CSS module

const DeliveredOrderPage = () => {
  const dispatch = useDispatch();

  // Ambil data pesanan dari state Redux
  const { orderItems, loading, error } = useSelector((state: RootState) => state.ordersShopper);

  // State untuk modal konfirmasi
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // State untuk modal notifikasi
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Panggil thunk untuk memuat pesanan ketika halaman pertama kali di-render
  useEffect(() => {
    dispatch(fetchOrderItems());
  }, [dispatch]);

  // Filter pesanan yang status pengirimannya "Delivered"
  const deliveredOrders = orderItems.filter(
    (order) => order.shippingStatus === 'Delivered'
  );

  // Fungsi untuk menangani konfirmasi pesanan
  const handleConfirm = (orderId: number) => {
    setSelectedOrderId(orderId); // Simpan orderId yang dipilih
    setShowConfirmationModal(true); // Tampilkan modal konfirmasi
  };

  // Fungsi untuk mengonfirmasi tindakan
  const confirmAction = async () => {
    if (selectedOrderId !== null) {
      // Panggil confirmOrderReceipt thunk untuk mengonfirmasi pesanan
      const result = await dispatch(confirmOrderReceipt({ orderId: selectedOrderId }));
      if (confirmOrderReceipt.fulfilled.match(result)) {
        setNotificationMessage('Order confirmed successfully!');
      } else {
        setNotificationMessage('Failed to confirm the order, please try again.');
      }

      setShowConfirmationModal(false); // Tutup modal konfirmasi
      setShowNotification(true); // Tampilkan modal notifikasi

      setTimeout(() => {
        setShowNotification(false); // Sembunyikan notifikasi setelah 2 detik
        dispatch(fetchOrderItems()); // Refresh data pesanan setelah tindakan
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar tetap di samping kiri */}
      <div className={styles.mainContent}>
        <OrderNavbar /> {/* Navbar untuk semua jenis pesanan */}

        <h1>Delivered Orders</h1>

        {/* Tampilkan pesan loading jika data sedang dimuat */}
        {loading && <p>Loading orders...</p>}

        {/* Tampilkan pesan error jika terjadi kesalahan */}
        {error && <p>Error: {error}</p>}

        {/* Jika semua data pesanan kosong */}
        {orderItems.length === 0 && !loading && !error && (
          <p>Your order is empty.</p>
        )}

        {/* Jika tidak ada pesanan yang delivered */}
        {deliveredOrders.length === 0 && orderItems.length > 0 && (
          <p>No delivered orders available.</p>
        )}

        {/* Tampilkan daftar pesanan yang delivered jika ada */}
        {deliveredOrders.length > 0 && (
          <div className={styles.orderList}>
            {deliveredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={order.product.productImage || 'https://via.placeholder.com/50'}
                    alt={order.product.productName}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.orderDetails}>
                  <h2>{order.product.productName}</h2>
                  <p>Total Amount: ${order.totalAmount}</p>
                  <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>Shipping Status: {order.shippingStatus}</p>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.confirmButton}
                    onClick={() => handleConfirm(order.id)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Konfirmasi */}
        <ConfirmationModal
          show={showConfirmationModal}
          message="Are you sure you want to confirm this order?"
          onConfirm={confirmAction} // Lanjutkan tindakan jika pengguna mengonfirmasi
          onClose={() => setShowConfirmationModal(false)} // Tutup modal konfirmasi
        />

        {/* Modal Notifikasi */}
        <Modal
          message={notificationMessage}
          show={showNotification}
          onClose={() => setShowNotification(false)} // Tutup notifikasi jika diperlukan
        />
      </div>
    </div>
  );
};

export default DeliveredOrderPage;
