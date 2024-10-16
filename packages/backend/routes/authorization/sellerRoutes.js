import { Router } from "express";
import { tokenVerification, isActiveCheck, sellerAccess } from "../../security/authentication.js"; 
import { loadProfile, updateProfile, changePassword, changeEmail, deleteProfile } from "../../controllers/seller/profile/sellerProfileControllers.js"; 
import { uploadSingleFile } from "../../middleware/upload.js"; 
import { createProduct, updateProduct, deleteProduct, viewAllProductsSeller, getProductById, viewAllProducts } from "../../controllers/product/productControllers.js";  // Import product controllers
import { getSellerOrders, updateShippingStatus, getSellerOrderHistory } from "../../controllers/seller/order/orderControllers.js"; 
import { handleRefundRequest } from "../../controllers/seller/order/handleRefundRequest.js"; 

const sellerRoute = Router();

// Route to load seller profile (without isActive check)
sellerRoute.get("/profile", tokenVerification, sellerAccess, loadProfile);

// Route to update seller profile with image (without isActive check)
sellerRoute.put("/profile", tokenVerification, sellerAccess, uploadSingleFile('profilePicture'), updateProfile);

// Route to change seller password (without isActive check)
sellerRoute.put("/change-password", tokenVerification, sellerAccess, changePassword);

// Route to change seller email (without isActive check)
sellerRoute.put("/change-email", tokenVerification, sellerAccess, changeEmail);

// Route to delete seller profile (with isActive check, restricting if the seller has active transactions)
sellerRoute.delete("/profile", tokenVerification, isActiveCheck, sellerAccess, deleteProfile);

// Route to create a new product (restricted to active sellers)
sellerRoute.post("/products", tokenVerification, isActiveCheck, sellerAccess, uploadSingleFile('productImage'), createProduct);  // Corrected middleware usage for image upload

// Route to update a product (restricted to active sellers)
sellerRoute.put("/products/:productId", tokenVerification, isActiveCheck, sellerAccess, uploadSingleFile('productImage'), updateProduct);  // Corrected middleware usage for image upload

// Route to delete a product (restricted to active sellers)
sellerRoute.delete("/products/:productId", tokenVerification, isActiveCheck, sellerAccess, deleteProduct);

// Route to view all seller products (without isActive check)
sellerRoute.get("/products", tokenVerification, sellerAccess, viewAllProductsSeller);

sellerRoute.get("/products/:id", tokenVerification, sellerAccess, isActiveCheck, getProductById);

// Route to get all seller orders (restricted to active sellers)
sellerRoute.get("/orders", tokenVerification, isActiveCheck, sellerAccess, getSellerOrders);

// Route to update the shipping status of seller orders (restricted to active sellers)
sellerRoute.put("/orders/shipping-status", tokenVerification, isActiveCheck, sellerAccess, updateShippingStatus);

// Route to get seller order history (without isActive check)
sellerRoute.get("/orders/history", tokenVerification, sellerAccess, getSellerOrderHistory);

// Route for seller to confirm or reject refund (restricted to active sellers)
sellerRoute.put("/orders/refund", tokenVerification, isActiveCheck, sellerAccess, handleRefundRequest);

export default sellerRoute;
