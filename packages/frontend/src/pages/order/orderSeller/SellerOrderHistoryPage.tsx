import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrderHistory } from '../../../features/order/seller/ordersSellerSlice'; // Import action untuk fetch order history
import { RootState } from '../../../app/store'; // Import RootState
import Sidebar from '../../../components/sidebar/SidebarSeller'; // Sidebar untuk seller
import OrderSellerNavbar from '../../../components/navbar_footer/OrderSellerNavbar'; // Navbar untuk seller
import styles from './style/SellerOrderHistoryPage.module.css'; // Import CSS module untuk styling halaman

const OrderHistoryPage: React.FC = () => {
    const dispatch = useDispatch();

    // Mengambil data order history dari state Redux
    const { orderHistory, loading, error } = useSelector((state: RootState) => state.ordersSeller);

    // Panggil thunk untuk fetch order history saat page di-load
    useEffect(() => {
        dispatch(fetchSellerOrderHistory()); // Memanggil action untuk mengambil data order history
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <Sidebar /> {/* Sidebar untuk seller */}
            <div className={styles.mainContent}>
                <OrderSellerNavbar /> {/* Navbar untuk seller */}

                <h1>Order History</h1>

                {/* Tampilkan loading saat data sedang dimuat */}
                {loading && <p>Loading order history...</p>}

                {/* Tampilkan pesan error jika ada masalah */}
                {error && <p>Error: {error}</p>}

                {/* Tampilkan pesan jika tidak ada order history */}
                {!loading && orderHistory.length === 0 && (
                    <p>No order history available.</p>
                )}

                {/* Tampilkan daftar order history jika data tersedia */}
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
                                    <h2>{order.productName}</h2>
                                    <p>Total Amount: ${order.totalAmount}</p>
                                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <p>Payment Status: {order.paymentStatus}</p>
                                    <p>Shipping Status: {order.shippingStatus}</p>
                                    <p>Store: {order.storeName}</p>
                                    <p>Seller: {order.sellerName}</p>
                                    <p>Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
