import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems, simulatePayment, requestCancellationOrRefund } from '../../../features/order/shopper/ordersShopperSlice';
import { RootState } from '../../../app/store';
import Sidebar from '../../../components/sidebar/sidebar_shopper';
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar';
import ConfirmationModal from '../../../components/modal/modal_confirmation';
import Modal from '../../../components/modal/modal_notification';
import styles from './style/OrderPagePending.module.css';
import Footer from '../../../components/navbar_footer/footer';

/**
 * The OrderPagePending component displays a list of pending orders
 * for the shopper to manage.
 *
 * The component fetches the list of orders from the Redux state and
 * filters out only the pending orders. It then displays the list of
 * pending orders in a table.
 *
 * The page is accessible only if the user is logged in as a shopper.
 * If the user is not logged in, they will be redirected to the login page.
 *
 * The page is responsive and will adapt to different screen sizes.
 */
const OrderPagePending = () => {
  const dispatch = useDispatch();

  const { orderItems, loading, error } = useSelector((state: RootState) => state.ordersShopper);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'PAY' | 'CANCEL' | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    dispatch(fetchOrderItems());
  }, [dispatch]);

  const pendingOrders = orderItems.filter(
    (order) => order.paymentStatus === 'Pending' && order.shippingStatus !== 'Cancelled'
  );

  const handlePayNow = (orderId: number) => {
    setSelectedOrderId(orderId);
    setActionType('PAY');
    setShowConfirmationModal(true);
  };

  const handleCancel = (orderId: number) => {
    setSelectedOrderId(orderId);
    setActionType('CANCEL');
    setShowConfirmationModal(true);
  };

  const confirmAction = async () => {
    if (selectedOrderId !== null) {
      if (actionType === 'PAY') {
        const result = await dispatch(simulatePayment({ orderId: selectedOrderId }));
        if (simulatePayment.fulfilled.match(result)) {
          setNotificationMessage('Payment successful!');
        } else {
          setNotificationMessage(result.payload as string || 'Payment failed, please try again.');
        }
      } else if (actionType === 'CANCEL') {
        const result = await dispatch(requestCancellationOrRefund({ orderId: selectedOrderId }));
        if (requestCancellationOrRefund.fulfilled.match(result)) {
          setNotificationMessage('Order cancelled successfully!');
        } else {
          setNotificationMessage(result.payload as string || 'Cancellation failed, please try again.');
        }
      }
      setShowConfirmationModal(false);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        dispatch(fetchOrderItems());
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <OrderNavbar />
      <div className={styles.mainContent}>

        <h1>Pending Orders</h1>

        {loading && <p>Loading orders...</p>}
        {error && <p className={styles.errorMessage}>Error: {error}</p>}

        {orderItems.length === 0 && !loading && !error && (
          <p>Your order list is empty.</p>
        )}

        {pendingOrders.length === 0 && orderItems.length > 0 && (
          <p>No pending orders available.</p>
        )}

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
                  <table className={styles.orderTable}>
                    <tbody>
                      <tr>
                        <td><strong>Total Amount</strong></td>
                        <td>:</td>
                        <td>${order.totalAmount}</td>
                      </tr>
                      <tr>
                        <td><strong>Order Date</strong></td>
                        <td>:</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Shipping Status</strong></td>
                        <td>:</td>
                        <td>{order.shippingStatus}</td>
                      </tr>
                    </tbody>
                  </table>
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

        <ConfirmationModal
          show={showConfirmationModal}
          message={actionType === 'PAY' ? 'Are you sure you want to pay for this order?' : 'Are you sure you want to cancel this order?'}
          onConfirm={confirmAction}
          onClose={() => setShowConfirmationModal(false)}
        />

        <Modal
          message={notificationMessage}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>

      <Footer />
    </div>
  );
};

export default OrderPagePending;
