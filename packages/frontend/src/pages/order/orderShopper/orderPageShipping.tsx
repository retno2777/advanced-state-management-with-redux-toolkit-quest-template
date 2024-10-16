import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems, requestCancellationOrRefund } from '../../../features/order/shopper/ordersShopperSlice';
import { RootState } from '../../../app/store';
import Sidebar from '../../../components/sidebar/sidebar_shopper';
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar';
import ConfirmationModal from '../../../components/modal/modal_confirmation';
import Modal from '../../../components/modal/modal_notification';
import styles from './style/OrderPageShipping.module.css';
import Footer from '../../../components/navbar_footer/footer';

/**
 * This is the shipping orders page for the shopper.
 *
 * It fetches the shipping orders for the shopper from the API and renders them in a list.
 *
 * The page is accessible only if the user is logged in as a shopper.
 * If the user is not logged in, they will be redirected to the login page.
 *
 * The page is responsive and will adapt to different screen sizes.
 */
const OrderPageShipping = () => {
  const dispatch = useDispatch();

  // Get order data from Redux state
  const { orderItems, loading, error } = useSelector((state: RootState) => state.ordersShopper);

  // State for confirmation modal (cancellation)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // State for notification modal
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  /**
   * Component for showing shipping orders of shopper.
   * 
   * The component will fetch the order items from Redux state and render the shipping orders.
   * The component also handles cancellation of orders.
   * 
   * @returns The component for showing shipping orders.
  */
  useEffect(() => {
    dispatch(fetchOrderItems());
  }, [dispatch]);

  /**
   * Render shipping orders of shopper.
   * 
   * The function will map the shipping orders and render each order
   * in a card.
   * 
   * @returns JSX element for rendering shipping orders.
  */
  const shippingOrders = orderItems.filter(
    (order) =>
      (order.shippingStatus === 'Shipped' && order.paymentStatus === 'Paid') ||
      (order.shippingStatus === 'Pending' && order.paymentStatus === 'Paid')
  );

  /**
   * Function to handle cancellation of orders.
   * 
   * The function will show the confirmation modal when user clicks on the cancel button.
   * 
   * @param {number} orderId - The id of the order to be cancelled.
   *
   * */
  const handleCancel = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowConfirmationModal(true);
  };

  /**
   * Confirm cancellation of an order.
   * 
   * The function will show the confirmation modal when user clicks on the cancel button.
   * If the user confirms the cancellation, it will call the requestCancellationOrRefund thunk.
   * 
   * @returns {void}
   * */
  const confirmCancellation = async () => {
    if (selectedOrderId !== null) {
      // Call requestCancellationOrRefund with orderId
      const result = await dispatch(requestCancellationOrRefund({ orderId: selectedOrderId }));

      if (requestCancellationOrRefund.fulfilled.match(result)) {
        setNotificationMessage('Order cancelled successfully!');
      } else {
        setNotificationMessage(result.payload as string || 'Cancellation failed, please try again.');
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

        <h1>Shipping Orders</h1>

        {/* Show loading message while data is being fetched */}
        {loading && <p>Loading orders...</p>}

        {/* Show error message if there was an error */}
        {error && <p>Error: {error}</p>}

        {/* If there are no orders */}
        {orderItems.length === 0 && !loading && !error && (
          <p>Your order is empty.</p>
        )}

        {/* If there are no shipping orders */}
        {shippingOrders.length === 0 && orderItems.length > 0 && (
          <p>No orders currently being shipped.</p>
        )}

        {/* Show list of shipping orders if available */}
        {shippingOrders.length > 0 && (
          <div className={styles.orderList}>
            {shippingOrders.map((order) => (
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
                        <td><strong>Total Amount:</strong></td>
                        <td>:</td>
                        <td>${order.totalAmount}</td>
                      </tr>
                      <tr>
                        <td><strong>Order Date:</strong></td>
                        <td>:</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Shipping Status:</strong></td>
                        <td>:</td>
                        <td>{order.shippingStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.buttonGroup}>
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

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showConfirmationModal}
          message="Are you sure you want to cancel this order?"
          onConfirm={confirmCancellation}
          onClose={() => setShowConfirmationModal(false)}
        />

        {/* Notification Modal */}
        <Modal
          message={notificationMessage}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>

      <Footer /> {/* Footer added at the bottom */}
    </div>
  );
};

export default OrderPageShipping;
