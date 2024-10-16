import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders, processRefundAction } from '../../../features/order/seller/ordersSellerSlice';
import { RootState } from '../../../app/store';
import Sidebar from '../../../components/sidebar/SidebarSeller';
import OrderSellerNavbar from '../../../components/navbar_footer/OrderSellerNavbar';
import ConfirmationModal from '../../../components/modal/modal_confirmation';
import Modal from '../../../components/modal/modal_notification';
import styles from './style/SellerRefundRequestsPage.module.css';
import Footer from '../../../components/navbar_footer/footer';

/**
 * RefundRequestsPage
 * This page shows all refund requests from the seller perspective.
 * The seller can approve or reject the refund requests.
 */
const RefundRequestsPage = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    /**
     * Fetches the seller orders when the page is first rendered.
     */
    useEffect(() => {
        dispatch(fetchSellerOrders());
    }, [dispatch]);

    const { sellerOrders, loading } = useSelector((state: RootState) => state.ordersSeller);

    /**
     * Filters the orders to show only refund requests.
     */
    const refundRequests = sellerOrders.filter((order) => order.shippingStatus === 'Refund Requested');

    /**
     * Shows the confirmation modal with the selected order and action.
     * @param {number} orderId The id of the order.
     * @param {'approve' | 'reject'} action The action to perform.
     */
    const handleShowModal = (orderId: number, action: 'approve' | 'reject') => {
        setSelectedOrderId(orderId);
        setSelectedAction(action);
        setShowModal(true);
    };

    /**
     * Processes the refund action when the user confirms the action.
     */
    const handleConfirmRefundAction = async () => {
        if (selectedOrderId && selectedAction) {
            const result = await dispatch(processRefundAction({ orderId: selectedOrderId, action: selectedAction }));
            if (processRefundAction.fulfilled.match(result)) {
                setNotificationMessage(`Refund ${selectedAction}d successfully!`);
                setShowNotificationModal(true);

                setTimeout(() => {
                    setShowNotificationModal(false);
                    dispatch(fetchSellerOrders());
                }, 2000);
            } else {
                setNotificationMessage(result.payload as string || 'Failed to process refund, please try again.');
                setShowNotificationModal(true);
            }
            setShowModal(false);
        }
    };

    /**
     * Closes the confirmation modal.
     */
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <OrderSellerNavbar />
            <div className={styles.mainContent}>

                <h1>Refund Requests</h1>

                {loading && <p>Loading refund requests...</p>}

                {!loading && refundRequests.length === 0 && (
                    <p>No refund requests available.</p>
                )}

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

                <ConfirmationModal
                    show={showModal}
                    message={`Are you sure you want to ${selectedAction} this refund request?`}
                    onConfirm={handleConfirmRefundAction}
                    onClose={handleCloseModal}
                />

                <Modal
                    show={showNotificationModal}
                    message={notificationMessage}
                    onClose={() => setShowNotificationModal(false)}
                />
            </div>

            <Footer />
        </div>
    );
};

export default RefundRequestsPage;
