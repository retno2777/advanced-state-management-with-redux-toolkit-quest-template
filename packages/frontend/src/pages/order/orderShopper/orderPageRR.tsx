import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems } from '../../../features/order/shopper/ordersShopperSlice'; // Hanya fetch order
import { RootState } from '../../../app/store'; // Import tipe RootState
import Sidebar from '../../../components/sidebar/sidebar_shopper'; // Import komponen Sidebar
import OrderNavbar from '../../../components/navbar_footer/OrderShopperNavbar'; // Import OrderNavbar
import styles from './style/OrderRequestRefund.module.css'; // Import CSS module

const RefundRequestPage = () => {
    const dispatch = useDispatch();

    // Ambil data pesanan dari state Redux
    const { orderItems, loading, error } = useSelector((state: RootState) => state.ordersShopper);

    // Panggil thunk untuk memuat pesanan ketika halaman pertama kali di-render
    useEffect(() => {
        dispatch(fetchOrderItems());
    }, [dispatch]);

    // Filter pesanan yang status pengirimannya "Refund Requested"
    const refundRequestedOrders = orderItems.filter(
        (order) => order.shippingStatus === 'Refund Requested'
    );

    return (
        <div className={styles.container}>
            <Sidebar /> {/* Sidebar tetap di samping kiri */}
            <div className={styles.mainContent}>
                <OrderNavbar /> {/* Navbar untuk semua jenis pesanan */}

                <h1>Refund Requested Orders</h1>

                {/* Tampilkan pesan loading jika data sedang dimuat */}
                {loading && <p>Loading orders...</p>}

                {/* Tampilkan pesan error jika terjadi kesalahan */}
                {error && <p>Error: {error}</p>}

                {/* Jika semua data pesanan kosong */}
                {orderItems.length === 0 && !loading && !error && (
                    <p>Your order list is empty.</p>
                )}

                {/* Jika tidak ada pesanan yang meminta refund */}
                {refundRequestedOrders.length === 0 && orderItems.length > 0 && (
                    <p>No refund requests available.</p>
                )}

                {/* Tampilkan daftar pesanan yang meminta refund jika ada */}
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
                                    <p>Total Amount: ${order.totalAmount}</p>
                                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <p>Shipping Status: {order.shippingStatus}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RefundRequestPage;
