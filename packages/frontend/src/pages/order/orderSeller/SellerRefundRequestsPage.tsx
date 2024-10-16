import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders, processRefundAction } from '../../../features/order/seller/ordersSellerSlice'; // Import actions
import { RootState } from '../../../app/store'; // Import RootState
import Sidebar from '../../../components/sidebar/SidebarSeller'; // Sidebar for seller
import OrderSellerNavbar from '../../../components/navbar_footer/OrderSellerNavbar'; // Import the new seller navbar
import ConfirmationModal from '../../../components/modal/modal_confirmation'; // Import modal for confirmation
import Modal from '../../../components/modal/modal_notification'; // Import modal for notification
import styles from './style/SellerRefundRequestsPage.module.css'; // CSS module for page styling

const RefundRequestsPage = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState(''); // To store success or error message

    // Get seller orders from the Redux state
    const { sellerOrders, loading, error } = useSelector((state: RootState) => state.ordersSeller);

    // Fetch seller orders when the page loads
    useEffect(() => {
        dispatch(fetchSellerOrders()); // Fetch all seller orders including refund requests
    }, [dispatch]);

    // Filter orders that have refund requests
    const refundRequests = sellerOrders.filter(
        (order) => order.shippingStatus === 'Refund Requested'
    );

    // Function to handle showing the confirmation modal for refund actions
    const handleShowModal = (orderId: number, action: 'approve' | 'reject') => {
        setSelectedOrderId(orderId);
        setSelectedAction(action);
        setShowModal(true);
    };

    // Function to handle confirming refund action
    const handleConfirmRefundAction = async () => {
        if (selectedOrderId && selectedAction) {
            const result = await dispatch(processRefundAction({ orderId: selectedOrderId, action: selectedAction }));
            if (processRefundAction.fulfilled.match(result)) {
                // Success case
                setNotificationMessage(`Refund ${selectedAction}d successfully!`);
                setShowNotificationModal(true);

                // Hide notification modal after 2 seconds and reload page
                setTimeout(() => {
                    setShowNotificationModal(false);
                    dispatch(fetchSellerOrders());  // Refresh the page after 2 seconds
                }, 2000);
            } else {
                // Failure case: Display error message
                setNotificationMessage('Failed to process refund, please try again.');
                setShowNotificationModal(true); // Show error notification
            }
            setShowModal(false); // Close the modal after confirmation
        }
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.container}>
            <Sidebar /> {/* Sidebar for seller */}
            <div className={styles.mainContent}>
                <OrderSellerNavbar /> {/* Navbar for seller's orders */}

                <h1>Refund Requests</h1>

                {/* Show loading message if data is being loaded */}
                {loading && <p>Loading refund requests...</p>}

                {/* Show information message if there are no refund requests */}
                {!loading && refundRequests.length === 0 && (
                    <p>No refund requests available.</p>
                )}

                {/* Display list of refund requests if available */}
                {refundRequests.length > 0 && (
                    <div className={styles.orderList}>
                        {refundRequests.map((order) => (
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
                                    <p>Shipping Status: {order.shippingStatus}</p>

                                    {/* Buttons to approve or reject refund */}
                                    <div className={styles.buttonGroup}>
                                        <button
                                            onClick={() => handleShowModal(order.id, 'approve')}
                                            className={styles.approveButton}
                                        >
                                            Approve Refund
                                        </button>

                                        <button
                                            onClick={() => handleShowModal(order.id, 'reject')}
                                            className={styles.rejectButton}
                                        >
                                            Reject Refund
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirmation Modal for Refund Action */}
                <ConfirmationModal
                    show={showModal}
                    message={`Are you sure you want to ${selectedAction} this refund request?`}
                    onConfirm={handleConfirmRefundAction}
                    onClose={handleCloseModal}
                />

                {/* Notification Modal */}
                <Modal
                    show={showNotificationModal}
                    message={notificationMessage} // Show success or failure message
                    onClose={() => setShowNotificationModal(false)}  // The modal will auto-close after 2 seconds
                />
            </div>
        </div>
    );
};

export default RefundRequestsPage;
