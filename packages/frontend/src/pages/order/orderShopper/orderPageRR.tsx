import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems } from '../../../features/order/shopper/ordersShopperSlice';
import { RootState } from '../../../app/store';
import Sidebar from '../../../components/sidebar/sidebar_shopper';
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar';
import styles from './style/OrderRequestRefund.module.css';
import Footer from '../../../components/navbar_footer/footer';

/**
 * Page for displaying orders with "Refund Requested" shipping status
 * 
 * This page shows all orders with "Refund Requested" shipping status. 
 * The shopper can view the orders and request refund for the orders.
 */
const RefundRequestPage = () => {
    const dispatch = useDispatch();

    // Get order data from Redux state
    const { orderItems, loading, error } = useSelector((state: RootState) => state.ordersShopper);

    // Fetch orders when the page is first rendered
    useEffect(() => {
        dispatch(fetchOrderItems());
    }, [dispatch]);

    // Filter orders with "Refund Requested" shipping status
    const refundRequestedOrders = orderItems.filter(
        (order) => order.shippingStatus === 'Refund Requested'
    );

    return (
        <div className={styles.container}>
            <Sidebar /> {/* Sidebar remains on the left */}
            <OrderNavbar /> {/* Navbar for all order types */}
            <div className={styles.mainContent}>
                <h1>Refund Requested Orders</h1>

                {/* Show loading message if data is being fetched */}
                {loading && <p>Loading orders...</p>}

                {/* Show error message if there's an error */}
                {error && <p>Error: {error}</p>}

                {/* Show message if order list is empty */}
                {orderItems.length === 0 && !loading && !error && (
                    <p>Your order list is empty.</p>
                )}

                {/* Show message if there are no refund requests */}
                {refundRequestedOrders.length === 0 && orderItems.length > 0 && (
                    <p>No refund requests available.</p>
                )}

                {/* Display list of refund requested orders if available */}
                {refundRequestedOrders.length > 0 && (
                    <div className={styles.orderList}>
                        {refundRequestedOrders.map((order) => (
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer /> {/* Add Footer at the bottom */}
        </div>
    );
};

export default RefundRequestPage;
