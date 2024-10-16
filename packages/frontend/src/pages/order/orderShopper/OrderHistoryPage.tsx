import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderHistory } from '../../../features/order/shopper/ordersShopperSlice'; 
import { RootState } from '../../../app/store'; 
import Sidebar from '../../../components/sidebar/sidebar_shopper'; 
import styles from './style/OrderHistoryPage.module.css';
import Footer from '../../../components/navbar_footer/footer'; 

/**
 * The OrderHistoryPage component displays a list of order history
 * for the shopper to view.
 * 
 * The component fetches the list of orders from the Redux state and
 * filters out only the order history. It then displays the list of
 * order history in a table.
 * 
 * @returns The component rendering the list of order history.
 */
const OrderHistoryPage = () => {
  const dispatch = useDispatch();

  // Get order history data from Redux state
  const { orderHistory, loading, error } = useSelector((state: RootState) => state.ordersShopper);

  // Call thunk to load order history when the page first renders
  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar remains on the left */}
      <div className={styles.mainContent}>
        <h1>Order History</h1>

        {/* Show loading message if data is being fetched */}
        {loading && <p>Loading order history...</p>}
        {/* Show error message if there is an error */}
        {error && <p>Error: {error}</p>}
        {/* Show message if order history is empty */}
        {orderHistory.length === 0 && !loading && !error && (
          <p>No order history available.</p>
        )}

        {/* Display list of order history if available */}
        {orderHistory.length > 0 && (
          <div className={styles.orderList}>
            {orderHistory.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.imageWrapper}>
                  {/* Display product image or a placeholder if none is available */}
                  <img
                    src={order.product.productImage || 'https://via.placeholder.com/50'}
                    alt={order.product.productName}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.orderDetails}>
                  <h2>{order.product.productName}</h2>
                  {/* Display order details in a table */}
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
                      <tr>
                        <td><strong>Payment Status</strong></td>
                        <td>:</td>
                        <td>{order.paymentStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer /> {/* Add Footer at the bottom */}
    </div>
  );
};

export default OrderHistoryPage;
