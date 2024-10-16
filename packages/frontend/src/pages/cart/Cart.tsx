import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  viewCart,
  addItemToCart,
  reduceItemInCart,
  removeItemFromCart,
  checkoutSelectedItems,
} from '../../features/cart/cartSlice';
import SidebarShopper from '../../components/sidebar/sidebar_shopper';
import ConfirmationModal from '../../components/modal/modal_confirmation';
import Modal from '../../components/modal/modal_notification';
import styles from './style/Cart.module.css';
import Footer from '../../components/navbar_footer/footer';

/**
 * Page for cart
 * 
 * This page is used to display the cart items
 * of the shopper. The shopper can select items
 * to checkout and remove items from the cart.
 */

const Cart = () => {
  const dispatch = useDispatch();

  const { cartItems, loading } = useSelector((state: RootState) => state.cart);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    dispatch(viewCart());
  }, [dispatch]);

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(cartItems.map((item) => item.productId));
    }
  }, [cartItems]);

  /**
   * This function is used to toggle select for a product item in the cart.
   * If the item is already selected, it will be deselected. If the item is not
   * selected, it will be selected.
   * @param {number} productId The ID of the product item.
   */
  const handleToggleSelect = (productId: number) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  /**
   * This function is used to increase the quantity of a product item in the cart.
   * It will call the async thunk to increase the quantity of the product item.
   * After the async thunk is completed, it will call the viewCart action to
   * update the cart items.
   * @param {number} productId The ID of the product item.
   */
  const handleIncreaseQuantity = async (productId: number) => {
    await dispatch(addItemToCart({ productId, quantity: 1 }));
    dispatch(viewCart());
  };

  /**
   * This function is used to increase the quantity of a product item in the cart.
   * It will call the async thunk to increase the quantity of the product item.
   * After the async thunk is completed, it will call the viewCart action to
   * update the cart items.
   * @param {number} productId The ID of the product item.
   */
  const handleDecreaseQuantity = async (productId: number) => {
    await dispatch(reduceItemInCart({ productId }));
    dispatch(viewCart());
  };

  /**
   * This function is used to remove a product item from the cart.
   * It will call the async thunk to remove the product item.
   * After the async thunk is completed, it will call the viewCart action to
   * update the cart items.
   * @param {number} productId The ID of the product item.
   */
  const handleRemoveItem = async (productId: number) => {
    try {
      const result = await dispatch(removeItemFromCart({ productId }));
      if (removeItemFromCart.fulfilled.match(result)) {
        setSelectedItems(selectedItems.filter((id) => id !== productId));
        setNotificationMessage('Item removed successfully!');
      } else {
        throw new Error(result.payload as string || 'Failed to remove item. Please try again.');
      }
    } catch {
      setNotificationMessage( 'An error occurred while removing the item.');
    } finally {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      dispatch(viewCart());
    }
  };

  /**
   * This function is used to checkout the selected items in the cart.
   * It will call the async thunk to checkout the selected items.
   * After the async thunk is completed, it will show a notification
   * to indicate whether the checkout is successful or not.
   */
  const handleCheckout = async () => {
    try {
      const result = await dispatch(
        checkoutSelectedItems({ productIds: selectedItems, singleProductId: null, singleProductQuantity: null })
      );
      if (checkoutSelectedItems.fulfilled.match(result)) {
        setNotificationMessage('Checkout successful!');
      } else {
        throw new Error(result.payload as string || 'Checkout failed. Please try again.');
      }
    } catch (err: any) {
      setNotificationMessage(err.message || 'An error occurred during checkout.');
    } finally {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      dispatch(viewCart());
    }
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const showConfirmationModal = () => {
    setShowModal(true);
  };

  /**
   * This function is used to show the confirmation modal.
   * It will set the showModal state to true.
   */
  const confirmCheckout = () => {
    setShowModal(false);
    handleCheckout();
  };

  return (
    <div className={styles.Container}>
      <SidebarShopper /> {/* Sidebar for shopper */}

      <div className={styles.mainContent}>
        <h1>Your Cart</h1>

        {loading && <p>Loading cart...</p>}

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cartItems.map((item, index) => (
                <div key={`${item.productId}-${index}`} className={styles.cartItem}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId)}
                    onChange={() => handleToggleSelect(item.productId)}
                  />
                  <img
                    src={item.productImage || 'https://via.placeholder.com/150'}
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
                disabled={selectedItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}

        <ConfirmationModal
          show={showModal}
          message="Are you sure you want to checkout the selected items?"
          onConfirm={confirmCheckout}
          onClose={() => setShowModal(false)}
        />

        <Modal
          message={notificationMessage}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>

      <Footer /> {/* Footer at the bottom of the page */}
    </div>
  );
};

export default Cart;
