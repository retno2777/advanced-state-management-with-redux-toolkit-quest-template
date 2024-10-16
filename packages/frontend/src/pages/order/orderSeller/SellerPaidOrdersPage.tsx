import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders, updateShippingStatus } from '../../../features/order/seller/ordersSellerSlice';
import { RootState } from '../../../app/store';
import Sidebar from '../../../components/sidebar/SidebarSeller';
import OrderSellerNavbar from '../../../components/navbar_footer/OrderSellerNavbar';
import ConfirmationModal from '../../../components/modal/modal_confirmation';
import Modal from '../../../components/modal/modal_notification';
import styles from './style/SellerPaidOrdersPage.module.css';
import Footer from '../../../components/navbar_footer/footer';

/**
 * This is the paid orders page for the seller.
 *
 * It shows a list of paid orders, which is fetched from the API using the `fetchSellerOrders` action.
 * The list is filtered to only show orders that have a payment status of "Paid" and a shipping status that is not "Refund Requested".
 *
 * The page shows a confirmation modal when the user tries to update the shipping status of an order.
 * The modal asks the user to confirm the action and shows a notification message if the update is successful.
 */
const SellerPaidOrdersPage = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [showDeliverModal, setShowDeliverModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    const { sellerOrders, loading, error } = useSelector((state: RootState) => state.ordersSeller);

    useEffect(() => {
        /**
         * Fetch the seller orders when the component mounts.
         */
        dispatch(fetchSellerOrders());
    }, [dispatch]);

    const paidOrders = sellerOrders.filter(
        (order) => order.orderItem.paymentStatus === 'Paid' && order.shippingStatus !== 'Refund Requested'
    );

    const handleShowModal = (orderId: number) => {
        /**
         * Set the selected order ID and show the confirmation modal.
         */
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    const handleShowDeliverModal = (orderId: number) => {
        /**
         * Set the selected order ID and show the confirmation modal.
         */
        setSelectedOrderId(orderId);
        setShowDeliverModal(true);
    };

    const handleConfirmUpdateShippingStatus = () => {
        /**
         * Confirm the update and hide the modal.
         * If the update is successful, show a notification message.
         */
        if (selectedOrderId) {
            dispatch(updateShippingStatus({ orderId: selectedOrderId, shippingStatus: 'Shipped' }));
            setShowModal(false);
            setShowNotificationModal(true);
            setTimeout(() => {
                setShowNotificationModal(false);
                dispatch(fetchSellerOrders());
            }, 2000);
        }
    };

    const handleConfirmUpdateDeliverStatus = () => {
        /**
         * Confirm the update and hide the modal.
         * If the update is successful, show a notification message.
         */
        if (selectedOrderId) {
            dispatch(updateShippingStatus({ orderId: selectedOrderId, shippingStatus: 'Delivered' }));
            setShowDeliverModal(false);
            setShowNotificationModal(true);
            setTimeout(() => {
                setShowNotificationModal(false);
                window.location.reload();
            }, 2000);
        }
    };

    const handleCloseModal = () => {
        /**
         * Hide the confirmation modal.
         */
        setShowModal(false);
    };

    const handleCloseDeliverModal = () => {
        /**
         * Hide the confirmation modal.
         */
        setShowDeliverModal(false);
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <OrderSellerNavbar />
            <div className={styles.mainContent}>

                <h1>Paid Orders</h1>
                {loading && <p>Loading orders...</p>}
                {error && <p>Error: {error}</p>}

                {!loading && paidOrders.length === 0 && (
                    <p>No paid orders available.</p>
                )}

                {paidOrders.length > 0 && (
                    <div className={styles.orderList}>
                        {paidOrders.map((order) => (
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
                                            <tr>
                                                <td><strong>Shipping Status</strong></td>
                                                <td>:</td>
                                                <td>{order.shippingStatus}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className={styles.buttonGroup}>
                                        <button
                                            onClick={() => handleShowModal(order.id)}
                                            className={styles.updateShippingButton}
                                        >
                                            Mark as Shipped
                                        </button>
                                        <button
                                            onClick={() => handleShowDeliverModal(order.id)}
                                            className={styles.updateDeliverButton}
                                        >
                                            Mark as Delivered
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <ConfirmationModal
                    show={showModal}
                    message="Are you sure you want to mark this order as shipped?"
                    onConfirm={handleConfirmUpdateShippingStatus}
                    onClose={handleCloseModal}
                />

                <ConfirmationModal
                    show={showDeliverModal}
                    message="Are you sure you want to mark this order as delivered?"
                    onConfirm={handleConfirmUpdateDeliverStatus}
                    onClose={handleCloseDeliverModal}
                />

                <Modal
                    show={showNotificationModal}
                    message="Shipping status updated successfully!"
                    onClose={() => setShowNotificationModal(false)}
                />
            </div>
            <Footer />
        </div>
    );
};


export default SellerPaidOrdersPage;
