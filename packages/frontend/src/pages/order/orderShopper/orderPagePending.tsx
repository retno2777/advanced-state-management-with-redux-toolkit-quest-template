import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems, simulatePayment, requestCancellationOrRefund } from '../../../features/order/shopper/ordersShopperSlice'; // Import thunks
import { RootState } from '../../../app/store'; // Import tipe RootState
import Sidebar from '../../../components/sidebar/sidebar_shopper'; // Import komponen Sidebar
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar'; // Import OrderNavbar
import ConfirmationModal from '../../../components/modal/modal_confirmation'; // Import ConfirmationModal
import Modal from '../../../components/modal/modal_notification'; // Import Modal notifikasi
import styles from './style/OrderPagePending.module.css'; // Import CSS module

const OrderPagePending = () => {
  const dispatch = useDispatch();

  // Ambil data pesanan dari state Redux
  const { orderItems, loading, error } = useSelector((state: RootState) => state.ordersShopper);

  // State untuk modal konfirmasi (pembayaran dan pembatalan)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'PAY' | 'CANCEL' | null>(null); // Tambahkan actionType untuk membedakan antara Pay dan Cancel

  // State untuk modal notifikasi
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Panggil thunk untuk memuat pesanan ketika halaman pertama kali di-render
  useEffect(() => {
    dispatch(fetchOrderItems());
  }, [dispatch]);

  // Filter pesanan yang status pembayarannya "Pending"
  const pendingOrders = orderItems.filter(
    (order) => order.paymentStatus === 'Pending' && order.shippingStatus !== 'Cancelled'
  );

  // Fungsi untuk menangani pembayaran
  const handlePayNow = (orderId: number) => {
    setSelectedOrderId(orderId); // Simpan orderId yang dipilih
    setActionType('PAY'); // Set actionType menjadi 'PAY'
    setShowConfirmationModal(true); // Tampilkan modal konfirmasi
  };

  // Fungsi untuk menangani pembatalan
  const handleCancel = (orderId: number) => {
    setSelectedOrderId(orderId); // Simpan orderId yang dipilih
    setActionType('CANCEL'); // Set actionType menjadi 'CANCEL'
    setShowConfirmationModal(true); // Tampilkan modal konfirmasi
  };

  // Fungsi untuk mengonfirmasi tindakan (pembayaran atau pembatalan)
  const confirmAction = async () => {
    if (selectedOrderId !== null) {
      if (actionType === 'PAY') {
        // Proses pembayaran
        const result = await dispatch(simulatePayment({ orderId: selectedOrderId }));
        if (simulatePayment.fulfilled.match(result)) {
          setNotificationMessage('Payment successful!');
        } else {
          setNotificationMessage('Payment failed, please try again.');
        }
      } else if (actionType === 'CANCEL') {
        // Proses pembatalan
        const result = await dispatch(requestCancellationOrRefund({ orderId: selectedOrderId }));
        if (requestCancellationOrRefund.fulfilled.match(result)) {
          setNotificationMessage('Order cancelled successfully!');
        } else {
          setNotificationMessage('Cancellation failed, please try again.');
        }
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

        <h1>Pending Orders</h1>

        {/* Tampilkan pesan loading jika data sedang dimuat */}
        {loading && <p>Loading orders...</p>}

        {/* Tampilkan pesan error jika terjadi kesalahan */}
        {error && <p>Error: {error}</p>}

        {/* Jika semua data pesanan kosong */}
        {orderItems.length === 0 && !loading && !error && (
          <p>Your order is empty.</p>
        )}

        {/* Jika tidak ada pesanan yang pending */}
        {pendingOrders.length === 0 && orderItems.length > 0 && (
          <p>No pending orders available.</p>
        )}

        {/* Tampilkan daftar pesanan yang pending jika ada */}
        {pendingOrders.length > 0 && (
          <div className={styles.orderList}>
            {pendingOrders.map((order) => (
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
                    className={styles.payButton}
                    onClick={() => handlePayNow(order.id)}
                  >
                    Pay Now
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Konfirmasi */}
        <ConfirmationModal
          show={showConfirmationModal}
          message={actionType === 'PAY' ? 'Are you sure you want to pay for this order?' : 'Are you sure you want to cancel this order?'}
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

export default OrderPagePending;
