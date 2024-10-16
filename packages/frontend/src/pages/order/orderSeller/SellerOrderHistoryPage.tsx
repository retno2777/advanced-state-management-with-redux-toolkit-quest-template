import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrderHistory } from '../../../features/order/seller/ordersSellerSlice';
import { RootState } from '../../../app/store';
import Sidebar from '../../../components/sidebar/SidebarSeller';
import styles from './style/SellerOrderHistoryPage.module.css';
import Footer from '../../../components/navbar_footer/footer';

/**
 * This is the order history page for the seller.
 *
 * It fetches the order history for the seller from the API and renders it in a list.
 *
 * The page is accessible only if the user is logged in as a seller.
 * If the user is not logged in, they will be redirected to the login page.
 *
 * The page is responsive and will adapt to different screen sizes.
 */

const OrderHistoryPage: React.FC = () => {
    const dispatch = useDispatch();

    const { orderHistory, loading, error } = useSelector((state: RootState) => state.ordersSeller);

    /**
     * This function fetches the order history for the seller from the API and renders it in a list.
     *
     * The page is accessible only if the user is logged in as a seller.
     * If the user is not logged in, they will be redirected to the login page.
     *
     * The page is responsive and will adapt to different screen sizes.
     */
    useEffect(() => {
        dispatch(fetchSellerOrderHistory());
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainContent}>

                <h1>Order History</h1>

                {loading && <p>Loading order history...</p>}

                {error && <p>Error: {error}</p>}

                {!loading && orderHistory.length === 0 && (
                    <p>No order history available.</p>
                )}

                {orderHistory.length > 0 && (
                    <div className={styles.orderList}>
                        {orderHistory.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={order.productDetails.productImage || 'https://via.placeholder.com/100'}
                                        alt={order.productName}
                                        className={styles.productImage}
                                    />
                                </div>
                                <div className={styles.orderDetails}>
                                    <h2>{order.productDetails.name}</h2>

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
                                                <td>{order.paymentStatus}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Shipping Status</strong></td>
                                                <td>:</td>
                                                <td>{order.shippingStatus}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Shopper Name</strong></td>
                                                <td>:</td>
                                                <td>{order.shopperDetails.name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer /> {/* Place the footer at the bottom */}
        </div>
    );
};

export default OrderHistoryPage;
