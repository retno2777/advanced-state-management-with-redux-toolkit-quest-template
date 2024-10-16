import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems, confirmOrderReceipt } from '../../../features/order/shopper/ordersShopperSlice';
import { RootState } from '../../../app/store'; // 
import Sidebar from '../../../components/sidebar/sidebar_shopper';
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar';
import ConfirmationModal from '../../../components/modal/modal_confirmation';
import Modal from '../../../components/modal/modal_notification';
import styles from './style/OrderPageDelivered.module.css';
import Footer from '../../../components/navbar_footer/footer';

/**
 * This is the delivered orders page for the shopper.
 *
 * It fetches the delivered orders for the shopper from the API and renders them in a list.
 *
 * The page is accessible only if the user is logged in as a shopper.
 * If the user is not logged in, they will be redirected to the login page.
 *
 * The page is responsive and will adapt to different screen sizes.
 */
const DeliveredOrderPage = () => {
  const dispatch = useDispatch();

  // Get order data from Redux state
  const { orderItems, loading, error } = useSelector((state: RootState) => state.ordersShopper);

  // State for confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // State for notification modal
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Fetch orders when the page is first rendered
  useEffect(() => {
    dispatch(fetchOrderItems());
  }, [dispatch]);

  // Filter orders with "Delivered" shipping status
  const deliveredOrders = orderItems.filter(
    (order) => order.shippingStatus === 'Delivered'
  );

  /**
   * Handle confirm button click event.
   * 
   * This function is used when the user clicks on the "Confirm" button for an order.
   * It sets the selected order ID to the argument and shows the confirmation modal.
   * 
   * @param orderId The ID of the order to be confirmed.
   */
  const handleConfirm = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowConfirmationModal(true);
  };

  /**
   * Handle confirmation of an order.
   * 
   * This function is used to confirm an order when the user clicks on the "Confirm" button.
   * It calls the confirmOrderReceipt thunk to confirm the order and shows a notification
   * whether the confirmation is successful or not.
   */
  const confirmAction = async () => {
    if (selectedOrderId !== null) {
      // Call confirmOrderReceipt thunk to confirm the order
      const result = await dispatch(confirmOrderReceipt({ orderId: selectedOrderId }));
      if (confirmOrderReceipt.fulfilled.match(result)) {
        setNotificationMessage('Order confirmed successfully!');
      } else {
        setNotificationMessage(result.payload as string || 'Failed to confirm the order, please try again.');
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
      <Sidebar /> {/* Sidebar remains on the left */}
      <OrderNavbar /> {/* Navbar for all types of orders */}
      <div className={styles.mainContent}>

        <h1>Delivered Orders</h1>

        {/* Show loading message if data is being fetched */}
        {loading && <p>Loading orders...</p>}

        {/* Show error message if there's an error */}
        {error && <p>Error: {error}</p>}

        {/* Show message if order list is empty */}
        {orderItems.length === 0 && !loading && !error && (
          <p>Your order is empty.</p>
        )}

        {/* Show message if there are no delivered orders */}
        {deliveredOrders.length === 0 && orderItems.length > 0 && (
          <p>No delivered orders available.</p>
        )}

        {/* Display list of delivered orders if available */}
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
                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.confirmButton}
                      onClick={() => handleConfirm(order.id)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showConfirmationModal}
          message="Are you sure you want to confirm this order?"
          onConfirm={confirmAction}
          onClose={() => setShowConfirmationModal(false)}
        />

        {/* Notification Modal */}
        <Modal
          message={notificationMessage}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>

      <Footer /> {/* Add Footer at the bottom */}
    </div>
  );
};

export default DeliveredOrderPage;
