import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders, updateShippingStatus } from '../../../features/order/seller/ordersSellerSlice'; // Thunk for fetching and updating orders
import { RootState } from '../../../app/store'; // Import RootState
import Sidebar from '../../../components/sidebar/SidebarSeller'; // Sidebar for seller
import OrderSellerNavbar from '../../../components/navbar_footer/OrderSellerNavbar'; // Import the new seller navbar
import ConfirmationModal from '../../../components/modal/modal_confirmation'; // Import modal for confirmation
import Modal from '../../../components/modal/modal_notification'; // Import modal for notification
import styles from './style/SellerPaidOrdersPage.module.css'; // CSS module for page styling

const SellerPaidOrdersPage = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [showDeliverModal, setShowDeliverModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    // Get seller orders from the Redux state
    const { sellerOrders, loading, error } = useSelector((state: RootState) => state.ordersSeller);

    // Fetch seller orders when the page loads
    useEffect(() => {
        dispatch(fetchSellerOrders()); // Fetch all seller orders
    }, [dispatch]);

    // Filter orders that are paid
    const paidOrders = sellerOrders.filter(
        (order) => order.orderItem.paymentStatus === 'Paid'
    );

    // Function to handle showing the confirmation modal for "Shipped"
    const handleShowModal = (orderId: number) => {
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    // Function to handle showing the confirmation modal for "Delivered"
    const handleShowDeliverModal = (orderId: number) => {
        setSelectedOrderId(orderId);
        setShowDeliverModal(true);
    };

    // Function to handle confirming the shipping status update to "Shipped"
    const handleConfirmUpdateShippingStatus = () => {
        if (selectedOrderId) {
            dispatch(updateShippingStatus({ orderId: selectedOrderId, shippingStatus: 'Shipped' }));
            setShowModal(false);
            setShowNotificationModal(true);

            // Hide notification modal after 2 seconds and reload page
            setTimeout(() => {
                setShowNotificationModal(false);
                dispatch(fetchSellerOrders());  // Refresh the page after 2 seconds
            }, 2000);
        }
    };

    // Function to handle confirming the shipping status update to "Delivered"
    const handleConfirmUpdateDeliverStatus = () => {
        if (selectedOrderId) {
            dispatch(updateShippingStatus({ orderId: selectedOrderId, shippingStatus: 'Delivered' }));
            setShowDeliverModal(false);
            setShowNotificationModal(true);

            // Hide notification modal after 2 seconds and reload page
            setTimeout(() => {
                setShowNotificationModal(false);
                window.location.reload();  // Refresh the page after 2 seconds
            }, 2000);
        }
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Function to close the deliver modal
    const handleCloseDeliverModal = () => {
        setShowDeliverModal(false);
    };

    return (
        <div className={styles.container}>
            <Sidebar /> {/* Sidebar for seller */}
            <div className={styles.mainContent}>
                <OrderSellerNavbar /> {/* Navbar for seller's orders */}

                <h1>Paid Orders</h1>

                {/* Show loading message if data is being loaded */}
                {loading && <p>Loading orders...</p>}

                {/* Show information message if there are no paid orders */}
                {!loading && paidOrders.length === 0 && (
                    <p>No paid orders available.</p>
                )}

                {/* Display list of paid orders if available */}
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
                                    <p>Total Amount: ${order.totalAmount}</p>
                                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <p>Payment Status: {order.orderItem.paymentStatus}</p>
                                    <p>Shipping Status: {order.shippingStatus}</p>

                                    {/* Buttons to update shipping status */}
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

                {/* Confirmation Modal for Shipped */}
                <ConfirmationModal
                    show={showModal}
                    message="Are you sure you want to mark this order as shipped?"
                    onConfirm={handleConfirmUpdateShippingStatus}
                    onClose={handleCloseModal}
                />

                {/* Confirmation Modal for Delivered */}
                <ConfirmationModal
                    show={showDeliverModal}
                    message="Are you sure you want to mark this order as delivered?"
                    onConfirm={handleConfirmUpdateDeliverStatus}
                    onClose={handleCloseDeliverModal}
                />

                {/* Notification Modal */}
                <Modal
                    show={showNotificationModal}
                    message="Shipping status updated successfully!"
                    onClose={() => setShowNotificationModal(false)}  // The modal will auto-close after 2 seconds, but this is required by the Modal component
                />
            </div>
        </div>
    );
};

export default SellerPaidOrdersPage;
