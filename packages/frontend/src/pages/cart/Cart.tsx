import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store'; // RootState to access the state
import {
  viewCart,
  addItemToCart,
  reduceItemInCart,
  removeItemFromCart,
  checkoutSelectedItems, // Import checkout action
} from '../../features/cart/cartSlice'; // Import cart actions
import SidebarShopper from '../../components/sidebar/sidebar_shopper'; // Import SidebarShopper component
import ConfirmationModal from '../../components/modal/modal_confirmation'; // Import ConfirmationModal component
import Modal from '../../components/modal/modal_notification'; // Import Modal for notifications
import styles from './style/Cart.module.css'; // Import the CSS module for cart styling

const Cart = () => {
  const dispatch = useDispatch();

  // Select cart items and loading state from the Redux state
  const { cartItems, loading } = useSelector((state: RootState) => state.cart);

  // State to manage which items are selected for checkout (default all selected)
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false); // State to control confirmation modal
  const [showNotification, setShowNotification] = useState(false); // State to control notification modal
  const [notificationMessage, setNotificationMessage] = useState(''); // State for notification message

  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(viewCart());
  }, [dispatch]);

  // Update selectedItems state when cartItems changes (default all selected)
  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(cartItems.map((item) => item.productId)); // Select all products by default
    }
  }, [cartItems]);

  // Function to toggle the selection of a product
  const handleToggleSelect = (productId: number) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  // Function to increase the quantity of an item
  const handleIncreaseQuantity = async (productId: number) => {
    await dispatch(addItemToCart({ productId, quantity: 1 }));
    dispatch(viewCart()); // Re-fetch the cart items after updating
  };

  // Function to decrease the quantity of an item
  const handleDecreaseQuantity = async (productId: number) => {
    await dispatch(reduceItemInCart({ productId }));
    dispatch(viewCart()); // Re-fetch the cart items after updating
  };

  // Function to remove an item from the cart
  const handleRemoveItem = async (productId: number) => {
    await dispatch(removeItemFromCart({ productId }));

    // Update the local state directly after removal
    setSelectedItems(selectedItems.filter((id) => id !== productId));

    // Manually remove the item from the cartItems in the Redux state
    dispatch(viewCart()); // Alternatively, fetch the cart again to refresh the view
  };

  // Function to handle checkout for selected items
  const handleCheckout = async () => {
    const result = await dispatch(
      checkoutSelectedItems({ productIds: selectedItems, singleProductId: null, singleProductQuantity: null })
    );
    if (checkoutSelectedItems.fulfilled.match(result)) {
      setNotificationMessage('Checkout successful!');
    } else {
      setNotificationMessage('Checkout failed. Please try again.');
    }

    // Show notification modal
    setShowNotification(true);

    // Hide the notification modal after 2 seconds, then refresh the cart
    setTimeout(() => {
      setShowNotification(false);
      dispatch(viewCart()); // Refresh cart after notification
    }, 2000);
  };

  // Calculate the total price for selected items
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.productId)) // Only include selected items
    .reduce((total, item) => total + item.price * item.quantity, 0);

  // Function to show confirmation modal
  const showConfirmationModal = () => {
    setShowModal(true);
  };

  // Function to handle modal confirmation
  const confirmCheckout = () => {
    setShowModal(false); // Hide modal
    handleCheckout(); // Perform checkout
  };

  return (
    <div className={styles.cartContainer}>
      <SidebarShopper /> {/* Sidebar for shopper */}

      <div className={styles.mainContent}>
        <h1>Your Cart</h1>

        {loading && <p>Loading cart...</p>}

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p> // Display this if there are no items in the cart
        ) : (
          <>
            <div className={styles.cartItems}>
              {cartItems.map((item, index) => (
                <div key={`${item.productId}-${index}`} className={styles.cartItem}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId)} // Checkbox is checked if item is selected
                    onChange={() => handleToggleSelect(item.productId)} // Toggle selection
                  />
                  <img
                    src={item.productImage || 'https://via.placeholder.com/150'} // Placeholder for missing images
                    alt={item.productName}
                    className={styles.productImage}
                  />
                  <div className={styles.itemDetails}>
                    <h2>{item.productName}</h2>
                    <p>${item.price}</p>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleIncreaseQuantity(item.productId)}
                      >
                        +
                      </button>
                    </div>
                    <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                    <button className={styles.removeButton} onClick={() => handleRemoveItem(item.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <h2>Cart Summary</h2>
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
              <button
                className={styles.checkoutButton}
                onClick={showConfirmationModal}
                disabled={selectedItems.length === 0} // Disable if no items are selected
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showModal}
          message="Are you sure you want to checkout the selected items?"
          onConfirm={confirmCheckout}
          onClose={() => setShowModal(false)} // Close modal on "No"
        />

        {/* Notification Modal */}
        <Modal
          message={notificationMessage}
          show={showNotification}
          onClose={() => setShowNotification(false)} // Manually close the notification if needed
        />
      </div>
    </div>
  );
};

export default Cart;
