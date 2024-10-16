import { Router } from "express";
import { tokenVerification, isActiveCheck, shopperAccess } from "../../security/authentication.js";
import { uploadSingleFile } from "../../middleware/upload.js";  
import { viewAllProducts } from "../../controllers/product/productControllers.js";  
import { loadProfile, updateProfile, changePassword, deleteProfile, changeEmail } from "../../controllers/shopper/profile/shopperProfileContollers.js";
import { addItemToCart, reduceItemInCart, removeItemFromCart, viewCart } from "../../controllers/shopper/cart/cartControllers.js";
import { checkoutSelectedItems } from "../../controllers/shopper/cart/checkout.js";
import { getOrderItems, getOrderHistory } from '../../controllers/shopper/Transaction/viewOrderItem.js';
import { requestCancellationOrRefund } from '../../controllers/shopper/Transaction/requestCancellationOrRefund.js';
import { simulatePayment } from "../../controllers/shopper/Transaction/payment.js"; 
import { confirmOrderReceipt } from "../../controllers/shopper/Transaction/accepted.js";

// Create a new router for shopper
const shopperRoute = Router();

// Route to load shopper profile (without isActive check)
shopperRoute.get("/profile", tokenVerification, shopperAccess, loadProfile);

// Route to update shopper profile with image (without isActive check)
shopperRoute.put("/profile", tokenVerification, shopperAccess, uploadSingleFile('profilePicture'), updateProfile);  // Updated image upload middleware

// Route to change shopper password (without isActive check)
shopperRoute.put("/change-password", tokenVerification, shopperAccess, changePassword);

// Route to change shopper email (without isActive check)
shopperRoute.put("/change-email", tokenVerification, shopperAccess, changeEmail);

// Route to delete shopper profile (with isActive check, can be deleted only if there are no active transactions)
shopperRoute.delete("/profile", tokenVerification, isActiveCheck, shopperAccess, deleteProfile);

// Route to view all cart items (restricted to active shoppers)
shopperRoute.get("/cart", tokenVerification, isActiveCheck, shopperAccess, viewCart);  // Changed to GET for consistency

// Route to add an item to the cart (restricted to active shoppers)
shopperRoute.post("/cart/add", tokenVerification, isActiveCheck, shopperAccess, addItemToCart);

// Route to reduce item quantity in the cart (restricted to active shoppers)
shopperRoute.post("/cart/reduce", tokenVerification, isActiveCheck, shopperAccess, reduceItemInCart);

// Route to remove an item from the cart (restricted to active shoppers)
shopperRoute.post("/cart/remove", tokenVerification, isActiveCheck, shopperAccess, removeItemFromCart);

// Route to perform checkout from the cart (restricted to active shoppers)
shopperRoute.post("/checkout", tokenVerification, isActiveCheck, shopperAccess, checkoutSelectedItems);

// Route to view order items (restricted to active shoppers)
shopperRoute.get("/orders", tokenVerification, isActiveCheck, shopperAccess, getOrderItems);

// Route to view order history (restricted to active shoppers)
shopperRoute.get("/order-history", tokenVerification, isActiveCheck, shopperAccess, getOrderHistory);

// Route to request cancellation or refund (restricted to active shoppers)
shopperRoute.post("/request-cancellation", tokenVerification, isActiveCheck, shopperAccess, requestCancellationOrRefund);

// Route to simulate payment (restricted to active shoppers)
shopperRoute.post("/simulate-payment", tokenVerification, isActiveCheck, shopperAccess, simulatePayment);

// Route to confirm order receipt (restricted to active shoppers)
shopperRoute.post("/confirm-order", tokenVerification, isActiveCheck, shopperAccess, confirmOrderReceipt);

// Route to view all products (without isActive check)
shopperRoute.get("/products", tokenVerification, shopperAccess, viewAllProducts);

export default shopperRoute;
