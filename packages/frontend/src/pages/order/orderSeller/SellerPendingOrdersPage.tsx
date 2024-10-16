import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders } from '../../../features/order/seller/ordersSellerSlice'; // Thunk for fetching seller's orders
import { RootState } from '../../../app/store'; // Import RootState
import Sidebar from '../../../components/sidebar/SidebarSeller'; // Sidebar for seller
import OrderSellerNavbar from '../../../components/navbar_footer/OrderSellerNavbar'; // Import the new seller navbar
import styles from './style/SellerPendingOrdersPage.module.css'; // CSS module for page styling

const SellerPendingOrdersPage = () => {
  const dispatch = useDispatch();

  // Get seller orders from the Redux state
  const { sellerOrders, loading, error } = useSelector((state: RootState) => state.ordersSeller);

  // Fetch seller orders when the page loads
  useEffect(() => {
    dispatch(fetchSellerOrders()); // Fetch all seller orders
  }, [dispatch]);

  // Filter orders that are pending
  const pendingOrders = sellerOrders.filter(
    (order) => order.orderItem.paymentStatus === 'Pending'
  );

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar for seller */}
      <div className={styles.mainContent}>
        <OrderSellerNavbar /> {/* Navbar for seller's orders */}

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
                  <p>Total Amount: ${order.totalAmount}</p>
                  <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>Payment Status: {order.orderItem.paymentStatus}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPendingOrdersPage;
