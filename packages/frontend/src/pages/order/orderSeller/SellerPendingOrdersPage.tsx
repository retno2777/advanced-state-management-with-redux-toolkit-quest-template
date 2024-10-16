import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders } from '../../../features/order/seller/ordersSellerSlice'; 
import { RootState } from '../../../app/store'; 
import Sidebar from '../../../components/sidebar/SidebarSeller'; 
import OrderSellerNavbar from '../../../components/navbar_footer/OrderSellerNavbar'; 
import styles from './style/SellerPendingOrdersPage.module.css'; 
import Footer from '../../../components/navbar_footer/footer';


/**
 * The SellerPendingOrdersPage component displays a list of pending orders
 * for the seller to manage.
 * 
 * The component fetches the list of orders from the Redux state and
 * filters out only the pending orders. It then displays the list of
 * pending orders in a table.
 * 
 * @returns The component rendering the list of pending orders.
 */
const SellerPendingOrdersPage = () => {
  const dispatch = useDispatch();

  // Get seller orders from the Redux state
  const { sellerOrders, loading, error } = useSelector((state: RootState) => state.ordersSeller);

  // Fetch only the pending orders
  const pendingOrders = sellerOrders.filter(
    (order) => order.orderItem.paymentStatus === 'Pending'
  );

  useEffect(() => {
    dispatch(fetchSellerOrders()); // Fetch all seller orders
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar for seller */}
      <OrderSellerNavbar /> {/* Navbar for seller's orders */}
      <div className={styles.mainContent}>
      
        <h1>Pending Orders</h1>

        {/* Show loading message if data is being loaded */}
        {loading && <p>Loading orders...</p>}

        {/* Show error message if there's an error */}
        {error && <p>Error: {error}</p>}

        {/* If there are no pending orders */}
        {!loading && pendingOrders.length === 0 && (
          <p>No pending orders available.</p>
        )}

        {/* Display list of pending orders if available */}
        {pendingOrders.length > 0 && (
          <div className={styles.orderList}>
            {pendingOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={order.orderItem.product?.productImage || 'https://via.placeholder.com/100'}
                    alt={order.orderItem.product?.productName || 'Product Name'}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.orderDetails}>
                  <h2>{order.orderItem.product?.productName}</h2>
                  {/* 3-column table for order details */}
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
                        <td><strong>Payment Status</strong></td>
                        <td>:</td>
                        <td>{order.orderItem.paymentStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer /> {/* Add the Footer at the bottom */}
    </div>
  );
};

export default SellerPendingOrdersPage;
